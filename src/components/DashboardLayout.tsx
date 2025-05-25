
import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Footer from './Footer';
import RouteValidator from './RouteValidator';
import { cn } from '@/lib/utils';
import RouteLogger from './RouteLogger';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#F5A623]" />
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Redirecionar para login se não autenticado
  if (!user || !profile) {
    navigate('/login');
    return null;
  }

  const handleRouteChange = (path: string, timestamp: number) => {
    // Log route changes for analytics
    console.log(`User ${profile.full_name} (${profile.role}) accessed: ${path}`);
    
    // Example: Report frequent 404s to admin
    const notFoundLog = JSON.parse(localStorage.getItem('notFoundLog') || '[]');
    
    // Check if there are multiple 404s in the last hour
    const lastHour = timestamp - 3600000;
    const recent404s = notFoundLog.filter((log: any) => log.timestamp > lastHour);
    
    if (recent404s.length > 5 && profile.role === 'admin') {
      toast({
        title: "Alerta de Navegação",
        description: `Foram detectados ${recent404s.length} erros de navegação na última hora.`,
        variant: "destructive",
      });
    }
  };

  return (
    <RouteValidator>
      <div className="min-h-screen flex flex-col">
        {/* Route logger for analytics */}
        <RouteLogger onRouteChange={handleRouteChange} />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <Sidebar 
            userRole={profile.role} 
            userName={profile.full_name}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
          
          {/* Main Content */}
          <div className={cn(
            "flex-1 flex flex-col transition-all duration-300",
            isCollapsed ? 'ml-16' : 'ml-64'
          )}>
            <main className="flex-1 overflow-y-auto bg-gray-50">
              <Outlet />
            </main>
            
            {/* Footer */}
            <Footer />
          </div>
        </div>
      </div>
    </RouteValidator>
  );
};

export default DashboardLayout;
