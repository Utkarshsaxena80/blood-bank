# 🔐 Authentication System Documentation

## Overview
Complete authentication system with registration and login functionality for Patient, Donor, and Blood Bank entities.

---

## 📋 **Available Authentication Endpoints**

### **1. Patient Authentication**

#### **Register Patient**
- **POST** `/patient/register`
- **Body:**
```json
{
  "name": "John Patient",
  "email": "john@email.com",
  "password": "securePassword123",
  "phone": "+1-555-0123",
  "bloodBank": "City General Blood Bank",
  "bloodType": "A+",
  "city": "New York",
  "status": true,
  "state": "NY",
  "age": 35
}
```

#### **Login Patient**
- **POST** `/patient/login`
- **Body:**
```json
{
  "email": "john@email.com",
  "password": "securePassword123"
}
```

### **2. Donor Authentication**

#### **Register Donor**
- **POST** `/donor/register`
- **Body:**
```json
{
  "name": "Jane Donor",
  "email": "jane@email.com",
  "password": "securePassword123",
  "phone": "+1-555-0124",
  "BloodBank": "City General Blood Bank",
  "BloodType": "A+",
  "city": "New York",
  "state": "NY",
  "age": 28
}
```

#### **Login Donor**
- **POST** `/donor/login`
- **Body:**
```json
{
  "email": "jane@email.com",
  "password": "securePassword123"
}
```

### **3. Blood Bank Authentication**

#### **Register Blood Bank**
- **POST** `/bloodbank/register`
- **Body:**
```json
{
  "name": "Metro Blood Center",
  "adminName": "Dr. Smith",
  "licenseNumber": "BB-2025-001",
  "email": "admin@metro.com",
  "password": "securePassword123",
  "phone": "+1-555-0125",
  "totalBloodBags": 1000,
  "address": "123 Medical Drive",
  "city": "New York",
  "state": "NY"
}
```

#### **Login Blood Bank**
- **POST** `/bloodbank/login`
- **Body:**
```json
{
  "email": "admin@metro.com",
  "password": "securePassword123"
}
```

### **4. Logout (Universal)**
- **POST** `/logout`
- **Authentication:** Required
- **Body:** None

---

## 🔄 **Authentication Flow**

### **Registration Flow:**
1. User submits registration data
2. System validates input using Zod
3. Check if user already exists (email/phone)
4. Hash password using bcrypt
5. Store user in database
6. Generate JWT token
7. Set token in HTTP-only cookie
8. Return user data (password excluded)

### **Login Flow:**
1. User submits email and password
2. System validates input using Zod
3. Find user by email in database
4. Compare password with bcrypt
5. Generate JWT token on success
6. Set token in HTTP-only cookie
7. Return user data (password excluded)

### **Logout Flow:**
1. Clear authentication cookie
2. Return success message

---

## 🧪 **Test Examples**

### **Test Patient Registration:**
```bash
curl -X POST http://localhost:3000/patient/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Patient",
    "email": "patient@test.com",
    "password": "password123",
    "phone": "+1-555-0001",
    "bloodBank": "Test Blood Bank",
    "bloodType": "A+",
    "city": "Test City",
    "status": true,
    "state": "TC",
    "age": 30
  }'
```

### **Test Patient Login:**
```bash
curl -X POST http://localhost:3000/patient/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "patient@test.com",
    "password": "password123"
  }'
```

### **Test Donor Registration:**
```bash
curl -X POST http://localhost:3000/donor/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Donor",
    "email": "donor@test.com",
    "password": "password123",
    "phone": "+1-555-0002",
    "BloodBank": "Test Blood Bank",
    "BloodType": "A+",
    "city": "Test City",
    "state": "TC",
    "age": 25
  }'
```

### **Test Donor Login:**
```bash
curl -X POST http://localhost:3000/donor/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "donor@test.com",
    "password": "password123"
  }'
```

### **Test Blood Bank Registration:**
```bash
curl -X POST http://localhost:3000/bloodbank/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Blood Bank",
    "adminName": "Test Admin",
    "licenseNumber": "TEST-001",
    "email": "admin@testbb.com",
    "password": "password123",
    "phone": "+1-555-0003",
    "totalBloodBags": 1000,
    "address": "123 Test Street",
    "city": "Test City",
    "state": "TC"
  }'
```

### **Test Blood Bank Login:**
```bash
curl -X POST http://localhost:3000/bloodbank/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "admin@testbb.com",
    "password": "password123"
  }'
```

### **Test Protected Endpoint (with auth):**
```bash
curl -X GET http://localhost:3000/getDonations \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

### **Test Logout:**
```bash
curl -X POST http://localhost:3000/logout \
  -H "Content-Type: application/json" \
  -b cookies.txt
```

---

## 🔒 **Security Features**

### **Password Security:**
- Passwords hashed using bcrypt
- Configurable salt rounds via `SALT_ROUNDS` env variable
- Minimum 8 character requirement

### **JWT Security:**
- 7-day token expiration
- HTTP-only cookies (prevents XSS attacks)
- Secure flag in production
- SameSite strict policy

### **Input Validation:**
- Zod schema validation for all inputs
- Email format validation
- Required field validation
- Custom error messages

### **Error Handling:**
- Generic error messages for security
- Detailed validation errors for development
- Proper HTTP status codes
- No sensitive information exposure

---

## ⚙️ **Environment Variables**

```env
JWT_KEY=your-super-secret-jwt-key-here
SALT_ROUNDS=10
NODE_ENV=development
```

---

## 📁 **File Structure**

```
controllers/
├── patientLogin.controllers.ts
├── donorLogin.controllers.ts
├── bloodBankLogin.controllers.ts
├── logout.controllers.ts
├── patientRegis.controllers.ts
├── donorR.controllers.ts
└── bloodBankRegistration.controllers.ts

routes/
├── patientLogin.routes.ts
├── donorLogin.routes.ts
├── bloodBankLogin.routes.ts
├── logout.routes.ts
├── patientRegistration.routes.ts
├── donorRegistration.routes.ts
└── bloodBank.routes.ts

middlewares/
└── token.middleware.ts

utils/
├── jwt.utils.ts
└── prisma.utils.ts
```

---

## ✅ **Complete Authentication System Ready!**

Your blood bank management system now has:
- ✅ Patient registration and login
- ✅ Donor registration and login  
- ✅ Blood Bank registration and login
- ✅ Universal logout functionality
- ✅ JWT token-based authentication
- ✅ Secure password hashing
- ✅ Input validation with Zod
- ✅ HTTP-only cookie security
- ✅ Comprehensive error handling

All endpoints are now consistent and ready for production use! 🩸💪
