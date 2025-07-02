
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const DashboardLayout: React.FC = () => {
  const userRole = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName');

  // Check if user is logged in
  if (!userRole || !userName) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <main className="w-full h-full">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
