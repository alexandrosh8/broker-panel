# Sports Betting Calculator Pro

A modern, full-stack sports betting calculator application with authentication, data export, analytics, and real-time synchronization capabilities.

## Features

- **Authentication System**: Secure login/logout with JWT tokens
- **Multiple Calculator Types**:
  - Single Calculator: Basic betting calculations
  - Pro Calculator: Advanced dual-account betting
  - Broker Accounts: Account management with leverage tracking
- **Advanced Analytics**: Charts and graphs for betting patterns
- **Data Export**: Export results to PDF and Excel formats
- **Real-time Sync**: Live data synchronization across devices
- **Modern UI**: Dark theme, responsive design, mobile-friendly
- **Progressive Web App**: Installable on devices

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, Chart.js, React Router
- **Backend**: FastAPI (Python), JWT Authentication
- **Database**: MongoDB
- **Build**: Vite with CRACO

## Demo Credentials

For testing purposes, use the following credentials:

**Username**: `admin`  
**Password**: `password123`

## Installation and Deployment

### Prerequisites

- Node.js (v16 or higher)
- Python 3.8+
- MongoDB

### Local Development

1. **Clone/Download the project files**
2. **Install dependencies**:
   ```bash
   # Frontend
   cd frontend
   yarn install
   
   # Backend
   cd ../backend
   pip install -r requirements.txt
   ```

3. **Set up environment variables**:
   - Frontend: Configure `REACT_APP_BACKEND_URL` in `frontend/.env`
   - Backend: Configure `MONGO_URL` in `backend/.env`

4. **Start the application**:
   ```bash
   # Start backend
   cd backend
   uvicorn server:app --reload --host 0.0.0.0 --port 8001
   
   # Start frontend (in new terminal)
   cd frontend
   yarn start
   ```

### Production Deployment to cPanel

#### Step 1: Build the Application

1. **Build the frontend**:
   ```bash
   cd frontend
   yarn build
   ```

2. **Prepare deployment files**:
   - The build will create a `build` directory with optimized files
   - The backend `server.py` and `requirements.txt` are ready for deployment

#### Step 2: Deploy to cPanel

1. **Access cPanel File Manager**:
   - Log into your cPanel account
   - Navigate to "File Manager"
   - Go to `public_html` directory (or your domain's document root)

2. **Upload Frontend Files**:
   - Upload all contents from `frontend/build/` directory to `public_html/`
   - This includes:
     - `index.html` (main HTML file)
     - `static/` folder (CSS, JS, and other assets)
     - `asset-manifest.json`

3. **Upload Backend Files**:
   - Create a new folder in `public_html/` called `api/` (or preferred name)
   - Upload the following backend files to this folder:
     - `server.py`
     - `requirements.txt`
     - `.env` (with your production MongoDB URL)

4. **Configure Python Environment**:
   - In cPanel, go to "Python App" or "Setup Python App"
   - Create a new Python application:
     - Python Version: 3.8+
     - App Root: `/public_html/api/`
     - App URL: `yourdomain.com/api`
     - Startup File: `server.py`
     - Application Entrypoint: `app`

5. **Install Python Dependencies**:
   - Access the Python app terminal in cPanel
   - Run: `pip install -r requirements.txt`

6. **Database Setup**:
   - Ensure your MongoDB is accessible from your hosting provider
   - Update the `MONGO_URL` in your backend `.env` file with production credentials

7. **Domain Configuration**:
   - Update frontend `.env` with your production backend URL
   - Rebuild frontend if necessary: `yarn build`
   - Re-upload the updated build files

#### Step 3: Verify Deployment

1. **Test the application**:
   - Visit your domain to access the frontend
   - Test login functionality with admin credentials
   - Verify all calculators are working
   - Check data export features

2. **Monitor logs**:
   - Check cPanel error logs for any Python/backend issues
   - Monitor JavaScript console for frontend errors

## User Management

### Creating New User Accounts

#### Option 1: Through Backend API (Recommended)

1. **Using API endpoint**:
   ```bash
   curl -X POST "https://yourdomain.com/api/auth/register" \
   -H "Content-Type: application/json" \
   -d '{
     "username": "newuser",
     "email": "user@example.com",
     "password": "securepassword123"
   }'
   ```

2. **Using Python script**:
   ```python
   import requests
   
   url = "https://yourdomain.com/api/auth/register"
   data = {
       "username": "newuser",
       "email": "user@example.com",
       "password": "securepassword123"
   }
   
   response = requests.post(url, json=data)
   print(response.json())
   ```

#### Option 2: Database Direct Access

1. **Access MongoDB directly**:
   ```javascript
   // Connect to your MongoDB
   use sports_betting_calculator
   
   // Insert new user (password should be hashed)
   db.users.insertOne({
     username: "newuser",
     email: "user@example.com",
     hashed_password: "$2b$12$hashExample", // Use bcrypt to hash password
     created_at: new Date()
   })
   ```

### Removing Demo Credentials

#### Option 1: Through Database

1. **Connect to MongoDB**:
   ```javascript
   use sports_betting_calculator
   
   // Remove the admin user
   db.users.deleteOne({username: "admin"})
   ```

#### Option 2: Modify Backend Code

1. **Edit `server.py`**:
   - Find the admin user creation code (usually in startup event)
   - Comment out or remove the admin user creation

2. **Restart the backend service**

## Features Guide

### Calculator Types

1. **Single Calculator**: Basic betting profit calculations
2. **Pro Calculator**: Advanced dual-account betting with arbitrage
3. **Broker Accounts**: Manage multiple betting accounts with leverage

### Data Export

- **PDF Export**: Professional reports with calculations
- **Excel Export**: Spreadsheet format for further analysis
- Available from all calculator pages

### Analytics Dashboard

- **Betting Patterns**: Visual charts of betting history
- **Profit/Loss Tracking**: Performance over time
- **Account Statistics**: Summary of all accounts

### Real-time Features

- **Live Sync**: Data updates across all devices
- **WebSocket Connection**: Real-time updates
- **Offline Support**: Works without internet (PWA)

## Troubleshooting

### Common Issues

1. **Frontend not loading**:
   - Check that all files are uploaded to correct directory
   - Verify file permissions (755 for directories, 644 for files)

2. **Backend API errors**:
   - Check Python app logs in cPanel
   - Verify environment variables are set correctly
   - Ensure MongoDB connection is working

3. **Authentication issues**:
   - Verify JWT secret is configured
   - Check that user exists in database
   - Ensure backend URL is correct in frontend

4. **Database connection errors**:
   - Verify MongoDB URL is correct
   - Check network connectivity to MongoDB
   - Ensure database user has proper permissions

### Support

For technical issues:
1. Check browser console for JavaScript errors
2. Review cPanel error logs for backend issues
3. Verify all environment variables are set correctly
4. Test API endpoints directly using tools like Postman

## License

© 2024 Betting Calculator Pro. All rights reserved.
