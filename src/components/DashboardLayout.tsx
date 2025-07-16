
import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

const DashboardLayout: React.FC = () => {
  const userRole = localStorage.getItem('userRole');
  const userName = localStorage.getItem('userName');
  const location = useLocation();

  // Check if user is logged in
  if (!userRole || !userName) {
    return <Navigate to="/" replace />;
  }

  // Get page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/users')) return 'Gestão de Usuários';
    if (path.startsWith('/students')) return 'Gestão de Alunos';
    if (path.startsWith('/curriculum')) return 'Gestão Curricular';
    if (path.startsWith('/courses')) return 'Cursos';
    if (path.startsWith('/classes')) return 'Turmas';
    if (path.startsWith('/disciplines')) return 'Disciplinas';
    if (path.startsWith('/pedagogical')) return 'Gestão Pedagógica';
    if (path.startsWith('/communication')) return 'Comunicação';
    if (path.startsWith('/reports')) return 'Relatórios';
    if (path.startsWith('/admin')) return 'Administração';
    if (path === '/profile') return 'Perfil';
    if (path === '/settings') return 'Configurações';
    return 'Sistema CBMEPI';
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <Sidebar 
          userRole={userRole as 'admin' | 'instructor' | 'student'} 
          userName={userName} 
        />
        <div className="flex-1 flex flex-col">
          <Header 
            title={getPageTitle()} 
            userRole={userRole} 
            userName={userName} 
          />
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
