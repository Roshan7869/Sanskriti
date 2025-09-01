# SANSKRITI - Cultural Heritage Guide

A comprehensive cultural guide application for exploring the rich heritage of Chhattisgarh, focusing on Bhilai, Durg, and Raipur regions.

## 🚀 Features

- **Cultural Events Discovery** - Find upcoming festivals, cultural events, and celebrations
- **Historical Places Guide** - Explore heritage sites, temples, and landmarks
- **Local Influencers** - Connect with cultural content creators and local personalities
- **News & Updates** - Stay informed with local cultural news and updates
- **Interactive Maps** - Get directions to events and places
- **User Authentication** - Save favorites and personalize your experience
- **Responsive Design** - Optimized for mobile and desktop viewing

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for development and building
- **Axios** for API communication
- **React Query** for data fetching and caching
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT Authentication**
- **TypeScript** for type safety
- **Express Validator** for input validation
- **Comprehensive API** with pagination and search

## 📋 Prerequisites

- Node.js (v20 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone and Setup

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### 2. Environment Configuration

**Frontend (.env):**
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_NODE_ENV=development
```

**Backend (.env):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/sanskriti
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

### 3. Database Setup

```bash
# Start MongoDB (if running locally)
mongod

# Seed the database with sample data
cd backend
npm run seed
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## 🏗️ Project Structure

```
sanskriti/
├── src/                          # Frontend source code
│   ├── components/               # React components
│   ├── hooks/                    # Custom React hooks
│   ├── services/                 # API service functions
│   ├── types/                    # TypeScript type definitions
│   ├── context/                  # React context providers
│   └── main.tsx                  # Application entry point
├── backend/                      # Backend source code
│   ├── src/
│   │   ├── controllers/          # Route controllers
│   │   ├── models/               # MongoDB models
│   │   ├── routes/               # API routes
│   │   ├── middleware/           # Custom middleware
│   │   ├── config/               # Configuration files
│   │   └── utils/                # Utility functions
│   └── package.json
└── package.json                  # Frontend dependencies
```

## 🔧 Available Scripts

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build TypeScript to JavaScript
npm run start        # Start production server
npm run seed         # Seed database with sample data
npm run test         # Run test suite
npm run test:watch   # Run tests in watch mode
```

## 🌍 Supported Regions

The application focuses on three major cities in Chhattisgarh:

- **Bhilai** - Industrial heritage and steel plant culture
- **Durg** - Historical significance and cultural landmarks
- **Raipur** - State capital with rich cultural diversity

## 📱 Features Overview

### Events Discovery
- Browse upcoming cultural events and festivals
- Filter by category, date, and location
- Get directions to event venues
- Save events to favorites

### Historical Places
- Explore heritage sites and landmarks
- View ratings and detailed descriptions
- Interactive map integration
- Category-based filtering

### Cultural Influencers
- Discover local content creators
- Follow influencers across social platforms
- Browse by category (food, heritage, travel, etc.)

### News & Updates
- Stay informed with local cultural news
- Follow trusted reporters and news outlets
- Access recent articles and updates

## 🔐 Authentication

The application supports user authentication with:
- Email/password registration and login
- JWT token-based authentication
- User profile management
- Favorites and preferences storage

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the dist/ folder
```

### Backend (Vercel/Railway/Heroku)
```bash
cd backend
npm run build
# Deploy with environment variables configured
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the backend health endpoint: `http://localhost:5000/api/health`
- Review the API documentation in the backend README
- Ensure both frontend and backend servers are running
- Verify MongoDB connection and database seeding

## 🎯 Roadmap

- [ ] Mobile app development
- [ ] Advanced search filters
- [ ] Event booking system
- [ ] Social features and user interactions
- [ ] Offline support with PWA
- [ ] Multi-language support
- [ ] Push notifications for events