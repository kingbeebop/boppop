// components/Navbar.tsx
import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
  return (
    <nav className="bg-gray-600 text-white p-4">
      <Link href="/">Home</Link>
      <Link href="/archive">Archive</Link>
      <Link href="/artists">Artists</Link>
      <Link href="/about">About</Link>
    </nav>
  );
};

export default Navbar;
