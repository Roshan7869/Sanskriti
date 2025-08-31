# SANSKRITI Backend API

A comprehensive backend API for the SANSKRITI cultural guide application, built with Node.js, Express, MongoDB, and TypeScript.

## 🚀 Features

- **RESTful API** with comprehensive endpoints for events, places, influencers, and reporters
- **JWT Authentication** with secure user registration and login
- **MongoDB Integration** with Mongoose ODM for robust data modeling
- **Advanced Search** with full-text search capabilities
- **Pagination Support** for efficient data loading
- **Input Validation** with express-validator
- **Security Features** including rate limiting, CORS, and Helmet
- **TypeScript** for type safety and better development experience
- **Comprehensive Testing** with Jest and Supertest
- **Database Seeding** for easy development setup

## 📋 Prerequisites

- Node.js (v20 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/sanskriti
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB:**
   - **Local MongoDB:** Ensure MongoDB is running on your system
   - **MongoDB Atlas:** Use your Atlas connection string in `MONGODB_URI`

5. **Seed the database:**
   ```bash
   npm run seed
   ```

6. **Start the development server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "region": "Bhilai, CG"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Verify Token
```http
GET /api/auth/verify
Authorization: Bearer <jwt_token>
```

### Events Endpoints

#### Get All Events
```http
GET /api/events?page=1&limit=10&query=heritage&category=Cultural Event&date=2025-03-15
```

#### Get Event by ID
```http
GET /api/events/:id
```

#### Create Event (Protected)
```http
POST /api/events
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "New Cultural Event",
  "description": "Event description",
  "category": "Cultural Event",
  "location": "Bhilai, CG",
  "coordinates": { "lat": 21.1925, "lng": 81.3186 },
  "date": "2025-06-15T10:00:00Z",
  "imageUrl": "https://example.com/image.jpg"
}
```

### Places Endpoints

#### Get All Places
```http
GET /api/places?page=1&limit=10&query=temple
```

#### Get Place by ID
```http
GET /api/places/:id
```

### Influencers Endpoints

#### Get All Influencers
```http
GET /api/influencers?page=1&limit=10
```

### Reporters Endpoints

#### Get All Reporters
```http
GET /api/reporters?page=1&limit=10
```

### Profile Endpoints (Protected)

#### Get User Profile
```http
GET /api/profile
Authorization: Bearer <jwt_token>
```

#### Update Profile
```http
PUT /api/profile
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "region": "Raipur, CG"
}
```

#### Add to Favorites
```http
POST /api/profile/favorites
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "type": "events",
  "itemId": "event_id_here"
}
```

### Search Endpoint

#### Universal Search
```http
GET /api/search?query=heritage&type=all&page=1&limit=10
```

## 🔧 Development Scripts

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Seed database with sample data
npm run seed

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch
```

## 🧪 Testing

The project includes comprehensive test suites:

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test -- --coverage

# Run specific test file
npm run test auth.test.ts
```

## 🔒 Security Features

- **JWT Authentication** with secure token generation
- **Password Hashing** using bcryptjs with salt rounds
- **Rate Limiting** to prevent abuse
- **Input Validation** and sanitization
- **CORS Configuration** for cross-origin requests
- **Security Headers** via Helmet
- **MongoDB Injection Protection**

## 📊 Database Schema

### Users Collection
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  region: String (default: "Bhilai, CG"),
  favorites: {
    events: [ObjectId],
    places: [ObjectId]
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Events Collection
```javascript
{
  title: String (required),
  description: String (required),
  category: String (enum, required),
  location: String (required),
  coordinates: { lat: Number, lng: Number },
  date: Date (required, future),
  imageUrl: String (required),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## 🚀 Deployment

### Vercel Deployment

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```

3. **Set Environment Variables:**
   ```bash
   vercel env add MONGODB_URI
   vercel env add JWT_SECRET
   vercel env add FRONTEND_URL
   ```

### Environment Variables for Production

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sanskriti
JWT_SECRET=your-production-jwt-secret-key
FRONTEND_URL=https://your-frontend-domain.com
```

## 🔗 Frontend Integration

Replace the static data imports in your React components with API calls:

### Example: Events Integration

```typescript
// src/hooks/useEvents.ts
import { useState, useEffect } from 'react';

interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  coordinates: { lat: number; lng: number };
  date: string;
  imageUrl: string;
}

export const useEvents = (searchQuery?: string) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const queryParam = searchQuery ? `?query=${encodeURIComponent(searchQuery)}` : '';
        const response = await fetch(`http://localhost:5000/api/events${queryParam}`);
        const data = await response.json();
        
        if (data.success) {
          setEvents(data.data.events);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [searchQuery]);

  return { events, loading, error };
};
```

### Authentication Integration

```typescript
// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  user: any;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, region?: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await fetch('http://localhost:5000/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const data = await response.json();
          
          if (data.success) {
            setUser(data.data.user);
          } else {
            localStorage.removeItem('token');
            setToken(null);
          }
        } catch (error) {
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, [token]);

  const login = async (email: string, password: string) => {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    if (data.success) {
      setToken(data.data.token);
      setUser(data.data.user);
      localStorage.setItem('token', data.data.token);
    } else {
      throw new Error(data.error);
    }
  };

  const register = async (email: string, password: string, region?: string) => {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, region })
    });
    
    const data = await response.json();
    if (data.success) {
      setToken(data.data.token);
      setUser(data.data.user);
      localStorage.setItem('token', data.data.token);
    } else {
      throw new Error(data.error);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

## 📝 API Response Format

All API responses follow this consistent format:

```typescript
{
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
```

## 🐛 Error Handling

The API returns appropriate HTTP status codes:

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (authentication required)
- **404**: Not Found
- **500**: Internal Server Error

## 📈 Performance Optimizations

- **Database Indexing** on frequently queried fields
- **Pagination** to limit response sizes
- **Lean Queries** for better performance
- **Connection Pooling** via Mongoose
- **Rate Limiting** to prevent abuse

## 🔍 Monitoring and Logging

- Comprehensive error logging
- Request/response logging in development
- Health check endpoint at `/api/health`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the API health endpoint: `/api/health`
- Review the test files for usage examples
- Ensure MongoDB is running and accessible
- Verify environment variables are set correctly