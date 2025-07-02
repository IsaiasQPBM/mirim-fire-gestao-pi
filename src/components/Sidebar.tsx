
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { 
  Home, 
  Users, 
  BookOpen, 
  Calendar, 
  Settings,
  Shield, 
  UserCog,
  BookPlus,
  CalendarDays,
  ListOrdered,
  PenLine,
  MessageSquare,
  FileText,
} from 'lucide-react';
import CBMEPILogo from './CBMEPILogo';
import LogoutButton from './LogoutButton';

type UserRole = 'admin' | 'instructor' | 'student';

interface SidebarProps {
  userRole: UserRole;
  userName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ userRole, userName }) => {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

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
    <SidebarComponent collapsible="icon">
      <SidebarHeader className="p-4 border-b">
        <div className="flex justify-center">
          {collapsed ? (
            <CBMEPILogo size="small" withText={false} />
          ) : (
            <CBMEPILogo size="small" withText={true} />
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <Shield size={18} />
            {!collapsed && (
              <span className="text-sm font-medium capitalize">{userRole}</span>
            )}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild isActive={isActive(item.path)}>
                    <Link to={item.path}>
                      <item.icon size={18} />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <LogoutButton />
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
