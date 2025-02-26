export const handleLogin = async (credentials: { username: string; password: string }) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/jwt/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      username: credentials.username,
      password: credentials.password,
    }),
    credentials: 'include',
    mode: 'cors',
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Login failed');
  }

  const data = await response.json();
  
  // Store both tokens
  localStorage.setItem('token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  
  return data;
}; 