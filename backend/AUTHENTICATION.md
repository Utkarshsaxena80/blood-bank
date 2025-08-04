# Blood Bank Authentication System

## Overview

This authentication system provides complete signup and login functionality for three types of users:
- **Patients**: People who need blood
- **Donors**: People who donate blood  
- **Blood Banks**: Organizations that manage blood inventory

## Features

✅ **JWT-based Authentication** with secure httpOnly cookies
✅ **Password Hashing** using bcrypt (12 rounds)
✅ **Input Validation** using Zod schemas
✅ **Cookie Management** with automatic persistence
✅ **Authentication Middleware** for protected routes
✅ **Cross-Origin Support** with credentials
✅ **Type Safety** with TypeScript
✅ **Error Handling** with detailed validation messages

## Quick Start

### 1. Environment Setup

Create a `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Make sure to set:
- `JWT_KEY`: Your secret key for JWT signing
- `DATABASE_URL`: Your PostgreSQL connection string
- `FRONTEND_URL`: Your frontend URL for CORS

### 2. Run the Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`

## API Endpoints

### Authentication Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/patient/signup` | Patient registration |
| POST | `/api/auth/patient/login` | Patient login |
| POST | `/api/auth/donor/signup` | Donor registration |
| POST | `/api/auth/donor/login` | Donor login |
| POST | `/api/auth/bloodbank/signup` | Blood bank registration |
| POST | `/api/auth/bloodbank/login` | Blood bank login |
| POST | `/api/auth/logout` | Logout (clears cookie) |
| GET | `/api/auth/check` | Check authentication status |

### Example Routes (for testing)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/example/profile` | Protected route (requires auth) |
| GET | `/api/example/public` | Public route (optional auth) |

## Usage Examples

### Frontend Implementation

```javascript
// Check if user is already authenticated on app load
const checkAuth = async () => {
  const response = await fetch('/api/auth/check', {
    credentials: 'include' // Important!
  });
  
  if (response.ok) {
    const data = await response.json();
    return data.success ? data.user : null;
  }
  return null;
};

// Patient signup
const signupPatient = async (userData) => {
  const response = await fetch('/api/auth/patient/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important!
    body: JSON.stringify(userData)
  });
  
  const data = await response.json();
  if (data.success) {
    // User is now authenticated, cookie is set
    window.location.href = '/dashboard';
  }
  return data;
};

// Login
const login = async (email, password, userType = 'patient') => {
  const response = await fetch(`/api/auth/${userType}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // Important!
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  if (data.success) {
    // User is now authenticated, cookie is set
    window.location.href = '/dashboard';
  }
  return data;
};

// Logout
const logout = async () => {
  await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include' // Important!
  });
  window.location.href = '/login';
};
```

### Testing with curl

```bash
# Patient signup
curl -X POST http://localhost:3000/api/auth/patient/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com", 
    "password": "password123",
    "phone": "1234567890",
    "BloodBank": "City Blood Bank",
    "BloodType": "O+",
    "city": "New York", 
    "state": "NY",
    "age": 25
  }' \
  -c cookies.txt

# Login (saves cookie)
curl -X POST http://localhost:3000/api/auth/patient/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}' \
  -c cookies.txt

# Access protected route (uses cookie)
curl http://localhost:3000/api/example/profile \
  -b cookies.txt

# Check auth status
curl http://localhost:3000/api/auth/check \
  -b cookies.txt

# Logout
curl -X POST http://localhost:3000/api/auth/logout \
  -b cookies.txt
```

## Database Schema

The system uses these Prisma models:

```prisma
model Patients {
  id        String   @id @default(uuid())
  name      String
  email     String
  password  String   // bcrypt hashed
  phone     String
  BloodBank String
  BloodType String   // A+, A-, B+, B-, AB+, AB-, O+, O-
  city      String
  state     String
  age       Int
  createdAt DateTime @default(now())
}

model donors {
  id        String   @id @default(uuid())
  name      String
  email     String
  password  String   // bcrypt hashed
  phone     String
  BloodBank String
  BloodType String   // A+, A-, B+, B-, AB+, AB-, O+, O-
  city      String
  state     String
  age       Int
  createdAt DateTime @default(now())
}

model bloodBanks {
  id             String   @id @default(uuid())
  name           String
  adminName      String
  licenseNumber  String
  email          String
  password       String   // bcrypt hashed
  phone          String
  totalBloodBags Int
  address        String
  city           String
  state          String
  createdAt      DateTime @default(now())
}
```

## Security Features

- **httpOnly Cookies**: Prevents XSS attacks
- **Secure Flag**: HTTPS-only in production
- **SameSite=strict**: Prevents CSRF attacks
- **Password Hashing**: bcrypt with 12 rounds
- **Input Validation**: Zod schemas validate all inputs
- **JWT Expiration**: Tokens expire after 7 days

## File Structure

```
├── controllers/
│   ├── auth.controllers.ts      # Authentication logic
│   └── example.controllers.ts   # Example protected routes
├── middlewares/
│   └── auth.middleware.ts       # JWT verification middleware
├── routes/
│   ├── auth.routes.ts          # Authentication routes
│   └── example.routes.ts       # Example routes
├── utils/
│   ├── jwt.utils.ts            # JWT generation/verification
│   ├── validation.utils.ts     # Zod validation schemas
│   └── prisma.utils.ts         # Database connection
└── src/
    └── index.ts                # Main server file
```

## Authentication Flow

1. **App Load**: Check `/api/auth/check` for existing authentication
2. **If Authenticated**: Skip login, show dashboard
3. **If Not Authenticated**: Show login/signup forms
4. **Signup/Login**: POST to appropriate endpoint
5. **Success**: Cookie is automatically set, redirect to dashboard
6. **Protected Routes**: Use `authenticateToken` middleware
7. **Logout**: POST to `/api/auth/logout` to clear cookie

## Error Handling

The system provides detailed error responses:

```json
// Validation error
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "path": ["email"],
      "message": "Invalid email format"
    }
  ]
}

// Authentication error
{
  "success": false,
  "message": "Invalid credentials"
}

// Success response
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "type": "patient"
  }
}
```

## Next Steps

1. **Frontend Integration**: Use the provided JavaScript examples
2. **Route Protection**: Add `authenticateToken` middleware to protected routes
3. **User Management**: Extend with profile update, password reset features
4. **Role-based Access**: Add permissions based on user type
5. **Session Management**: Add refresh tokens for longer sessions
