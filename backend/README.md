# Blood Bank Backend API

A Node.js backend application for managing blood bank operations including patient and donor registration.

## 🚀 Features

- **Patient Registration**: Register patients who need blood
- **Donor Registration**: Register blood donors
- **JWT Authentication**: Secure authentication with JWT tokens
- **Password Hashing**: Secure password storage using bcrypt
- **Input Validation**: Comprehensive validation using Zod
- **Database Integration**: PostgreSQL database with Prisma ORM

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Zod
- **Password Hashing**: bcrypt
- **Development**: TypeScript, Nodemon


## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Utkarshsaxena80/blood-bank.git
   cd blood-bank/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env`
   - Update the environment variables with your database credentials:
   ```env
   DATABASE_URL="your_database_connection_string"
   DIRECT_URL="your_direct_database_connection_string"
   SALT_ROUNDS=10
   JWT_KEY=your_jwt_secret_key
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Run database migrations
   npx prisma migrate dev
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3000`

## 📡 API Endpoints

### Patient Registration
- **POST** `/register-patient`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "phone": "1234567890",
    "bloodBank": "City Blood Bank",
    "bloodType": "O+",
    "city": "New York",
    "state": "NY",
    "age": 25
  }
  ```

### Donor Registration
- **POST** `/donor-registration`
- **Body**:
  ```json
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "password": "password123",
    "phone": "0987654321",
    "bloodBank": "City Blood Bank",
    "bloodType": "A+",
    "city": "New York",
    "state": "NY",
    "age": 30
  }
  ```

### Blood Bank Registration
- **POST** `/register-bloodBank`
- **Body**:
  ```json
  {
    "name": "City Blood Bank",
    "adminName": "Admin Name",
    "email": "admin@bloodbank.com",
    "password": "password123",
    "phone": "1234567890",
    "totalBloodBags": 100,
    "address": "123 Main Street",
    "city": "New York",
    "state": "NY",
    "licenseNumber": "BB123456"
  }
  ```

## 🗄️ Database Schema

### Patients Table
- `id`: UUID (Primary Key)
- `name`: String
- `email`: String
- `password`: String (hashed)
- `phone`: String
- `BloodBank`: String
- `BloodType`: String
- `city`: String
- `state`: String
- `age`: Integer
- `createdAt`: DateTime

### Donors Table
- `id`: UUID (Primary Key)
- `name`: String
- `email`: String
- `password`: String (hashed)
- `phone`: String
- `BloodBank`: String
- `BloodType`: String
- `city`: String
- `state`: String
- `age`: Integer
- `createdAt`: DateTime

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Upon successful registration, a JWT token is:
- Generated and stored in an HTTP-only cookie
- Valid for 7 days
- Used for subsequent authenticated requests

## ✅ Input Validation

All API endpoints use Zod for input validation:
- **Name**: Minimum 2 characters
- **Email**: Valid email format
- **Password**: Minimum 8 characters
- **Phone**: Minimum 10 digits
- **Age**: Positive integer

## 🚦 Error Handling

The API provides comprehensive error handling:
- **400**: Invalid input data (Zod validation errors)
- **409**: User already exists (duplicate email/phone)
- **500**: Internal server errors

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npx prisma generate` - Generate Prisma Client
- `npx prisma migrate dev` - Run database migrations
- `npx prisma studio` - Open Prisma Studio (database GUI)

### Project Structure

```
backend/
├── controllers/           # Request handlers
│   ├── patientRegis.controllers.ts
│   └── donorR.controllers.ts
├── routes/               # API routes
│   ├── patientRegistration.routes.ts
│   └── donorRegistration.routes.ts
├── utils/                # Utility functions
│   ├── jwt.utils.ts
│   └── prisma.utils.ts
├── prisma/               # Database schema and migrations
│   ├── schema.prisma
│   └── migrations/
├── src/                  # Main application
│   └── index.ts
├── .env                  # Environment variables (not in repo)
├── .env.example          # Environment template
└── package.json
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Utkarsh Saxena**
- GitHub: [@Utkarshsaxena80](https://github.com/Utkarshsaxena80)

## 🙏 Acknowledgments

- Prisma for excellent ORM
- Supabase for database hosting
- Express.js community for the robust framework