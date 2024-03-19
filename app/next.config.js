/** @type {import('next').NextConfig} */
// const nextConfig = {
//     // Enable server-side rendering
//     target: 'server',
//   };
  
//   module.exports = nextConfig;
  
module.exports = {
    // Set the basePath for your deployment
    basePath: '',
  
    // Define environment variables
    env: {
      API_BASE_URL: 'https://api.example.com',
      NEXT_PUBLIC_ANALYTICS_ID: 'your-analytics-id',
    },
  
    // Configure webpack
    webpack: (config, { isServer }) => {
      // Add polyfills for older browsers if needed
      if (!isServer) {
        config.resolve.fallback = {
          ...config.resolve.fallback,
          fs: false,
          child_process: false,
          crypto: false,
          os: false,
          path: false,
          url: false,
        };
      }
  
      return config;
    }
};