
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import Sidebar from '@/components/Sidebar';

const DashboardLayout: React.FC = () => {
  const userRole = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName');

  // Check if user is logged in
  if (!userRole || !userName) {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar 
          userRole={userRole as 'admin' | 'instructor' | 'student'} 
          userName={userName} 
        />
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
