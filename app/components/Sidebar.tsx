// components/Sidebar.tsx
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store'; // Import the RootState type

import Login from './Login';

const Sidebar: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user); // Specify RootState type

  return (
    <aside className="fixed top-0 right-0 h-full flex flex-col z-10">
      {!user ? (
        <Login />
      ) : (
        <div>
          <p className="text-white">Hello, {user.username}</p>
          <button className="btn btn-light">Log Out</button>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
