/* eslint-disable @typescript-eslint/no-explicit-any */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    throw new Error('API request failed');
  }
  try {
    return await response.json();
  } catch {
    return { success: true };
  }
}

// Categories API
export const categoriesApi = {
  getAll: () => fetchWithAuth('/api/categories/'),
  
  get: (id: string) => fetchWithAuth(`/api/categories/${id}/`),
  
  create: (data: any) => 
    fetchWithAuth('/api/categories/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: any) =>
    fetchWithAuth(`/api/categories/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    fetchWithAuth(`/api/categories/${id}/`, {
      method: 'DELETE',
    }),
};

// Assets API
export const assetsApi = {
  getAll: () => fetchWithAuth('/api/assets/'),
  
  getMyAssets: () => fetchWithAuth('/api/assets/my_assets/'),
  
  get: (id: string) => fetchWithAuth(`/api/assets/${id}/`),
  
  create: (data: any) =>
    fetchWithAuth('/api/assets/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: any) =>
    fetchWithAuth(`/api/assets/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    fetchWithAuth(`/api/assets/${id}/`, {
      method: 'DELETE',
    }),
};

// Users API
export const usersApi = {
  getAll: () => fetchWithAuth('/api/users/'),
  
  get: (id: string) => fetchWithAuth(`/api/users/${id}/`),
  
  create: (data: any) =>
    fetchWithAuth('/api/users/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: any) =>
    fetchWithAuth(`/api/users/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    fetchWithAuth(`/api/users/${id}/`, {
      method: 'DELETE',
    }),
};

export {API_URL};