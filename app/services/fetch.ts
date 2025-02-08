import store from '../redux/store';
import { selectCurrentToken } from '../redux/slices/authSlice';

export async function baseFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  
  const headers = new Headers(options.headers || {});
  headers.set('Accept', 'application/json');
  
  // Add auth token if it exists and Authorization isn't already set
  const token = localStorage.getItem('token');
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  
  // Don't override Content-Type if it's already set
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorDetail;
    try {
      const errorJson = JSON.parse(errorText);
      errorDetail = errorJson.detail || 'An error occurred';
    } catch {
      errorDetail = errorText || 'An error occurred';
    }
    throw new Error(errorDetail);
  }

  return response.status === 204 ? ({} as T) : response.json();
}

interface GraphQLResponse<T> {
  data: T;
  errors?: Array<{ message: string }>;
}

export const graphqlRequest = async <T>(
  query: string,
  variables?: Record<string, unknown>,
  requireAuth: boolean = false
): Promise<T> => {
  const token = selectCurrentToken(store.getState());
  
  // Check if this is a mutation and requires auth
  const isMutation = query.trim().toLowerCase().startsWith('mutation');
  if (isMutation && !token) {
    throw new Error('Authentication required');
  }

  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await response.json();
  if (json.errors) {
    throw new Error(json.errors[0].message);
  }
  return json.data;
};

