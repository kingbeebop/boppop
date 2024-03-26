import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store';
import { fetchChallenge, selectChallenge } from '../redux/slices/challengeSlice';
import { fetchSubmissionData } from '../redux/slices/submissionSlice'; // Import fetchSubmissionData from submissionSlice
import Link from 'next/link';
import SubmissionForm from './SubmissionForm';

const Challenge: React.FC = () => {
  const dispatch = useDispatch<any>();
  const { number, theme } = useSelector(selectChallenge);
  const { song: currentSubmission, isLoading } = useSelector((state: RootState) => state.submission);

  useEffect(() => {
    dispatch(fetchChallenge());
    dispatch(fetchSubmissionData());
  }, [dispatch]);

  return (
    <div>
      <h1>Challenge Page</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <h2>Bop Pop {number}</h2>
          <h1 style={{ fontSize: '2rem' }}>{theme}</h1>

          {currentSubmission && (
            <div>
              <h3>Current Submission:</h3>
              <div>
                <p>Title: {currentSubmission.title}</p>
                <Link href={currentSubmission.url} passHref>
                  <a target="_blank" rel="noopener noreferrer">Check URL</a>
                </Link>
              </div>
            </div>
          )}

          <SubmissionForm />
        </>
      )}
    </div>
  );
};

export default Challenge;

// import React, { useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchSubmission } from '../utils/api';
// import { RootState } from '../redux/store';
// import { fetchChallenge, selectChallenge } from '../redux/slices/challengeSlice';
// import Link from 'next/link';
// import SubmissionForm from './SubmissionForm'; // Import SubmissionForm from ./SubmissionForm

// const Challenge: React.FC = () => {
//   const dispatch = useDispatch<any>();
//   const { number, theme } = useSelector(selectChallenge);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [currentSubmission, setCurrentSubmission] = useState<any>(null); // Update with actual types

//   useEffect(() => {
//     dispatch(fetchChallenge());
//     fetchSubmissionData();
//   }, [dispatch]);

//   const fetchSubmissionData = async () => {
//     try {
//       const data = await fetchSubmission();
//       setCurrentSubmission(data);
//       setIsLoading(false);
//     } catch (error) {
//       console.error('Error fetching submission data:', error);
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//       <h1>Challenge Page</h1>
//       {isLoading ? (
//         <div>Loading...</div>
//       ) : (
//         <>
//           <h2>Bop Pop {number}</h2>
//           <h1 style={{ fontSize: '2rem' }}>{theme}</h1>

//           {currentSubmission && (
//             <div>
//               <h3>Current Submission:</h3>
//               <div>
//                 <p>Title: {currentSubmission.title}</p>
//                 <Link href={currentSubmission.url} passHref>
//                   <a target="_blank" rel="noopener noreferrer">Check URL</a>
//                 </Link>
//               </div>
//             </div>
//           )}

//           <SubmissionForm />
//         </>
//       )}
//     </div>
//   );
// };

// export default Challenge;
