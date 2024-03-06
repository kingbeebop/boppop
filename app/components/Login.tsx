// // components/Login.tsx
// import React from 'react';

// const Login: React.FC = () => {
//   return (
//     <div className="bg-light p-4 rounded">
//       <div className="mb-3">
//         <input type="text" placeholder="Username" className="form-control" />
//       </div>
//       <div className="mb-3">
//         <input type="password" placeholder="Password" className="form-control" />
//       </div>
//       <button className="btn btn-primary btn-block mb-3">Login</button>
//       <div className="d-flex justify-content-between">
//         <button className="btn btn-secondary">Register</button>
//         <button className="btn btn-link">Forgot Password?</button>
//       </div>
//     </div>
//   );
// };

// export default Login;

// components/Sidebar.tsx
// components/Login.tsx
import React from 'react';

const Login: React.FC = () => {
  return (
    <div className="mb-4">
      <div className="bg-light p-4 rounded">
        <div className="mb-3">
          <input type="text" placeholder="Username" className="form-control" />
        </div>
        <div className="mb-3">
          <input type="password" placeholder="Password" className="form-control" />
        </div>
        <button className="btn btn-primary mb-3">Login</button>
        <div className="d-flex justify-content-between">
          <button className="btn btn-secondary">Register</button>
          <button className="btn btn-link">Forgot Password?</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
