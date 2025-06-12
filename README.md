# Auth-n-tik

> A modern full-stack authentication system built with NestJS and Next.js

Auth-n-tik is a production-ready authentication platform featuring JWT-based authentication, refresh tokens, and a beautiful web interface. Built with TypeScript, it provides a secure foundation for web applications.

## ⚡ TL;DR - Quick Start

**Just want to get up and running? Here's the fastest way:**

```bash
# 1. Clone and install
git clone https://github.com/mahkassem/auth-n-tik.git
cd auth-n-tik
npm install

# 2. Start MongoDB (Docker)
make docker-up

# 3. Install all dependencies
make install-all

# 4. Start development servers (API + Web)
make dev-all
```

**That's it!** 🎉

- **API:** <http://localhost:8000> (Swagger: <http://localhost:8000/api/docs>)
- **Web:** <http://localhost:3000>
- **MongoDB:** localhost:27017

**Tech Stack:** NestJS + Next.js + MongoDB + TypeScript + Tailwind CSS

## 🚀 Features

### Authentication & Security

- **JWT Authentication** with access & refresh tokens
- **Secure HTTP-only cookies** for token storage
- **Password hashing** with bcrypt
- **NextAuth.js compatibility** for frontend integration
- **CORS protection** and security headers
- **Input validation** with class-validator

### Backend (NestJS API)

- **RESTful API** with OpenAPI/Swagger documentation
- **MongoDB database** with Mongoose
- **User management** (registration, profiles, authentication)
- **Comprehensive testing** (unit & e2e tests)
- **Docker support** with MongoDB container
- **Environment configuration** management

### Frontend (Next.js Web)

- **Modern React 19** with Next.js 15
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Turbopack** for fast development

### Developer Experience

- **Monorepo structure** with shared tooling
- **ESLint & Prettier** for code quality
- **Husky & commitlint** for git hooks
- **Hot reloading** for both API and web
- **Makefile** for common tasks

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (or use Docker)
- Git

## 🛠️ Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/mahkassem/auth-n-tik.git
cd auth-n-tik
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all package dependencies
make install-all
```

### 3. Setup Database

```bash
# Start MongoDB with Docker (Recommended)
make docker-up

# Or use your local MongoDB instance
# Make sure you have MongoDB running on localhost:27017
```

### 4. Environment Configuration

The project uses environment-specific configuration files:

```bash
# API environments (already configured)
packages/api/.env.development    # Development settings
packages/api/.env.test          # Testing settings
packages/api/.env.production    # Production settings
```

**Development environment is pre-configured** with:

- MongoDB: `mongodb://admin:admin@localhost:27017/auth-n-tik_dev`
- API Port: `8000`
- Debug mode enabled

### 5. Start Development Servers

```bash
# Start both API and web in development mode
make dev-all

# Or start individually:
make api-dev    # API on http://localhost:8000
make web-dev    # Web on http://localhost:3000
```

## 📦 Project Structure

```
auth-n-tik/
├── packages/
│   ├── api/                    # NestJS Backend API
│   │   ├── src/
│   │   │   ├── auth/          # Authentication module
│   │   │   ├── users/         # User management module
│   │   │   ├── config/        # Configuration management
│   │   │   └── main.ts        # Application entry point
│   │   ├── test/              # E2E tests
│   │   └── USAGE_EXAMPLES.md  # API usage examples
│   └── web/                   # Next.js Frontend
│       ├── src/
│       │   └── app/           # Next.js app directory
│       └── public/            # Static assets
├── docker-compose.yml         # Docker services
├── Makefile                   # Development commands
└── package.json               # Root package configuration
```

## 🔧 Development Commands

### Root Level Commands

```bash
# Install dependencies for all packages
npm run install-all

# Start development servers
npm run dev:all

# Build all packages
npm run build:all

# Lint all packages
npm run lint:all
```

### Makefile Commands

```bash
# Development
make dev-all        # Start both API and web in development
make api-dev        # Start only API development server
make web-dev        # Start only web development server

# Database
make docker-up      # Start MongoDB container
make docker-down    # Stop MongoDB container

# Building
make build-all      # Build both packages
make build-api      # Build API package
make build-web      # Build web package

# Testing
make test-api       # Run API tests
make test-e2e       # Run E2E tests

# Linting
make lint-all       # Lint all packages
make lint-api       # Lint API package
make lint-web       # Lint web package
```

## 🧪 Testing

### API Testing

