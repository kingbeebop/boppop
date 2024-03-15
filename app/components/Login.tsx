import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser } from '../slices/authSlice';
import { loginRequest } from '../utils/api';
import { RootState } from '../store';
import { useRouter } from 'next/router';

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const response = await loginRequest(username, password);
      dispatch(loginUser({ username: response.username, password: response.password }));
      // Login successful, redirect or perform additional actions here
      console.log('Login successful');
      console.log(response);
    } catch (error) {
      setError('Invalid username or password');
      console.error('Login error:', error);
    }
  };
  

  const handleLogout = () => {
    dispatch(logoutUser());
    // Get the history object

    console.log('Logout successful');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleRegisterClick = () => {
    router.push('/register');
  };

  return (
    <div className="mb-4" style={{ backgroundColor: 'black', paddingLeft: '20px' }}> {/* Added inline style */}
      <div className="bg-black p-4 rounded"> {/* Changed bg-light to bg-black */}
        {user ? (
          <>
            <div className="mb-3">Hello {user.username}!</div>
            <button className="btn btn-primary mb-3" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <div className="mb-3">
              <input
                type="text"
                placeholder="Username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                placeholder="Password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            {error && <div className="text-danger mb-3">{error}</div>}
            <button className="btn btn-primary mb-3" onClick={handleLogin}>
              Login
            </button>
            <div className="d-flex justify-content-between">
              <button className="btn btn-secondary" onClick={handleRegisterClick}>Register</button>
              <button className="btn btn-link">Forgot Password?</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;