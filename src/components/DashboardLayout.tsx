
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';
import RouteLogger from './RouteLogger';
import { useToast } from '@/hooks/use-toast';

const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [userRole, setUserRole] = useState<'admin' | 'instructor' | 'student'>('student');
  const [userName, setUserName] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

    if (!storedUserRole || !storedUserName) {
      navigate('/login');
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

  const handleRouteChange = (path: string, timestamp: number) => {
    // Log route changes for analytics
    console.log(`User ${userName} (${userRole}) accessed: ${path}`);
    
    // Example: Report frequent 404s to admin
    const notFoundLog = JSON.parse(localStorage.getItem('notFoundLog') || '[]');
    
    // Check if there are multiple 404s in the last hour
    const lastHour = timestamp - 3600000;
    const recent404s = notFoundLog.filter((log: any) => log.timestamp > lastHour);
    
    if (recent404s.length > 5 && userRole === 'admin') {
      toast({
        title: "Alerta de Navegação",
        description: `Foram detectados ${recent404s.length} erros de navegação na última hora.`,
        variant: "destructive",
      });
    }
  };

  // Don't render until we have user role
  if (!userRole) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Route logger for analytics */}
      <RouteLogger onRouteChange={handleRouteChange} />
      
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
