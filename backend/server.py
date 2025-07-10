from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, WebSocket, WebSocketDisconnect
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict
import uuid
from datetime import datetime, timedelta
from passlib.context import CryptContext
from jose import JWTError, jwt
import hashlib
import json
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
db_name = os.environ['DB_NAME']
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-super-secret-jwt-key-change-in-production')
JWT_ALGORITHM = "HS256"
JWT_EXPIRES_IN = os.environ.get('JWT_EXPIRES_IN', '7d')

# WebSocket Connection Manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        
    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
        
    def disconnect(self, websocket: WebSocket, user_id: str):
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
                
    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_text(message)
                except:
                    # Connection closed, remove it
                    await self.disconnect(connection, user_id)
                    
    async def broadcast_to_user(self, data: dict, user_id: str):
        message = json.dumps(data)
        await self.send_personal_message(message, user_id)

manager = ConnectionManager()

# JWT Configuration
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-super-secret-jwt-key-change-in-production')
JWT_ALGORITHM = "HS256"
JWT_EXPIRES_IN = os.environ.get('JWT_EXPIRES_IN', '7d')

# Create the main app
app = FastAPI(title="Sports Betting Calculator API", version="1.0.0")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# User Models
class UserBase(BaseModel):
    email: EmailStr
    username: str
    full_name: Optional[str] = None
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Calculator Data Models
class SingleCalculatorData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    match_name: str = ""
    stake: float = 0.0
    odds: float = 0.0
    commission: float = 0.0
    potential_profit: float = 0.0
    lay_odds: float = 0.0
    lay_stake: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ProCalculatorData(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    match_name: str = ""
    back_stake: float = 0.0
    back_odds: float = 0.0
    lay_stake: float = 0.0
    lay_odds: float = 0.0
    commission: float = 0.0
    profit_loss: float = 0.0
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class BrokerAccount(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    account_name: str
    balance: float = 0.0
    commission_rate: float = 0.0
    account_type: str = "betfair"  # betfair, smarkets, etc.
    is_active: bool = True
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# Utility Functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    
    user = await db.users.find_one({"username": token_data.username})
    if user is None:
        raise credentials_exception
    
    return User(**user)

# Authentication Routes
@api_router.post("/auth/register", response_model=User)
async def register(user: UserCreate):
    # Check if user already exists
    existing_user = await db.users.find_one({"$or": [{"username": user.username}, {"email": user.email}]})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username or email already registered"
        )
    
    # Hash password and create user
    hashed_password = get_password_hash(user.password)
    user_dict = user.dict()
    user_dict.pop("password")
    user_dict["hashed_password"] = hashed_password
    
    new_user = User(**{k: v for k, v in user_dict.items() if k != "hashed_password"})
    await db.users.insert_one(user_dict)  # Insert the full dict with hashed_password
    
    return new_user

@api_router.post("/auth/login", response_model=dict)
async def login(user_credentials: UserLogin):
    # Find user
    user = await db.users.find_one({"username": user_credentials.username})
    if not user or not verify_password(user_credentials.password, user.get("hashed_password")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(days=7)
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=access_token_expires
    )
    
    # Remove sensitive data from user object
    user_data = User(**user)
    
    return {
        "user": user_data,
        "token": access_token,
        "token_type": "bearer"
    }

@api_router.get("/auth/me", response_model=dict)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    return {"user": current_user}

@api_router.post("/auth/logout")
async def logout():
    return {"message": "Successfully logged out"}

# Single Calculator Routes
@api_router.get("/single/data")
async def get_single_data(current_user: User = Depends(get_current_user)):
    data = await db.single_calculator.find({"user_id": current_user.id}).to_list(1000)
    return [SingleCalculatorData(**item) for item in data]

@api_router.post("/single/data")
async def save_single_data(data: SingleCalculatorData, current_user: User = Depends(get_current_user)):
    data.user_id = current_user.id
    data.updated_at = datetime.utcnow()
    
    # Check if record exists
    existing = await db.single_calculator.find_one({"id": data.id, "user_id": current_user.id})
    if existing:
        await db.single_calculator.update_one(
            {"id": data.id, "user_id": current_user.id},
            {"$set": data.dict()}
        )
    else:
        await db.single_calculator.insert_one(data.dict())
    
    return data

# Pro Calculator Routes
@api_router.get("/pro/data")
async def get_pro_data(current_user: User = Depends(get_current_user)):
    data = await db.pro_calculator.find({"user_id": current_user.id}).to_list(1000)
    return [ProCalculatorData(**item) for item in data]

@api_router.post("/pro/data")
async def save_pro_data(data: ProCalculatorData, current_user: User = Depends(get_current_user)):
    data.user_id = current_user.id
    data.updated_at = datetime.utcnow()
    
    # Check if record exists
    existing = await db.pro_calculator.find_one({"id": data.id, "user_id": current_user.id})
    if existing:
        await db.pro_calculator.update_one(
            {"id": data.id, "user_id": current_user.id},
            {"$set": data.dict()}
        )
    else:
        await db.pro_calculator.insert_one(data.dict())
    
    return data

# Broker Account Routes
@api_router.get("/broker/accounts")
async def get_broker_accounts(current_user: User = Depends(get_current_user)):
    accounts = await db.broker_accounts.find({"user_id": current_user.id}).to_list(1000)
    return [BrokerAccount(**account) for account in accounts]

@api_router.post("/broker/accounts")
async def save_broker_account(account: BrokerAccount, current_user: User = Depends(get_current_user)):
    account.user_id = current_user.id
    account.updated_at = datetime.utcnow()
    
    # Check if record exists
    existing = await db.broker_accounts.find_one({"id": account.id, "user_id": current_user.id})
    if existing:
        await db.broker_accounts.update_one(
            {"id": account.id, "user_id": current_user.id},
            {"$set": account.dict()}
        )
    else:
        await db.broker_accounts.insert_one(account.dict())
    
    return account

@api_router.put("/broker/accounts/{account_id}")
async def update_broker_account(account_id: str, account: BrokerAccount, current_user: User = Depends(get_current_user)):
    account.user_id = current_user.id
    account.id = account_id
    account.updated_at = datetime.utcnow()
    
    result = await db.broker_accounts.update_one(
        {"id": account_id, "user_id": current_user.id},
        {"$set": account.dict()}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Account not found")
    
    return account

@api_router.delete("/broker/accounts/{account_id}")
async def delete_broker_account(account_id: str, current_user: User = Depends(get_current_user)):
    result = await db.broker_accounts.delete_one({"id": account_id, "user_id": current_user.id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Account not found")
    
    return {"message": "Account deleted successfully"}

# Health Check
@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

# WebSocket endpoint for real-time updates
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)
    try:
        # Send welcome message
        await manager.broadcast_to_user({
            "type": "connection",
            "message": "Connected to real-time updates",
            "timestamp": datetime.utcnow().isoformat()
        }, user_id)
        
        while True:
            # Keep connection alive and listen for messages
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            if message_data.get("type") == "ping":
                await manager.broadcast_to_user({
                    "type": "pong",
                    "timestamp": datetime.utcnow().isoformat()
                }, user_id)
                
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)

# Enhanced save endpoints with real-time updates
@api_router.post("/single/data")
async def save_single_data(data: SingleCalculatorData, current_user: User = Depends(get_current_user)):
    data.user_id = current_user.id
    data.updated_at = datetime.utcnow()
    
    # Check if record exists
    existing = await db.single_calculator.find_one({"id": data.id, "user_id": current_user.id})
    if existing:
        await db.single_calculator.update_one(
            {"id": data.id, "user_id": current_user.id},
            {"$set": data.dict()}
        )
    else:
        await db.single_calculator.insert_one(data.dict())
    
    # Send real-time update
    await manager.broadcast_to_user({
        "type": "data_update",
        "calculator": "single",
        "action": "save",
        "data": data.dict(),
        "timestamp": datetime.utcnow().isoformat()
    }, current_user.id)
    
    return data

@api_router.post("/pro/data")
async def save_pro_data(data: ProCalculatorData, current_user: User = Depends(get_current_user)):
    data.user_id = current_user.id
    data.updated_at = datetime.utcnow()
    
    # Check if record exists
    existing = await db.pro_calculator.find_one({"id": data.id, "user_id": current_user.id})
    if existing:
        await db.pro_calculator.update_one(
            {"id": data.id, "user_id": current_user.id},
            {"$set": data.dict()}
        )
    else:
        await db.pro_calculator.insert_one(data.dict())
    
    # Send real-time update
    await manager.broadcast_to_user({
        "type": "data_update",
        "calculator": "pro",
        "action": "save",
        "data": data.dict(),
        "timestamp": datetime.utcnow().isoformat()
    }, current_user.id)
    
    return data

@api_router.post("/broker/accounts")
async def save_broker_account(account: BrokerAccount, current_user: User = Depends(get_current_user)):
    account.user_id = current_user.id
    account.updated_at = datetime.utcnow()
    
    # Check if record exists
    existing = await db.broker_accounts.find_one({"id": account.id, "user_id": current_user.id})
    if existing:
        await db.broker_accounts.update_one(
            {"id": account.id, "user_id": current_user.id},
            {"$set": account.dict()}
        )
    else:
        await db.broker_accounts.insert_one(account.dict())
    
    # Send real-time update
    await manager.broadcast_to_user({
        "type": "data_update",
        "calculator": "broker",
        "action": "save",
        "data": account.dict(),
        "timestamp": datetime.utcnow().isoformat()
    }, current_user.id)
    
    return account

# Legacy status check (keeping for compatibility)
@api_router.get("/")
async def root():
    return {"message": "Sports Betting Calculator API v1.0.0"}

# Include the router in the main app
app.include_router(api_router)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],  # In production, specify your frontend domain
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    logger.info("Starting Sports Betting Calculator API...")
    
    # Create admin user if it doesn't exist
    admin_username = os.environ.get('ADMIN_USERNAME', 'admin')
    admin_password = os.environ.get('ADMIN_PASSWORD', 'password123')
    admin_email = os.environ.get('ADMIN_EMAIL', 'admin@bettingcalc.com')
    
    existing_admin = await db.users.find_one({"username": admin_username})
    if not existing_admin:
        admin_user = User(
            username=admin_username,
            email=admin_email,
            full_name="Administrator",
            is_active=True
        )
        admin_dict = admin_user.dict()
        admin_dict["hashed_password"] = get_password_hash(admin_password)
        
        await db.users.insert_one(admin_dict)
        logger.info(f"Created admin user: {admin_username}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
    logger.info("Database connection closed.")
