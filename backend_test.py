#!/usr/bin/env python3
"""
Sports Betting Calculator Backend API Test Suite
Tests authentication system and calculator data endpoints
"""

import requests
import json
import uuid
from datetime import datetime
import os
import sys

# Get backend URL from frontend .env file
def get_backend_url():
    try:
        with open('/app/frontend/.env', 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except Exception as e:
        print(f"Error reading frontend .env: {e}")
        return None

BASE_URL = get_backend_url()
if not BASE_URL:
    print("ERROR: Could not get backend URL from frontend/.env")
    sys.exit(1)

API_URL = f"{BASE_URL}/api"
print(f"Testing backend API at: {API_URL}")

# Test data
ADMIN_CREDENTIALS = {
    "username": "admin",
    "password": "password123"
}

NEW_USER_DATA = {
    "username": "testuser_" + str(uuid.uuid4())[:8],
    "email": f"test_{str(uuid.uuid4())[:8]}@example.com",
    "password": "testpass123",
    "full_name": "Test User"
}

# Global variables for storing tokens and user data
admin_token = None
user_token = None
test_user_data = None

def print_test_result(test_name, success, details=""):
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"{status} {test_name}")
    if details:
        print(f"    {details}")
    print()

def test_health_check():
    """Test the health check endpoint"""
    try:
        response = requests.get(f"{API_URL}/health", timeout=10)
        success = response.status_code == 200
        details = f"Status: {response.status_code}, Response: {response.json()}" if success else f"Status: {response.status_code}"
        print_test_result("Health Check", success, details)
        return success
    except Exception as e:
        print_test_result("Health Check", False, f"Exception: {str(e)}")
        return False

