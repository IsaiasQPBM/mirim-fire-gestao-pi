
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

interface RouteValidationConfig {
  adminOnlyRoutes: string[];
  protectedRoutes: string[];
  publicRoutes: string[];
}

const routeConfig: RouteValidationConfig = {
  adminOnlyRoutes: ['/admin', '/users'],
  protectedRoutes: [
    '/dashboard', 
    '/profile',
    '/courses', 
    '/classes', 
    '/disciplines', 
    '/calendar', 
    '/lessons/planning', 
    '/communications/messages'
  ],
  publicRoutes: ['/', '/login'],
};

export const useRouteValidation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const currentPath = location.pathname;
    
    // Verificar se é uma rota pública
    const isPublicRoute = routeConfig.publicRoutes.some(route => 
      currentPath === route || currentPath.startsWith(route)
    );

    // Se é rota pública, permitir acesso
    if (isPublicRoute) {
      return;
    }

    // Se não está autenticado e não é rota pública, redirecionar para login
    if (!user || !profile) {
      navigate('/login');
      return;
    }

    // Verificar rotas que requerem permissão de admin
    const isAdminRoute = routeConfig.adminOnlyRoutes.some(route => 
      currentPath.startsWith(route)
    );

    if (isAdminRoute && profile.role !== 'admin') {
      navigate('/dashboard');
      return;
    }

    // Verificar rotas protegidas (qualquer usuário autenticado)
    const isProtectedRoute = routeConfig.protectedRoutes.some(route => 
      currentPath.startsWith(route)
    );

    if (isProtectedRoute && !user) {
      navigate('/login');
      return;
    }

  }, [location.pathname, user, profile, loading, navigate]);

  return {
    isAuthenticated: !!user,
    userRole: profile?.role,
    currentPath: location.pathname,
  };
};
