import React from 'react';
import { Outlet } from 'react-router-dom';

const BlankLayout = () => {
  return (
    <div className="blank-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Outlet />
    </div>
  );
};

export default BlankLayout;
