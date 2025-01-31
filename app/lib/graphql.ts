import { GraphQLClient } from 'graphql-request';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/graphql';

export const createGraphQLClient = () => {
  const token = localStorage.getItem('token');
  
  return new GraphQLClient(API_URL, {
    credentials: 'include',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
};

// Create a wrapper for mutations that need auth
export const withAuth = async <T>(operation: () => Promise<T>): Promise<T> => {
  try {
    return await operation();
  } catch (error: any) {
    console.log('Operation error:', error);
    if (error?.message?.includes('Not authenticated')) {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          console.log('Attempting token refresh...');
          const response = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${refreshToken}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('Token refresh successful');
            localStorage.setItem('token', data.access_token);
            
            // Retry the operation with new token
            return await operation();
          } else {
            console.log('Token refresh failed:', await response.text());
          }
        } catch (refreshError) {
          console.error('Token refresh error:', refreshError);
          throw error;
        }
      }
    }
    throw error;
  }
}; 