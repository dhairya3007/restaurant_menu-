import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/AdminSidebar';

const AdminLayout = () => {
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  return (
    <div className="d-flex" style={{ minHeight: '100vh', background: '#f8f9fc' }}>
      <AdminSidebar isHovered={isSidebarHovered} setIsHovered={setIsSidebarHovered} />
      <div 
        className="flex-grow-1 p-4" 
        style={{ 
          marginLeft: isSidebarHovered ? '260px' : '80px', 
          transition: 'margin-left 0.3s ease' 
        }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
