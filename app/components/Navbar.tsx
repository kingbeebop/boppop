import React from 'react';
import Link from 'next/link';
import Login from './Login'; // Import Login component

const Navbar: React.FC = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid d-flex justify-content-between align-items-center" style={{ maxWidth: '50rem' }}> {/* Flex container with content centered horizontally and vertically */}
        <ul className="navbar-nav flex gap-4"> {/* Container for navigation links */}
          <li className="nav-item">
            <Link href="/">
              <a className="nav-link">Home</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/archive">
              <a className="nav-link">Archive</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/artists">
              <a className="nav-link">Artists</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/about">
              <a className="nav-link">About</a>
            </Link>
          </li>
        </ul>
        <Login /> {/* Login component */}
      </div>
    </nav>
  );
};

export default Navbar;


// import React from 'react';
// import Link from 'next/link';
// import Login from './Login'; // Import Login component

// const Navbar: React.FC = () => {
//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//       <div className="container-fluid d-flex justify-content-between align-items-center"> {/* Flex container with content centered horizontally and vertically */}
//         <ul className="navbar-nav flex gap-4"> {/* Container for navigation links */}
//           <li className="nav-item">
//             <Link href="/">
//               <a className="nav-link">Home</a>
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link href="/archive">
//               <a className="nav-link">Archive</a>
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link href="/artists">
//               <a className="nav-link">Artists</a>
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link href="/about">
//               <a className="nav-link">About</a>
//             </Link>
//           </li>
//         </ul>
//         <Login /> {/* Login component */}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



// import React from 'react';
// import Link from 'next/link';
// import Login from './Login'; // Import Login component

// const Navbar: React.FC = () => {
//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//       <div className="max-w-md mx-auto flex justify-between items-center"> {/* Flex container with max-width-md, justified between, and items centered vertically */}
//         <ul className="navbar-nav flex gap-4"> {/* Container for navigation links */}
//           <li className="nav-item">
//             <Link href="/">
//               <a className="nav-link">Home</a>
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link href="/archive">
//               <a className="nav-link">Archive</a>
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link href="/artists">
//               <a className="nav-link">Artists</a>
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link href="/about">
//               <a className="nav-link">About</a>
//             </Link>
//           </li>
//         </ul>
//         <Login /> {/* Login component */}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// import React from 'react';
// import Link from 'next/link';
// import Login from './Login'; // Import Login component

// const Navbar: React.FC = () => {
//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//       <div className="max-w-md mx-auto flex justify-between items-center"> {/* Flex container with max-width-md, justified between, and items centered vertically */}
//         <ul className="navbar-nav flex gap-4"> {/* Container for navigation links */}
//           <li className="nav-item">
//             <Link href="/">
//               <a className="nav-link">Home</a>
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link href="/archive">
//               <a className="nav-link">Archive</a>
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link href="/artists">
//               <a className="nav-link">Artists</a>
//             </Link>
//           </li>
//           <li className="nav-item">
//             <Link href="/about">
//               <a className="nav-link">About</a>
//             </Link>
//           </li>
//         </ul>
//         <Login /> {/* Login component */}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;



// import React from 'react';
// import Link from 'next/link';
// import Login from './Login'; // Import Login component

// const Navbar: React.FC = () => {
//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//       <div className="container-fluid flex justify-between items-center"> {/* Outer container with flex layout */}
//         <div className="max-w-md mx-auto flex items-center"> {/* Inner container with max-width-md and flexbox */}
//           <div style={{ display: 'flex', gap: '1rem' }}> {/* Container for navigation items */}
//             <ul className="navbar-nav flex gap-4"> {/* Nav items */}
//               <li className="nav-item">
//                 <Link href="/">
//                   <a className="nav-link">Home</a>
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <Link href="/archive">
//                   <a className="nav-link">Archive</a>
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <Link href="/artists">
//                   <a className="nav-link">Artists</a>
//                 </Link>
//               </li>
//               <li className="nav-item">
//                 <Link href="/about">
//                   <a className="nav-link">About</a>
//                 </Link>
//               </li>
//             </ul>
//           </div>
//           <div className="flex-grow"></div> {/* Empty div to create space */}
//           <Login />
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;