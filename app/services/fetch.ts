import config from '../config';

interface FetchOptions extends RequestInit {
  protected?: boolean;
}

async function baseFetch<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { protected: isProtected, ...fetchOptions } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (isProtected) {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${config.apiUrl}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, any>,
  isProtected = false
): Promise<T> {
  return baseFetch<T>('/graphql', {
    method: 'POST',
    body: JSON.stringify({ query, variables }),
    protected: isProtected,
  });
}

export { baseFetch };
