// // auth.ts
import { Login, AuthResponse } from '../types'

let apiUrl = process.env.API_BASE_URL

if (!apiUrl) {
  //throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
  apiUrl = "http://167.172.251.135:8000"
}

console.log("API Base URL:", apiUrl); // Log this to confirm the value

export const loginRequest = async (data: Login): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${apiUrl}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData)
      localStorage.setItem('accessToken', responseData.access_token);
      localStorage.setItem('refreshToken', responseData.refresh_token);
      return responseData;
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error: any) {
    console.error('Login error:', error.message);
    throw error;
  }
};

export const logoutRequest = async (): Promise<void> => {
  try {
    const response = await fetch(`${apiUrl}/logout/`, {
      method: 'POST',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to logout');
    }
  } catch (error: any) {
    console.error('Logout error:', error.message);
    throw error;
  }
};

export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
  console.log("Alligator Swamp")
  console.log(refreshToken)
  try {
    const response = await fetch(`${apiUrl}/token/refresh/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData;
    } else {
      throw new Error('Failed to refresh token');
    }
  } catch (error: any) {
    console.error('Refresh token error:', error.message);
    throw error;
  }
};

export const getRefreshToken = (): string | null => {
  // Retrieve the refresh token from localStorage
  const refreshToken = localStorage.getItem('refreshToken');
  console.log(refreshToken)
  return refreshToken;
};


// Function to check if the JWT token is valid
// export const checkTokenValidity = async (): Promise<boolean> => {
//   try {
//     console.log(localStorage.getItem('accessToken'))
//     const response = await fetch(`${apiUrl}/token/check-validity/`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
//       },
//     });

//     if (response.ok) {
//       const responseData = await response.json();
//       return responseData.valid;
//     } else {
//       throw new Error('Failed to check token validity');
//     }
//   } catch (error: any) {
//     console.error('Error checking token validity:', error.message);
//     throw error;
//   }
// };

export const checkTokenValidity = async (): Promise<boolean| undefined> => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      throw new Error('Access token not found');
    }

    const response = await fetch(`${apiUrl}/token/check-validity/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData.valid;
    } else {
      console.log(response)
      // Handle 401 response (Unauthorized) by attempting to refresh the token
      if (response.status === 401) {
        const refreshTokenValue = getRefreshToken();
        if (!refreshTokenValue) {
          throw new Error('Refresh token not found');
        }

        try {
          await refreshToken(refreshTokenValue);
          // Retry the original request or perform necessary actions after successful token refresh
          // For example, you can retry the original request here
          // return checkTokenValidity(); // Uncomment this line if you want to retry the checkTokenValidity function
        } catch (refreshError: any) { // Specify the type of the error variable
          console.error('Error refreshing token:', refreshError.message);
          throw refreshError;
        }
      } else {
        throw new Error('Failed to check token validity');
      }
    }
  } catch (error: any) {
    console.error('Error checking token validity:', error.message);
    throw error;
  }
};


// Function to fetch user data based on the JWT token
export const fetchUserData = async (): Promise<{ username: string } | null> => {
  try {
    const response = await fetch(`${apiUrl}/token/user-data/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      return responseData; // Adjust this according to the actual response structure
    } else {
      throw new Error('Failed to fetch user data');
    }
  } catch (error: any) {
    console.error('Error fetching user data:', error.message);
    throw error;
  }
};