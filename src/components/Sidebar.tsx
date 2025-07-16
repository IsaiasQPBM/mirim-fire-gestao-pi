
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
  LogOut,
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
      { name: 'Dashboard', icon: Home, path: '/dashboard', roles: ['admin', 'instructor', 'student'], section: 'main' },
    ];

    if (role === 'admin') {
      items.push(
        { name: 'Gerenciar Usuários', icon: UserCog, path: '/users', roles: ['admin'], section: 'admin' },
        { name: 'Gerenciar Cursos', icon: BookOpen, path: '/courses', roles: ['admin'], section: 'admin' },
        { name: 'Gerenciar Disciplinas', icon: BookPlus, path: '/disciplines', roles: ['admin'], section: 'admin' },
        { name: 'Gerenciar Turmas', icon: Users, path: '/classes', roles: ['admin'], section: 'admin' },
        { name: 'Calendário Acadêmico', icon: CalendarDays, path: '/calendar', roles: ['admin'], section: 'admin' },
        { name: 'Grade Curricular', icon: ListOrdered, path: '/curriculum', roles: ['admin'], section: 'admin' },
        { name: 'Relatórios', icon: FileText, path: '/reports', roles: ['admin'], section: 'admin' }
      );
    }

    if (role === 'admin' || role === 'instructor') {
      items.push(
        { name: 'Alunos', icon: Users, path: '/students', roles: ['admin', 'instructor'], section: 'pedagogical' },
        { name: role === 'instructor' ? 'Minhas Disciplinas' : 'Disciplinas', icon: BookOpen, path: '/disciplines', roles: ['admin', 'instructor'], section: 'pedagogical' },
        { name: role === 'instructor' ? 'Minhas Turmas' : 'Turmas', icon: Users, path: '/classes', roles: ['admin', 'instructor'], section: 'pedagogical' },
        { name: 'Calendário', icon: Calendar, path: '/calendar', roles: ['admin', 'instructor'], section: 'pedagogical' },
        { name: 'Planejamento de Aulas', icon: PenLine, path: '/lessons/planning', roles: ['admin', 'instructor'], section: 'pedagogical' },
        { name: 'Comunicações', icon: MessageSquare, path: '/communication/messages', roles: ['admin', 'instructor'], section: 'pedagogical' }
      );
    }

    if (role === 'student') {
      items.push(
        { name: 'Notas', icon: BookOpen, path: '/grades', roles: ['student'], section: 'student' },
        { name: 'Cronograma', icon: Calendar, path: '/schedule', roles: ['student'], section: 'student' },
        { name: 'Meus Cursos', icon: BookOpen, path: '/courses', roles: ['student'], section: 'student' },
        { name: 'Calendário', icon: CalendarDays, path: '/calendar', roles: ['student'], section: 'student' },
        { name: 'Mensagens', icon: MessageSquare, path: '/communication/messages', roles: ['student'], section: 'student' },
        { name: 'Notificações', icon: MessageSquare, path: '/communication/notifications', roles: ['admin', 'instructor', 'student'], section: 'student' }
      );
    }

    if (role === 'admin') {
      items.push(
        { name: 'Configurações', icon: Settings, path: '/settings', roles: ['admin'], section: 'settings' }
      );
    }

    return items.filter(item => item.roles.includes(role));
  };

  const navigationItems = getNavigationItems(userRole);

  // Check if a navigation item is active
  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Agrupar por seção para espaçamento
  const groupedItems = navigationItems.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = [];
    acc[item.section].push(item);
    return acc;
  }, {} as Record<string, typeof navigationItems>);

  return (
    <SidebarComponent collapsible="icon">
      <SidebarHeader className="p-4 border-b border-gray-200" style={{
        background: 'linear-gradient(180deg, #8B0000, #B22222, #DC143C)',
        boxShadow: '0 2px 8px 0 rgba(0,0,0,0.10)'
      }}>
        <div className="flex flex-col items-center">
          {collapsed ? (
            <CBMEPILogo size="small" withText={false} />
          ) : (
            <>
              <CBMEPILogo size="small" withText={false} />
              <span
                className="mt-2 text-xs font-bold text-white text-center tracking-wide"
                style={{
                  textShadow: '0 1px 4px #222, 0 0 2px #000',
                  letterSpacing: '0.04em',
                  lineHeight: 1.2
                }}
              >
                CORPO DE BOMBEIROS MILITAR DO ESTADO DO PIAUÍ
              </span>
            </>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent style={{
        background: 'linear-gradient(180deg, #8B0000, #B22222, #DC143C)',
        color: '#fff',
        minHeight: '100vh'
      }}>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {Object.entries(groupedItems).map(([section, items], idx) => (
                <div key={section} className={idx > 0 ? 'mt-4' : ''}>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.name}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.path)}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded transition-all duration-200 font-medium',
                          isActive(item.path)
                            ? 'bg-white/10 border-l-4 border-white text-white shadow'
                            : 'hover:bg-[#e53935] hover:text-white',
                          'text-white'
                        )}
                        style={{
                          color: '#fff',
                          fontWeight: 500
                        }}
                      >
                        <Link to={item.path} className="flex items-center gap-3 w-full">
                          <item.icon size={18} color="#fff" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </div>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-gray-200" style={{
        background: 'linear-gradient(180deg, #8B0000, #B22222, #DC143C)',
        color: '#fff'
      }}>
        <button
          className="flex items-center gap-2 w-full px-3 py-2 rounded bg-white/10 text-white font-semibold hover:bg-white/20 transition"
          style={{ fontWeight: 600 }}
          onClick={() => { window.location.href = '/logout'; }}
        >
          <LogOut size={18} color="#fff" />
          Sair
        </button>
      </SidebarFooter>
    </SidebarComponent>
  );
};

export default Sidebar;
