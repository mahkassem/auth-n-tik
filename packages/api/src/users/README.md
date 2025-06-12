# Users API

This module provides user management functionality with MongoDB database integration using Mongoose.

## Endpoints

### POST /users/register
Register a new user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "fullName": "John Doe",
  "password": "password@123"
}
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "fullName": "John Doe",
  "createdAt": "2025-05-24T10:00:00.000Z",
  "updatedAt": "2025-05-24T10:00:00.000Z"
}
```

**Status Codes:**
- `201` - User created successfully
- `409` - User with this email already exists
- `400` - Validation error

### GET /users/profile/:id
Get user profile by ID.

**Parameters:**
- `id` - User UUID

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "fullName": "John Doe",
  "createdAt": "2025-05-24T10:00:00.000Z",
  "updatedAt": "2025-05-24T10:00:00.000Z"
}
```

**Status Codes:**
- `200` - Profile retrieved successfully
- `404` - User not found
- `400` - Invalid UUID format

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId, // MongoDB ObjectId (auto-generated)
  email: String, // Unique email address
  fullName: String, // User's full name
  password: String, // Hashed password
  createdAt: Date, // Auto-generated creation timestamp
  updatedAt: Date // Auto-generated update timestamp
}
```

## Features

- ✅ User registration with email validation
- ✅ Password hashing using bcryptjs
- ✅ User profile retrieval
- ✅ Email uniqueness validation
- ✅ Input validation using class-validator
- ✅ MongoDB ObjectId primary keys
- ✅ Automatic timestamps
- ✅ Password exclusion from responses

## Environment Variables

- `MONGODB_CONNECTION_STRING` - MongoDB connection string (default: `mongodb://localhost:27017/auth-n-tik_db`)
- `NODE_ENV` - Environment (affects database synchronization and logging)
