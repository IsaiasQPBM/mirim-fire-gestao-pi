
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const BreadcrumbNavigation: React.FC = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const breadcrumbNameMap: { [key: string]: string } = {
    dashboard: 'Dashboard',
    admin: 'Administração',
    migration: 'Migração de Dados',
    courses: 'Cursos',
    create: 'Criar',
    edit: 'Editar',
    classes: 'Turmas',
    users: 'Usuários',
    permissions: 'Permissões',
  };

  const generateBreadcrumbs = () => {
    const breadcrumbs = [
      {
        name: 'Início',
        path: '/dashboard',
        icon: Home,
      },
    ];

    let currentPath = '';
    pathnames.forEach((pathname, index) => {
      currentPath += `/${pathname}`;
      
      // Pular IDs de recursos (assumindo que são UUIDs ou números)
      const isResourceId = /^[a-f\d-]{36}$|^\d+$/.test(pathname);
      
      if (!isResourceId) {
        breadcrumbs.push({
          name: breadcrumbNameMap[pathname] || pathname,
          path: currentPath,
        });
      }
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
      {breadcrumbs.map((breadcrumb, index) => (
        <React.Fragment key={breadcrumb.path}>
          {index > 0 && <ChevronRight size={16} className="text-gray-400" />}
          
          {index === breadcrumbs.length - 1 ? (
            <span className="text-gray-900 font-medium flex items-center gap-1">
              {breadcrumb.icon && <breadcrumb.icon size={16} />}
              {breadcrumb.name}
            </span>
          ) : (
            <Link
              to={breadcrumb.path}
              className="hover:text-cbmepi-orange transition-colors flex items-center gap-1"
            >
              {breadcrumb.icon && <breadcrumb.icon size={16} />}
              {breadcrumb.name}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default BreadcrumbNavigation;
