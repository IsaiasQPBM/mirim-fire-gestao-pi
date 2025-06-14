
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  BookOpen, 
  Calendar, 
  Settings,
  Shield, 
  LogIn,
  UserCog,
  BookPlus,
  CalendarDays,
  ListOrdered,
  PenLine,
  MessageSquare,
  FileText,
} from 'lucide-react';
import CBMEPILogo from './CBMEPILogo';

type UserRole = 'admin' | 'instructor' | 'student';

interface SidebarProps {
  userRole: UserRole;
  userName: string;
  isCollapsed?: boolean;
  setIsCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  userRole, 
  userName, 
  isCollapsed = false, 
  setIsCollapsed 
}) => {
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const location = useLocation();

  const toggleSidebar = () => {
    const newValue = !collapsed;
    setCollapsed(newValue);
    if (setIsCollapsed) {
      setIsCollapsed(newValue);
    }
  };

  // Define navigation items based on user role
  const getNavigationItems = (role: UserRole) => {
    const items = [
      { name: 'Dashboard', icon: Home, path: '/dashboard', roles: ['admin', 'instructor', 'student'] },
    ];

    if (role === 'admin') {
      items.push(
        { name: 'Gerenciar Usuários', icon: UserCog, path: '/users', roles: ['admin'] },
        { name: 'Gerenciar Cursos', icon: BookOpen, path: '/courses', roles: ['admin'] },
        { name: 'Gerenciar Disciplinas', icon: BookPlus, path: '/disciplines', roles: ['admin'] },
        { name: 'Gerenciar Turmas', icon: Users, path: '/classes', roles: ['admin'] },
        { name: 'Calendário Acadêmico', icon: CalendarDays, path: '/calendar', roles: ['admin'] },
        { name: 'Grade Curricular', icon: ListOrdered, path: '/curriculum', roles: ['admin'] },
        { name: 'Relatórios', icon: FileText, path: '/reports', roles: ['admin'] }
      );
    }

    if (role === 'admin' || role === 'instructor') {
      items.push(
        { name: 'Alunos', icon: Users, path: '/students', roles: ['admin', 'instructor'] },
        { name: role === 'instructor' ? 'Minhas Disciplinas' : 'Disciplinas', icon: BookOpen, path: '/disciplines', roles: ['admin', 'instructor'] },
        { name: role === 'instructor' ? 'Minhas Turmas' : 'Turmas', icon: Users, path: '/classes', roles: ['admin', 'instructor'] },
        { name: 'Calendário', icon: Calendar, path: '/calendar', roles: ['admin', 'instructor'] },
        { name: 'Planejamento de Aulas', icon: PenLine, path: '/lessons/planning', roles: ['admin', 'instructor'] },
        { name: 'Comunicações', icon: MessageSquare, path: '/communications/messages', roles: ['admin', 'instructor'] }
      );
    }

    if (role === 'student') {
      items.push(
        { name: 'Notas', icon: BookOpen, path: '/grades', roles: ['student'] },
        { name: 'Cronograma', icon: Calendar, path: '/schedule', roles: ['student'] },
        { name: 'Meus Cursos', icon: BookOpen, path: '/courses', roles: ['student'] },
        { name: 'Calendário', icon: CalendarDays, path: '/calendar', roles: ['student'] },
        { name: 'Mensagens', icon: MessageSquare, path: '/communications/messages', roles: ['student'] }
      );
    }

    if (role === 'admin') {
      items.push(
        { name: 'Configurações', icon: Settings, path: '/settings', roles: ['admin'] }
      );
    }

    return items.filter(item => item.roles.includes(role));
  };

  const navigationItems = getNavigationItems(userRole);

  // Check if a navigation item is active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div 
      className={cn(
        'flex flex-col h-screen bg-sidebar transition-all duration-300 border-r border-sidebar-border',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Sidebar Header */}
      <div className="p-4 flex justify-center border-b border-sidebar-border">
        {collapsed ? (
          <CBMEPILogo size="small" withText={false} />
        ) : (
          <CBMEPILogo size="small" withText={true} />
        )}
      </div>

      {/* Role Badge */}
      <div className={cn(
        'mx-4 my-2 p-2 rounded-md bg-sidebar-accent flex items-center gap-2 text-sidebar-foreground',
        collapsed && 'justify-center'
      )}>
        <Shield size={18} />
        {!collapsed && (
          <span className="text-sm font-medium capitalize">{userRole}</span>
        )}
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-4 overflow-y-auto">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={cn(
              'flex items-center px-4 py-3 mx-2 rounded-md text-sidebar-foreground',
              isActive(item.path) 
                ? 'bg-cbmepi-orange text-white' 
                : 'hover:bg-sidebar-accent',
              collapsed ? 'justify-center' : 'justify-start'
            )}
          >
            <item.icon size={collapsed ? 22 : 18} className={cn(!collapsed && 'mr-3')} />
            {!collapsed && (
              <span className="text-sm font-medium">{item.name}</span>
            )}
          </Link>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 bg-sidebar-accent text-sidebar-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground"
          onClick={toggleSidebar}
        >
          {!collapsed && <span>Recolher</span>}
          <LogIn size={18} className={cn(collapsed ? '' : 'rotate-180')} />
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
