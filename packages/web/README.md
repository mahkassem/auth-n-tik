# Auth-N-Tik Web Frontend

A modern web application built with Next.js 15, featuring authentication, beautiful UI components, and integration with the NestJS backend.

## Features

- 🔐 **Authentication**: JWT-based authentication with NextAuth.js
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 📱 **Mobile-first**: Responsive design that works on all devices
- 🛡️ **Form Validation**: Client-side validation with Zod schemas
- 🎯 **TypeScript**: Full type safety throughout the application
- 🚀 **Performance**: Optimized with Next.js 15 features

## Pages

### Home Page (`/`)
- Welcome message with user information when authenticated
- Beautiful landing page with feature highlights
- Call-to-action buttons for authentication

### Login Page (`/login`)
- Email and password authentication
- Form validation with error handling
- Password visibility toggle
- Redirect to home after successful login

### Register Page (`/register`)
- User registration with full name, email, and password
- Strong password requirements
- Email validation
- Success message and redirect to login

## Getting Started

### Prerequisites

- Node.js 18 or later
- npm or yarn
- Running NestJS backend (see API documentation)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
```

3. Update the environment variables in `.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-in-production
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
npm start
```

## API Integration

The frontend integrates with the NestJS backend API:

- **Login**: `POST /v1/auth/login`
- **Register**: `POST /v1/users/register`
- **Profile**: `GET /v1/auth/profile`

## Form Validation

All forms use Zod schemas for validation:

### Login Form
- Email: Valid email format
- Password: Minimum 6 characters

### Register Form
- Full Name: 3-100 characters, letters and spaces only
- Email: Valid email format
- Password: Minimum 8 characters with at least one letter, number, and special character

## UI Components

### Button
Customizable button component with multiple variants:
- `default`: Primary blue button
- `outline`: Outlined button
- `ghost`: Transparent button
- `secondary`: Gray button

### Input
Form input component with:
- Error state styling
- Icon support
- Validation error messages

### Card
Container component for structured content:
- Header with title and description
- Content area
- Footer for actions

## Styling

The application uses:
- **Tailwind CSS**: Utility-first CSS framework
- **Custom CSS**: Additional styling for scrollbars and focus states
- **Responsive Design**: Mobile-first approach
- **Dark Mode**: System preference detection

## Authentication Flow

1. User navigates to login/register page
2. Form submission triggers validation
3. Valid data is sent to the backend API
4. JWT tokens are received and stored
5. User is redirected to the home page
6. Protected routes are accessible with valid tokens

## Error Handling

- Network errors are caught and displayed to users
- Form validation errors are shown inline
- API errors are handled gracefully with user-friendly messages

## Security Features

- JWT token-based authentication
- Secure cookie storage
- CSRF protection
- Input validation and sanitization
- Password strength requirements

## Performance Optimizations

- Code splitting with Next.js
- Image optimization
- Lazy loading of components
- Efficient re-renders with React hooks
