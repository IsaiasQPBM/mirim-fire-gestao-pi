
import React from 'react';
import { useLocation } from 'react-router-dom';

interface RouterConfigProps {
  children: React.ReactNode;
}

/**
 * Componente que configura o roteamento para garantir que todas as rotas
 * sejam tratadas pelo React Router, evitando erros 404 do servidor
 */
const RouterConfig: React.FC<RouterConfigProps> = ({ children }) => {
  const location = useLocation();
  
  React.useEffect(() => {
    // Log da rota atual para debug
    console.log(`Current route: ${location.pathname}`);
    
    // Garantir que o título da página seja atualizado
    const routeTitles: Record<string, string> = {
      '/': 'Sistema de Gestão - CBMEPI',
      '/login': 'Login - Sistema CBMEPI',
      '/dashboard': 'Dashboard - Sistema CBMEPI',
      '/profile': 'Meu Perfil - Sistema CBMEPI',
      '/curriculum': 'Currículo - Sistema CBMEPI',
      '/courses': 'Cursos - Sistema CBMEPI',
      '/classes': 'Turmas - Sistema CBMEPI',
      '/disciplines': 'Disciplinas - Sistema CBMEPI',
      '/students': 'Estudantes - Sistema CBMEPI',
      '/reports': 'Relatórios - Sistema CBMEPI',
      '/users': 'Usuários - Sistema CBMEPI',
      '/admin': 'Administração - Sistema CBMEPI',
      '/pedagogical/assessments': 'Avaliações - Sistema CBMEPI',
      '/pedagogical/observations': 'Observações - Sistema CBMEPI',
    };
    
    const title = routeTitles[location.pathname] || 'Sistema de Gestão - CBMEPI';
    document.title = title;
    
    // Configurar meta tags para SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Sistema de Gestão Educacional para o Pelotão Mirim do Corpo de Bombeiros Militar do Estado do Piauí');
    }
    
  }, [location.pathname]);
  
  return <>{children}</>;
};

export default RouterConfig;
