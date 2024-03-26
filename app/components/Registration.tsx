import React, { useState } from 'react';
import { registerRequest } from '../utils/api';

const RegistrationForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password1 !== password2) {
      setError('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      await registerRequest(username, password1, password2, email);
      onSuccess();
    } catch (error) {
      setError('Failed to register');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-black p-4 rounded">
      <div className="mb-3">
        <input
          type="text"
          placeholder="Username"
          className="form-control bg-black text-white"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="password"
          placeholder="Password"
          className="form-control bg-black text-white"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="password"
          placeholder="Confirm Password"
          className="form-control bg-black text-white"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <input
          type="email"
          placeholder="Email"
          className="form-control bg-black text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      {error && <div className="text-danger mb-3">{error}</div>}
      <button className="btn btn-primary mb-3" type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Register'}
      </button>
    </form>
  );
};

const Registration: React.FC = () => {
  const [success, setSuccess] = useState(false);

  const handleSuccess = () => {
    setSuccess(true);
  };

  return (
    <div className="mb-4">
      <div className="bg-light p-4 rounded">
        {success ? (
          <div className="text-success">Registration successful!</div>
        ) : (
          <RegistrationForm onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  );
};

export default Registration;