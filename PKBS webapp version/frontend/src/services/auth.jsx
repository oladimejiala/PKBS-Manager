const API_BASE = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000/api';

// Login function: expects { username, password }
export async function login(credentials) {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Login failed');
    }
    const data = await response.json();
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  } catch (error) {
    console.error('Login error:', error.message);
    throw error;
  }
}

// Logout: clear tokens and user data
export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}

// Get stored auth token
export function getToken() {
  return localStorage.getItem('token');
}

// Get stored user info
export function getUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

// Check if logged in
export function isLoggedIn() {
  return Boolean(getToken());
}
