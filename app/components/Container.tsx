// components/Container.tsx
import React, { ReactNode } from 'react';

interface ContainerProps {
  children?: ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return <div className="p-4">{children || 'Hello World'}</div>;
};

export default Container;