```bash
# Unit tests
cd packages/api && npm run test

# E2E tests
cd packages/api && npm run test:e2e

# Test coverage
cd packages/api && npm run test:cov

# Watch mode for development
cd packages/api && npm run test:watch
```

### Using Makefile

```bash
make test-api       # Run API unit tests
make test-e2e       # Run E2E tests
```

## 🐳 Docker Support

The project includes Docker support for MongoDB:

```bash
# Start MongoDB container
docker-compose up -d

# Stop container
docker-compose down

# Using Makefile
make docker-up
make docker-down
```

**Docker Configuration:**

- **MongoDB 7** with admin credentials
- **Port:** 27017
- **Database:** auth-n-tik_db
- **Credentials:** admin/admin
- **Persistent data** with volumes

## 🌐 API Documentation

### Base URLs

- **Development:** <http://localhost:8000>
- **API Documentation:** <http://localhost:8000/api> (Swagger UI)

### Core Endpoints

#### Authentication

- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `POST /auth/refresh` - Refresh access token
- `GET /auth/profile` - Get current user profile
- `GET /auth/verify` - Verify token validity

#### User Management

- `POST /users/register` - Register new user
- `GET /users/profile/:id` - Get user profile by ID
- `GET /users/me` - Get current user profile (authenticated)

### Example Usage

#### Register a User

```bash
curl -X POST http://localhost:8000/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "fullName": "John Doe",
    "password": "securepassword@123"
  }'
```

#### Login

```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "securepassword@123"
  }'
```

For more examples, see [API Usage Examples](packages/api/USAGE_EXAMPLES.md).

## ⚙️ Configuration

### Environment Variables

#### API Configuration (`packages/api/.env.development`)

```env
# Development environment
NODE_ENV=development
PORT=8000
DEBUG=true
LOG_ENABLED=true
LOG_LEVEL=debug
APP_SECRET=development-secret-not-for-production
MONGODB_CONNECTION_STRING=mongodb://admin:admin@localhost:27017/auth-n-tik_dev?authSource=admin
```

#### Production Configuration (`packages/api/.env.production`)

```env
# Production environment - Update all secrets!
NODE_ENV=production
PORT=8000
DEBUG=false
LOG_ENABLED=true
LOG_LEVEL=info
APP_SECRET=your-production-secret-change-this
MONGODB_CONNECTION_STRING=your-production-mongodb-connection
```

#### Web Configuration

The web package uses Next.js default configuration and connects to the API automatically.

## 🚀 Production Deployment

### Production Checklist

- [ ] Update all secrets in production environment files
- [ ] Use HTTPS for secure cookies
- [ ] Configure rate limiting for auth endpoints
- [ ] Set up proper logging and monitoring
- [ ] Use environment-specific configurations
- [ ] Configure production database
- [ ] Set up CI/CD pipeline

### Build for Production

```bash
# Build all packages
make build-all

# Or build individually
make build-api    # Build API
make build-web    # Build web application

# Start production servers
cd packages/api && npm run start:prod
cd packages/web && npm run start
```

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **HTTP-only Cookies**: Prevents XSS attacks
- **Secure Cookies**: HTTPS only in production
- **SameSite Protection**: CSRF protection
- **Token Expiration**: Configurable expiration times
- **Input Validation**: Request validation with class-validator
- **CORS Configuration**: Configurable CORS settings

## 📱 Frontend Integration

The API is designed to work seamlessly with modern frontend frameworks:

### React/Next.js Example

```typescript
// Login function
const login = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include', // Include cookies
  });
  return response.json();
};
```

### NextAuth.js Integration

The API sets compatible cookies for NextAuth.js integration. See [Auth Module README](packages/api/src/auth/README.md) for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write tests for new features
- Update documentation as needed
- Use conventional commits
- Ensure all tests pass before submitting

## 📝 License

This project is licensed under the UNLICENSED License - see the package.json file for details.

## 👨‍💻 Author

**Mahmoud Kassem**

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - Progressive Node.js framework
- [Next.js](https://nextjs.org/) - React framework for production
- [MongoDB](https://www.mongodb.com/) - Document-oriented database
- [Mongoose](https://mongoosejs.com/) - MongoDB object modeling
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework

---

For more detailed information about specific modules, see:

- [API Documentation](packages/api/README.md)
- [Web Application](packages/web/README.md)
- [Authentication Module](packages/api/src/auth/README.md)
- [Users Module](packages/api/src/users/README.md)
