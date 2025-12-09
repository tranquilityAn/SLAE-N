import React from 'react';

interface LayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ left, right }) => {
  return (
    <div
      className="layout"
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem',
        alignItems: 'start',
      }}
    >
      <div className="layout-left" style={{ padding: '1rem', border: '1px solid #3a3a3a', borderRadius: '8px' }}>
        {left}
      </div>
      <div className="layout-right" style={{ padding: '1rem', border: '1px solid #3a3a3a', borderRadius: '8px' }}>
        {right}
      </div>
    </div>
  );
};

export default Layout;
