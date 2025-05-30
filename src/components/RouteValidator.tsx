
import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface RouteValidatorProps {
  children: React.ReactNode;
}

const RouteValidator: React.FC<RouteValidatorProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  // Lista de rotas válidas do sistema - ATUALIZADA
  const validRoutes = [
    '/',
    '/login',
    '/dashboard',
    '/admin',
    '/admin/migration',
    '/courses',
    '/courses/create',
    '/classes',
    '/classes/create',
    '/disciplines',
    '/calendar',
    '/lessons/planning',
    '/communications/messages',
    '/users',
    '/users/create',
  ];

  // Padrões de rotas dinâmicas válidas
  const dynamicRoutePatterns = [
    /^\/courses\/[^\/]+$/,
    /^\/courses\/[^\/]+\/edit$/,
    /^\/classes\/[^\/]+$/,
    /^\/classes\/[^\/]+\/edit$/,
    /^\/users\/[^\/]+$/,
    /^\/users\/[^\/]+\/edit$/,
    /^\/users\/[^\/]+\/permissions$/,
  ];

  useEffect(() => {
    // Não validar durante o loading
    if (loading) return;

    const currentPath = location.pathname;
    
    // Verificar se é uma rota válida estática
    const isValidStaticRoute = validRoutes.includes(currentPath);
    
    // Verificar se corresponde a algum padrão dinâmico
    const isValidDynamicRoute = dynamicRoutePatterns.some(pattern => 
      pattern.test(currentPath)
    );

    // Se não é uma rota válida, redirecionar para 404
    if (!isValidStaticRoute && !isValidDynamicRoute) {
      console.warn(`Invalid route detected: ${currentPath}`);
      
      // Salvar informações sobre a rota inválida para analytics
      const routeError = {
        path: currentPath,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        referrer: document.referrer,
      };
      
      // Armazenar no localStorage para análise posterior
      const existingErrors = JSON.parse(localStorage.getItem('routeErrors') || '[]');
      existingErrors.push(routeError);
      
      // Manter apenas os últimos 50 erros
      if (existingErrors.length > 50) {
        existingErrors.splice(0, existingErrors.length - 50);
      }
      
      localStorage.setItem('routeErrors', JSON.stringify(existingErrors));
    }

    // Verificar se o usuário tem permissão para acessar a rota
    if (currentPath.startsWith('/admin') && profile?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    if (currentPath.startsWith('/users') && profile?.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

  }, [location.pathname, user, profile, loading, navigate]);

  return <>{children}</>;
};

export default RouteValidator;
