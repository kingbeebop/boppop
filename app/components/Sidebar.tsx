// components/Sidebar.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store'; // Import the RootState type

import Login from './Login';

const Sidebar: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user); // Specify RootState type

  return (
    <aside className="flex flex-col p-4">
      {!user ? (
        <Login />
      ) : (
        <div>
          <p>Hello, {user.username}</p>
          <button>Log Out</button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
