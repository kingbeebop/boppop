import { baseFetch } from '../fetch';
import { Login, AuthResponse, Registration, User } from '../../types';

export async function loginUser(data: Login): Promise<AuthResponse> {
  const formData = new URLSearchParams();
  formData.append('username', data.username);
  formData.append('password', data.password);

  try {
    const response = await baseFetch<AuthResponse>('/auth/jwt/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
      credentials: 'include',
    });
    
    if (response.access_token) {
      localStorage.setItem('token', response.access_token);
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
    }
    
    return response;
  } catch (error) {
    console.error('Raw login error:', error);
    throw error;
  }
}

export async function registerUser(data: Registration): Promise<void> {
  try {
    await baseFetch<void>('/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes('REGISTER_USER_ALREADY_EXISTS')) {
      throw new Error('Username or email already exists');
    }
    throw error;
  }
}

export async function logoutUser(): Promise<void> {
  return baseFetch<void>('/auth/jwt/logout', {
    method: 'POST',
  });
}

export async function validateToken(): Promise<boolean> {
  try {
    await baseFetch<void>('/auth/jwt/verify', {
      method: 'GET',
    });
    return true;
  } catch {
    return false;
  }
}

export async function getCurrentUser(): Promise<User> {
  return baseFetch<User>('/users/me', {
    method: 'GET',
  });
}

export function getRefreshToken(): string | null {
  return localStorage.getItem('refresh_token');
}

export async function refreshToken(token: string): Promise<AuthResponse> {
  return baseFetch<AuthResponse>('/auth/jwt/refresh', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: token }),
  });
}

export async function resetPassword(email: string): Promise<void> {
  return baseFetch<void>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export async function refreshAccessToken(): Promise<AuthResponse> {
  const refresh_token = localStorage.getItem('refresh_token');
  if (!refresh_token) {
    throw new Error('No refresh token available');
  }

  try {
    const response = await baseFetch<AuthResponse>('/auth/jwt/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: refresh_token }),
    });

    if (response.access_token) {
      localStorage.setItem('token', response.access_token);
      if (response.refresh_token) {
        localStorage.setItem('refresh_token', response.refresh_token);
      }
    }

    return response;
  } catch (error) {
    // If refresh fails, clear tokens
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    throw error;
  }
}

export async function initializeAuth(): Promise<User | null> {
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }

  try {
    // Try to get user data with current token
    return await getCurrentUser();
  } catch (error) {
    // If current token fails, try refresh
    try {
      const refreshResponse = await refreshAccessToken();
      if (refreshResponse.access_token) {
        return await getCurrentUser();
      }
    } catch (refreshError) {
      // If refresh fails, clear tokens
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
    }
    return null;
  }
}