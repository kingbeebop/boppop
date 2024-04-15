import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, logoutUser, checkAuthStatus } from '../redux/slices/authSlice';
import { RootState } from '../redux/store';
import { useRouter } from 'next/router';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Login: React.FC = () => {
  const dispatch = useDispatch<any>();
  const user = useSelector((state: RootState) => state.auth.user);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  // Run the checkAuthStatus action on initial load if user is null
  useEffect(() => {
    if (!user) {
      console.log("Hello!")
      dispatch(checkAuthStatus());
    }
  }, [dispatch, user]);


  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleLogin = () => {
    try {
      dispatch(loginUser({ username, password }));
      handleClose(); // Close the modal after dispatching loginUser
      console.log('Login successful');
    } catch (error) {
      setError('Invalid username or password');
      console.error('Login error:', error);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    console.log('Logout successful');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleRegisterClick = () => {
    handleClose();
    router.push('/register');
  };

  return (
    <>
      {!user && (
        <Button variant="primary" onClick={handleShow}>
          Login
        </Button>
      )}

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton className="bg-black">
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-black rounded-lg p-4">
          <div className="mb-3 border-white border rounded">
            <input
              type="text"
              placeholder="Username"
              className="form-control bg-black text-white"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="mb-3 border-white border rounded">
            <input
              type="password"
              placeholder="Password"
              className="form-control bg-black text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          {error && <div className="text-danger mb-3">{error}</div>}
          <Button variant="primary" onClick={handleLogin}>
            Login
          </Button>
          <div className="flex justify-between">
            <Button variant="secondary" onClick={handleRegisterClick}>Register</Button>
            <Button variant="link">Forgot Password?</Button>
          </div>
        </Modal.Body>
      </Modal>

      {user && (
        <div className="flex items-row justify-end mb-3">
          <div className="mr-3">Hello {user.username}!</div>
          <Button variant="primary" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      )}
    </>
  );
};

export default Login;