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

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, any>,
  isProtected = false
): Promise<T> {
  const response = await baseFetch<GraphQLResponse<T>>('/graphql', {
    method: 'POST',
    body: JSON.stringify({ query, variables }),
  });

  if (response.errors?.length) {
    throw new Error(response.errors[0].message);
  }

  if (!response.data) {
    throw new Error('No data received from GraphQL');
  }

  return response.data;
}