def test_admin_login():
    """Test admin login with correct credentials"""
    global admin_token
    try:
        response = requests.post(
            f"{API_URL}/auth/login",
            json=ADMIN_CREDENTIALS,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if "token" in data and "user" in data:
                admin_token = data["token"]
                print_test_result("Admin Login", True, f"Token received, User: {data['user']['username']}")
                return True
            else:
                print_test_result("Admin Login", False, "Missing token or user in response")
                return False
        else:
            print_test_result("Admin Login", False, f"Status: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        print_test_result("Admin Login", False, f"Exception: {str(e)}")
        return False

def test_invalid_login():
    """Test login with invalid credentials"""
    try:
        invalid_creds = {"username": "invalid", "password": "wrong"}
        response = requests.post(
            f"{API_URL}/auth/login",
            json=invalid_creds,
            timeout=10
        )
        
        success = response.status_code == 401
        details = f"Status: {response.status_code} (Expected 401)"
        print_test_result("Invalid Login Rejection", success, details)
        return success
    except Exception as e:
        print_test_result("Invalid Login Rejection", False, f"Exception: {str(e)}")
        return False

def test_get_current_user():
    """Test getting current user info with valid token"""
    if not admin_token:
        print_test_result("Get Current User", False, "No admin token available")
        return False
    
    try:
        headers = {"Authorization": f"Bearer {admin_token}"}
        response = requests.get(
            f"{API_URL}/auth/me",
            headers=headers,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            success = "user" in data and data["user"]["username"] == "admin"
            details = f"User: {data.get('user', {}).get('username', 'Unknown')}"
            print_test_result("Get Current User", success, details)
            return success
        else:
            print_test_result("Get Current User", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_test_result("Get Current User", False, f"Exception: {str(e)}")
        return False

def test_unauthorized_access():
    """Test accessing protected endpoint without token"""
    try:
        response = requests.get(f"{API_URL}/auth/me", timeout=10)
        success = response.status_code == 401
        details = f"Status: {response.status_code} (Expected 401)"
        print_test_result("Unauthorized Access Rejection", success, details)
        return success
    except Exception as e:
        print_test_result("Unauthorized Access Rejection", False, f"Exception: {str(e)}")
        return False

def test_user_registration():
    """Test user registration"""
    global test_user_data
    try:
        response = requests.post(
            f"{API_URL}/auth/register",
            json=NEW_USER_DATA,
            timeout=10
        )
        
        if response.status_code == 200:
            test_user_data = response.json()
            success = test_user_data["username"] == NEW_USER_DATA["username"]
            details = f"Registered user: {test_user_data['username']}"
            print_test_result("User Registration", success, details)
            return success
        else:
            print_test_result("User Registration", False, f"Status: {response.status_code}, Response: {response.text}")
            return False
    except Exception as e:
        print_test_result("User Registration", False, f"Exception: {str(e)}")
        return False

def test_new_user_login():
    """Test login with newly registered user"""
    global user_token
    if not test_user_data:
        print_test_result("New User Login", False, "No test user data available")
        return False
    
    try:
        login_data = {
            "username": NEW_USER_DATA["username"],
            "password": NEW_USER_DATA["password"]
        }
        response = requests.post(
            f"{API_URL}/auth/login",
            json=login_data,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if "token" in data:
                user_token = data["token"]
                print_test_result("New User Login", True, f"Token received for user: {data['user']['username']}")
                return True
            else:
                print_test_result("New User Login", False, "Missing token in response")
                return False
        else:
            print_test_result("New User Login", False, f"Status: {response.status_code}")
            return False
    except Exception as e:
        print_test_result("New User Login", False, f"Exception: {str(e)}")
        return False

def test_logout():
    """Test logout endpoint"""
    try:
        response = requests.post(f"{API_URL}/auth/logout", timeout=10)
        success = response.status_code == 200
        details = f"Status: {response.status_code}"
        print_test_result("Logout", success, details)
        return success
    except Exception as e:
        print_test_result("Logout", False, f"Exception: {str(e)}")
        return False

def test_single_calculator_data():
    """Test single calculator data endpoints"""
    if not admin_token:
        print_test_result("Single Calculator Data", False, "No admin token available")
        return False
    
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    try:
        # Test GET (should return empty list initially)
        response = requests.get(f"{API_URL}/single/data", headers=headers, timeout=10)
        if response.status_code != 200:
            print_test_result("Single Calculator GET", False, f"Status: {response.status_code}")
            return False
        
        # Test POST (create new data)
        test_data = {
            "id": str(uuid.uuid4()),
            "user_id": "will_be_set_by_backend",
            "match_name": "Test Match",
            "stake": 100.0,
            "odds": 2.5,
            "commission": 5.0,
            "potential_profit": 150.0,
            "lay_odds": 2.6,
            "lay_stake": 96.15
        }
        
        response = requests.post(f"{API_URL}/single/data", json=test_data, headers=headers, timeout=10)
        if response.status_code == 200:
            saved_data = response.json()
            success = saved_data["match_name"] == test_data["match_name"]
            details = f"Created single calculator data: {saved_data['match_name']}"
            print_test_result("Single Calculator CRUD", success, details)
            return success
        else:
            print_test_result("Single Calculator CRUD", False, f"POST Status: {response.status_code}")
            return False
            
    except Exception as e:
        print_test_result("Single Calculator CRUD", False, f"Exception: {str(e)}")
        return False

def test_pro_calculator_data():
    """Test pro calculator data endpoints"""
    if not admin_token:
        print_test_result("Pro Calculator Data", False, "No admin token available")
        return False
    
    headers = {"Authorization": f"Bearer {admin_token}"}
    
    try:
        # Test GET
        response = requests.get(f"{API_URL}/pro/data", headers=headers, timeout=10)
        if response.status_code != 200:
            print_test_result("Pro Calculator GET", False, f"Status: {response.status_code}")
            return False
        
        # Test POST
        test_data = {
            "id": str(uuid.uuid4()),
            "user_id": "will_be_set_by_backend",
            "match_name": "Pro Test Match",
            "back_stake": 100.0,
            "back_odds": 3.0,
            "lay_stake": 75.0,
            "lay_odds": 3.2,
            "commission": 5.0,
            "profit_loss": 25.0
        }
        
        response = requests.post(f"{API_URL}/pro/data", json=test_data, headers=headers, timeout=10)
        if response.status_code == 200:
            saved_data = response.json()
            success = saved_data["match_name"] == test_data["match_name"]
            details = f"Created pro calculator data: {saved_data['match_name']}"
            print_test_result("Pro Calculator CRUD", success, details)
            return success
        else:
            print_test_result("Pro Calculator CRUD", False, f"POST Status: {response.status_code}")
            return False
            
    except Exception as e:
        print_test_result("Pro Calculator CRUD", False, f"Exception: {str(e)}")
        return False

def test_broker_accounts():
    """Test broker accounts CRUD operations"""
    if not admin_token:
        print_test_result("Broker Accounts", False, "No admin token available")
        return False
    
    headers = {"Authorization": f"Bearer {admin_token}"}
    account_id = str(uuid.uuid4())
    
    try:
        # Test GET (initial)
        response = requests.get(f"{API_URL}/broker/accounts", headers=headers, timeout=10)
        if response.status_code != 200:
            print_test_result("Broker Accounts GET", False, f"Status: {response.status_code}")
            return False
        
        # Test POST (create)
        test_account = {
            "id": account_id,
            "user_id": "will_be_set_by_backend",
            "account_name": "Test Betfair Account",
            "balance": 1000.0,
            "commission_rate": 5.0,
            "account_type": "betfair",
            "is_active": True
        }
        
        response = requests.post(f"{API_URL}/broker/accounts", json=test_account, headers=headers, timeout=10)
        if response.status_code != 200:
            print_test_result("Broker Accounts CREATE", False, f"Status: {response.status_code}")
            return False
        
        # Test PUT (update)
        test_account["balance"] = 1500.0
        response = requests.put(f"{API_URL}/broker/accounts/{account_id}", json=test_account, headers=headers, timeout=10)
        if response.status_code != 200:
            print_test_result("Broker Accounts UPDATE", False, f"Status: {response.status_code}")
            return False
        
        # Test DELETE
        response = requests.delete(f"{API_URL}/broker/accounts/{account_id}", headers=headers, timeout=10)
        if response.status_code == 200:
            print_test_result("Broker Accounts CRUD", True, "All CRUD operations successful")
            return True
        else:
            print_test_result("Broker Accounts DELETE", False, f"Status: {response.status_code}")
            return False
            
    except Exception as e:
        print_test_result("Broker Accounts CRUD", False, f"Exception: {str(e)}")
        return False

def test_user_data_isolation():
    """Test that users can only access their own data"""
    if not admin_token or not user_token:
        print_test_result("User Data Isolation", False, "Missing required tokens")
        return False
    
    try:
        # Create data with admin user
        admin_headers = {"Authorization": f"Bearer {admin_token}"}
        admin_data = {
            "id": str(uuid.uuid4()),
            "user_id": "will_be_set_by_backend",
            "match_name": "Admin Only Match",
            "stake": 200.0,
            "odds": 1.5
        }
        
        response = requests.post(f"{API_URL}/single/data", json=admin_data, headers=admin_headers, timeout=10)
        if response.status_code != 200:
            print_test_result("User Data Isolation", False, "Failed to create admin data")
            return False
        
        # Try to access admin data with regular user token
        user_headers = {"Authorization": f"Bearer {user_token}"}
        response = requests.get(f"{API_URL}/single/data", headers=user_headers, timeout=10)
        
        if response.status_code == 200:
            user_data = response.json()
            # User should not see admin's data
            admin_match_found = any(item.get("match_name") == "Admin Only Match" for item in user_data)
            success = not admin_match_found
            details = f"User sees {len(user_data)} records, admin data isolated: {success}"
            print_test_result("User Data Isolation", success, details)
            return success
        else:
            print_test_result("User Data Isolation", False, f"Status: {response.status_code}")
            return False
            
    except Exception as e:
        print_test_result("User Data Isolation", False, f"Exception: {str(e)}")
        return False

def run_all_tests():
    """Run all backend tests"""
    print("=" * 60)
    print("SPORTS BETTING CALCULATOR BACKEND API TESTS")
    print("=" * 60)
    print()
    
    test_results = []
    
    # Basic connectivity and health
    test_results.append(("Health Check", test_health_check()))
    
    # Authentication tests
    test_results.append(("Admin Login", test_admin_login()))
    test_results.append(("Invalid Login Rejection", test_invalid_login()))
    test_results.append(("Get Current User", test_get_current_user()))
    test_results.append(("Unauthorized Access Rejection", test_unauthorized_access()))
    test_results.append(("User Registration", test_user_registration()))
    test_results.append(("New User Login", test_new_user_login()))
    test_results.append(("Logout", test_logout()))
    
    # Calculator data tests
    test_results.append(("Single Calculator CRUD", test_single_calculator_data()))
    test_results.append(("Pro Calculator CRUD", test_pro_calculator_data()))
    test_results.append(("Broker Accounts CRUD", test_broker_accounts()))
    
    # Security tests
    test_results.append(("User Data Isolation", test_user_data_isolation()))
    
    # Summary
    print("=" * 60)
    print("TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(1 for _, result in test_results if result)
    total = len(test_results)
    
    for test_name, result in test_results:
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{status} {test_name}")
    
    print()
    print(f"TOTAL: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED! Backend authentication system is working correctly.")
        return True
    else:
        print(f"⚠️  {total - passed} tests failed. Backend needs attention.")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)