import React from 'react';

interface LayoutProps {
  inputs: React.ReactNode;
  results: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ inputs, results }) => {
  return (
    <div className="layout">
      <div className="layout-section">{inputs}</div>
      <div className="layout-section">{results}</div>
    </div>
  );
};

export default Layout;
