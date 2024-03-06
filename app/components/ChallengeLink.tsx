// components/ChallengeLink.tsx
import React from 'react';
import Link from 'next/link';

interface ChallengeLinkProps {
  theme: string | null;
}

const ChallengeLink: React.FC<ChallengeLinkProps> = ({ theme }) => {
  return (
    <div>
      {theme ? (
        <Link href="/challenge">
          <a className="underline">Current theme: {theme}</a>
        </Link>
      ) : (
        <span>No current theme</span>
      )}
    </div>
  );
};

export default ChallengeLink;
