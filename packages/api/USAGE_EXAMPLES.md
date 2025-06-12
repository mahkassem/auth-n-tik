# API Usage Examples

## Starting the Application

```bash
# Start the development server
npm run start:dev

# The API will be available at http://localhost:3000
```

## API Examples

### 1. Register a New User

```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "fullName": "John Doe",
    "password": "securepassword@123"
  }'
```

**Expected Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "john.doe@example.com",
  "fullName": "John Doe",
  "createdAt": "2025-05-24T10:00:00.000Z",
  "updatedAt": "2025-05-24T10:00:00.000Z"
}
```

### 2. Get User Profile

```bash
curl -X GET http://localhost:3000/users/profile/123e4567-e89b-12d3-a456-426614174000
```

**Expected Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "email": "john.doe@example.com",
  "fullName": "John Doe",
  "createdAt": "2025-05-24T10:00:00.000Z",
  "updatedAt": "2025-05-24T10:00:00.000Z"
}
```

### 3. Error Handling Examples

#### Duplicate Email Registration
```bash
curl -X POST http://localhost:3000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "fullName": "Jane Doe",
    "password": "anotherpassword"
  }'
```

**Expected Response (409 Conflict):**
```json
{
  "statusCode": 409,
  "message": "User with this email already exists",
  "error": "Conflict"
}
```

#### Invalid UUID for Profile
```bash
curl -X GET http://localhost:3000/users/profile/invalid-uuid
```

**Expected Response (400 Bad Request):**
```json
{
  "statusCode": 400,
  "message": "Validation failed (uuid is expected)",
  "error": "Bad Request"
}
```

#### User Not Found
```bash
curl -X GET http://localhost:3000/users/profile/123e4567-e89b-12d3-a456-426614174999
```

**Expected Response (404 Not Found):**
```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "Not Found"
}
```

## Database Setup

Make sure you have PostgreSQL running and the database exists:

```bash
# Create database (if it doesn't exist)
createdb auth-n-tik_db

# Or use the connection string from environment
export POSTGRES_CONNECTION_STRING="postgresql://username:password@localhost:5432/auth-n-tik_db"
```

The application will automatically create the users table when it starts (due to `synchronize: true` in development).
