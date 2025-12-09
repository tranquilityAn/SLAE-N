import React from 'react';

interface LayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ left, right }) => {
  return (
    <div className="layout">
      <div className="layout-left">{left}</div>
      <div className="layout-right">{right}</div>
    </div>
  );
};

export default Layout;
