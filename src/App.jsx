import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import BlankLayout from './layouts/BlankLayout';
import AdminLayout from './layouts/AdminLayout';

// Auth Pages
import Login from './pages/Login';
import ClientSetup from './pages/ClientSetup';

// Client Dashboard Pages
import Dashboard from './pages/Dashboard';
import BusinessDetails from './pages/BusinessDetails';
import CategoryManagement from './pages/CategoryManagement';
import DishManagement from './pages/DishManagement';
import ThemeSelection from './pages/ThemeSelection';
import MenuPreview from './pages/MenuPreview';

// Super Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateQR from './pages/admin/CreateQR';
import CreateQRPersonal from './pages/admin/CreateQRPersonal';
import Profile from './pages/Profile';

import './css/index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth Route */}
        <Route element={<BlankLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/setup/:token" element={<ClientSetup />} />
        </Route>

        {/* Client Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="business" element={<BusinessDetails />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="dishes" element={<DishManagement />} />
          <Route path="themes" element={<ThemeSelection />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Super Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="create-qr" element={<CreateQR />} />
          <Route path="create-qr-personal" element={<CreateQRPersonal />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Catch-all Public Route (MUST BE AT THE BOTTOM to prevent collisions) */}
        <Route element={<BlankLayout />}>
          <Route path="/:token" element={<MenuPreview />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
