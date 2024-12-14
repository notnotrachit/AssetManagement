import { API_URL } from './api';
import Cookies from 'js-cookie';

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'vendor' | 'user';
  company_name?: string;
}

interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export async function login(username: string, password: string): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
}

export async function register(data: {
  username: string;
  password: string;
  password2: string;
  email: string;
  role: string;
  company_name?: string;
}): Promise<AuthResponse> {
  const response = await fetch(`${API_URL}/api/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Registration failed');
  }

  return response.json();
}

export async function getCurrentUser(): Promise<User> {
  const token = Cookies.get('token');
  if (!token) {
    throw new Error('No token found');
  }

  const response = await fetch(`${API_URL}/api/me/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get user');
  }

  return response.json();
}

export async function refreshToken(): Promise<string> {
  const refresh = Cookies.get('refreshToken');
  if (!refresh) {
    throw new Error('No refresh token found');
  }

  const response = await fetch(`${API_URL}/api/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const data = await response.json();
  Cookies.set('token', data.access, { expires: 1 }); // 1 day
  return data.access;
}
