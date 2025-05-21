
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';

const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'instructor' | 'student'>('student');
  const [userName, setUserName] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

    if (!storedUserRole || !storedUserName) {
      navigate('/');
      return;
    }

    // Set user data
    setUserRole(storedUserRole as 'admin' | 'instructor' | 'student');
    setUserName(storedUserName);

    // Set userId if not already set
    if (!localStorage.getItem('userId')) {
      // Default userId based on role
      if (storedUserRole === 'admin') {
        localStorage.setItem('userId', 'user-1');
      } else if (storedUserRole === 'instructor') {
        localStorage.setItem('userId', 'user-2');
      } else {
        localStorage.setItem('userId', 'user-3');
      }
    }
  }, [navigate]);

  // Don't render until we have user role
  if (!userRole) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar 
        userRole={userRole} 
        userName={userName}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />
      
      {/* Main Content */}
      <div className={cn(
        "flex-1 overflow-y-auto transition-all duration-300",
        isCollapsed ? 'ml-16' : 'ml-64'
      )}>
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
