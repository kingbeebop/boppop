require('dotenv').config({ path: '../.env' });

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://167.172.251.135:8000',
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://167.172.251.135:8000/api',
  },
  reactStrictMode: true,
};

module.exports = nextConfig;