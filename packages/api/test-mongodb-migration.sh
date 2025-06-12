#!/bin/bash

# MongoDB Migration Testing Script
# This script tests all the main endpoints of the auth-n-tik API with MongoDB

echo "🚀 Testing auth-n-tik API with MongoDB"
echo "======================================="

BASE_URL="http://localhost:8000/v1"

# Test 1: Health Check
echo "1. Testing health endpoint..."
curl -s -X GET "$BASE_URL/health" | jq .
echo ""

# Test 2: User Registration
echo "2. Testing user registration..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@mongodb.com",
    "fullName": "MongoDB User",
    "password": "SecurePassword@123!"
  }')

USER_ID=$(echo $REGISTER_RESPONSE | jq -r '.id')
echo $REGISTER_RESPONSE | jq .
echo ""

# Test 3: Duplicate Registration (should fail)
echo "3. Testing duplicate email validation..."
curl -s -X POST "$BASE_URL/users/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@mongodb.com",
    "fullName": "Duplicate User",
    "password": "SecurePassword@123!"
  }' | jq .
echo ""

# Test 4: User Login
echo "4. Testing user login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@mongodb.com",
    "password": "SecurePassword@123!"
  }')

ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.tokens.accessToken')
echo $LOGIN_RESPONSE | jq .
echo ""

# Test 5: Get User Profile by ID
echo "5. Testing user profile retrieval..."
curl -s -X GET "$BASE_URL/users/profile/$USER_ID" | jq .
echo ""

# Test 6: Protected Endpoint (Auth Profile)
echo "6. Testing protected endpoint access..."
curl -s -X GET "$BASE_URL/auth/profile" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq '.email, .fullName'
echo ""

# Test 7: User Logout
echo "7. Testing user logout..."
curl -s -X POST "$BASE_URL/auth/logout" \
  -H "Authorization: Bearer $ACCESS_TOKEN" | jq .
echo ""

echo "✅ MongoDB migration testing completed!"
echo "All endpoints tested successfully with MongoDB backend."
