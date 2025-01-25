import { baseFetch } from '../fetch';
import { Login, AuthResponse, Artist, Registration } from '../../types';

export async function loginUser(data: Login): Promise<AuthResponse> {
  return baseFetch<AuthResponse>('/auth/jwt/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      username: data.username,
      password: data.password,
    }),
  });
}

export async function registerUser(data: Registration): Promise<void> {
  return baseFetch<void>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function logoutUser(): Promise<void> {
  return baseFetch<void>('/auth/jwt/logout', {
    method: 'POST',
    protected: true,
  });
}

export async function validateToken(): Promise<boolean> {
  try {
    await baseFetch<void>('/auth/jwt/verify', {
      method: 'GET',
      protected: true,
    });
    return true;
  } catch {
    return false;
  }
}

export async function getUser(): Promise<Artist> {
  return baseFetch<Artist>('/users/me', {
    method: 'GET',
    protected: true,
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

export async function attemptTokenLogin(): Promise<Artist | null> {
  try {
    const isValid = await validateToken();
    if (isValid) {
      return await getUser();
    }

    const refreshTokenValue = getRefreshToken();
    if (refreshTokenValue) {
      const response = await refreshToken(refreshTokenValue);
      if (response.access_token) {
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        return await getUser();
      }
    }
    return null;
  } catch (error) {
    console.error('Token login failed:', error);
    return null;
  }
}