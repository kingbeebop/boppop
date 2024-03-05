// components/Login.tsx
import React from 'react';

const Login: React.FC = () => {
  return (
    <div>
      <input type="text" placeholder="Username" className="mb-2" />
      <input type="password" placeholder="Password" className="mb-2" />
      <button>Login</button>
      <div>
        <button>Register</button>
        <button>Forgot Password?</button>
      </div>
    </div>
  );
};

export default Login;
