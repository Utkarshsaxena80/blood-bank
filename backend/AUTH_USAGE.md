# Authentication API Usage Examples

## Frontend Implementation Guide

### Check Authentication Status on App Load

```javascript
// Check if user is already authenticated (has valid cookie)
const checkAuth = async () => {
  try {
    const response = await fetch('/api/auth/check', {
      method: 'GET',
      credentials: 'include' // Important: Include cookies
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        // User is authenticated, redirect to dashboard or set user state
        console.log('User is logged in:', data.user);
        return data.user;
      }
    }
    // User is not authenticated
    return null;
  } catch (error) {
    console.error('Auth check failed:', error);
    return null;
  }
};

// Call this when your app loads
window.addEventListener('load', async () => {
  const user = await checkAuth();
  if (user) {
    // Skip login, user is already authenticated
    showDashboard(user);
  } else {
    // Show login form
    showLoginForm();
  }
});
```

### Patient Signup

```javascript
const patientSignup = async (userData) => {
  try {
    const response = await fetch('/api/auth/patient/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important: Include cookies
      body: JSON.stringify(userData)
    });

    const data = await response.json();
    
    if (data.success) {
      // Cookie is automatically set, redirect to dashboard
      console.log('Signup successful:', data.user);
      window.location.href = '/dashboard';
    } else {
      // Handle validation errors
      console.error('Signup failed:', data.message);
      if (data.errors) {
        // Display validation errors
        data.errors.forEach(error => {
          console.error(`${error.path}: ${error.message}`);
        });
      }
    }
  } catch (error) {
    console.error('Signup error:', error);
  }
};

// Example usage
const signupData = {
  name: "John Doe",
  email: "john@example.com",
  password: "password123",
  phone: "1234567890",
  BloodBank: "City Blood Bank",
  BloodType: "O+",
  city: "New York",
  state: "NY",
  age: 25
};

patientSignup(signupData);
```

### Patient Login

```javascript
const patientLogin = async (email, password) => {
  try {
    const response = await fetch('/api/auth/patient/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important: Include cookies
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (data.success) {
      // Cookie is automatically set, redirect to dashboard
      console.log('Login successful:', data.user);
      window.location.href = '/dashboard';
    } else {
      console.error('Login failed:', data.message);
      // Show error message to user
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

### Donor Signup & Login (Similar pattern)

```javascript
// Donor signup
fetch('/api/auth/donor/signup', { /* same pattern as patient */ });

// Donor login
fetch('/api/auth/donor/login', { /* same pattern as patient */ });
```

### Blood Bank Signup & Login

```javascript
const bloodBankSignup = async (bankData) => {
  const response = await fetch('/api/auth/bloodbank/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(bankData)
  });
  // Handle response...
};

const bloodBankLogin = async (email, password) => {
  const response = await fetch('/api/auth/bloodbank/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  });
  // Handle response...
};
```

### Logout

```javascript
const logout = async () => {
  try {
    const response = await fetch('/api/auth/logout', {
      method: 'POST',
      credentials: 'include' // Important: Include cookies
    });

    const data = await response.json();
    
    if (data.success) {
      // Cookie is cleared, redirect to login
      console.log('Logout successful');
      window.location.href = '/login';
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
};
```

## API Endpoints

- `POST /api/auth/patient/signup` - Patient registration
- `POST /api/auth/patient/login` - Patient login
- `POST /api/auth/donor/signup` - Donor registration
- `POST /api/auth/donor/login` - Donor login
- `POST /api/auth/bloodbank/signup` - Blood bank registration
- `POST /api/auth/bloodbank/login` - Blood bank login
- `POST /api/auth/logout` - Logout (clears cookie)
- `GET /api/auth/check` - Check authentication status

## Key Features

1. **Cookie-based Authentication**: JWT tokens are stored in httpOnly cookies for security
2. **Automatic Cookie Handling**: No need to manually manage tokens in localStorage
3. **Validation**: All inputs are validated using Zod schemas
4. **Password Hashing**: Passwords are hashed using bcrypt with 12 rounds
5. **Cross-origin Support**: CORS is configured to allow credentials
6. **Type Safety**: TypeScript interfaces for all requests and responses

## Security Features

- httpOnly cookies prevent XSS attacks
- Secure flag in production
- SameSite='strict' prevents CSRF attacks
- Password hashing with bcrypt
- Input validation with Zod
- JWT token expiration (7 days)
