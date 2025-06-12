# Authentication Usage Examples

## Frontend Integration Examples

### React/Next.js with Axios

```typescript
// auth.service.ts
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for cookies
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const refreshResponse = await api.post('/auth/refresh');
        const { accessToken } = refreshResponse.data;
        localStorage.setItem('accessToken', accessToken);
        
        // Retry original request
        error.config.headers.Authorization = `Bearer ${accessToken}`;
        return api.request(error.config);
      } catch (refreshError) {
        // Redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    const { tokens } = response.data;
    localStorage.setItem('accessToken', tokens.accessToken);
    return response.data;
  },

  async logout() {
    await api.post('/auth/logout');
    localStorage.removeItem('accessToken');
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async getCurrentUser() {
    const response = await api.get('/users/me');
    return response.data;
  }
};
```

### NextAuth.js Configuration

```typescript
// pages/api/auth/[...nextauth].ts
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          const res = await fetch('http://localhost:8000/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
          });

          if (res.ok) {
            const data = await res.json();
            return {
              id: data.user.id,
              email: data.user.email,
              name: data.user.fullName,
              accessToken: data.tokens.accessToken,
            };
          }
        } catch (error) {
          console.error('Auth error:', error);
        }
        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    }
  },
  pages: {
    signIn: '/login',
    signOut: '/logout',
  }
});
```

### React Login Component

```tsx
// components/LoginForm.tsx
import React, { useState } from 'react';
import { authService } from '../services/auth.service';

export const LoginForm: React.FC = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await authService.login(credentials.email, credentials.password);
      console.log('Login successful:', result);
      // Redirect or update app state
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={credentials.email}
          onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={credentials.password}
          onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
          required
        />
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

### Vue.js with Composition API

```typescript
// composables/useAuth.ts
import { ref, computed } from 'vue';
import axios from 'axios';

const user = ref(null);
const token = ref(localStorage.getItem('accessToken'));

export const useAuth = () => {
  const isAuthenticated = computed(() => !!token.value);

  const login = async (email: string, password: string) => {
    const response = await axios.post('/auth/login', { email, password });
    const { user: userData, tokens } = response.data;
    
    user.value = userData;
    token.value = tokens.accessToken;
    localStorage.setItem('accessToken', tokens.accessToken);
    
    return userData;
  };

  const logout = async () => {
    await axios.post('/auth/logout');
    user.value = null;
    token.value = null;
    localStorage.removeItem('accessToken');
  };

  const fetchProfile = async () => {
    if (!token.value) return null;
    
    const response = await axios.get('/auth/profile', {
      headers: { Authorization: `Bearer ${token.value}` }
    });
    
    user.value = response.data;
    return response.data;
  };

  return {
    user: readonly(user),
    token: readonly(token),
    isAuthenticated,
    login,
    logout,
    fetchProfile
  };
};
```

## API Testing with cURL

### Login
```bash
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password@123"}' \
  -c cookies.txt
```

### Access Protected Route
```bash
curl -X GET http://localhost:8000/auth/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -b cookies.txt
```

### Refresh Token
```bash
curl -X POST http://localhost:8000/auth/refresh \
  -b cookies.txt \
  -c cookies.txt
```

### Logout
```bash
curl -X POST http://localhost:8000/auth/logout \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -b cookies.txt
```

## Environment Variables for Frontend

```env
# .env.local (Next.js)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Error Handling Best Practices

```typescript
// utils/errorHandler.ts
export const handleAuthError = (error: any) => {
  if (error.response?.status === 401) {
    // Token expired or invalid
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
  } else if (error.response?.status === 403) {
    // Forbidden - user doesn't have permission
    alert('Access denied');
  } else {
    // Other errors
    console.error('Auth error:', error.response?.data?.message || error.message);
  }
};
```
