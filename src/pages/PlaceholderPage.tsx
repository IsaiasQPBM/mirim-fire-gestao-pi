
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useToast } from '@/hooks/use-toast';

interface PlaceholderPageProps {
  title?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title = 'Página em Desenvolvimento' }) => {
  const [userRole, setUserRole] = useState<string>(localStorage.getItem('userRole') || '');
  const [userName, setUserName] = useState<string>(localStorage.getItem('userName') || '');
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  
  useEffect(() => {
    // Log access to placeholder page
    console.log(`Placeholder page accessed: ${location.pathname}`);
  }, [location.pathname]);
  
  // Generate breadcrumb items based on current path
  const generateBreadcrumbs = () => {
    const paths = location.pathname.split('/').filter(path => path);
    
    // Map paths to user-friendly names
    const pathLabels: Record<string, string> = {
      'dashboard': 'Dashboard',
      'profile': 'Perfil',
      'users': 'Usuários',
      'courses': 'Cursos',
      'disciplines': 'Disciplinas',
      'classes': 'Turmas',
      'schedule': 'Cronograma',
      'grades': 'Notas',
      'calendar': 'Calendário',
      'reports': 'Relatórios',
      'communications': 'Comunicações',
      'help': 'Ajuda',
      'settings': 'Configurações',
      'placeholder': 'Página Temporária',
    };
    
    return paths.map((path, index) => {
      // Construct the href based on the current path segment and all previous segments
      const href = `/${paths.slice(0, index + 1).join('/')}`;
      const isLast = index === paths.length - 1;
      const label = pathLabels[path] || path;
      
      return {
        href,
        label,
        isLast
      };
    });
  };
  
  const breadcrumbs = generateBreadcrumbs();
  
  const handleReportIssue = () => {
    toast({
      title: "Problema reportado",
      description: `O acesso à página ${location.pathname} foi reportado à equipe de desenvolvimento.`,
      variant: "default",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title={title} userRole={userRole} userName={userName} />
      
      <div className="px-6 py-3 bg-white border-b">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/dashboard">
                  <Home className="h-3 w-3 mr-1" />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            
            {breadcrumbs.map((crumb, index) => (
              <React.Fragment key={crumb.href}>
                <BreadcrumbItem>
                  {crumb.isLast ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <Link to={crumb.href}>{crumb.label}</Link>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!crumb.isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      
      <main className="flex-1 p-6 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-cbmepi-orange border-t-transparent rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-bold text-cbmepi-black mb-2">{title}</h2>
        <p className="text-gray-600 max-w-md text-center mb-8">
          Esta funcionalidade está em desenvolvimento e será implementada em breve.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={() => navigate('/dashboard')} variant="default" className="bg-cbmepi-orange hover:bg-cbmepi-orange/90">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Button>
          
          <Button onClick={handleReportIssue} variant="outline">
            Reportar necessidade desta página
          </Button>
        </div>
      </main>
    </div>
  );
};

export default PlaceholderPage;
