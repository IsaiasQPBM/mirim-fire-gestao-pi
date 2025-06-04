
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { User, LogOut, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import CBMEPILogo from './CBMEPILogo';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { signOut, profile } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  const navigationItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Calendário', path: '/calendar' },
    { label: 'Planejamento', path: '/lessons/planning' },
    { label: 'Usuários', path: '/users' },
    { label: 'Mensagens', path: '/communication/messages' },
  ];

  const NavItems = ({ mobile = false, onItemClick }: { mobile?: boolean; onItemClick?: () => void }) => (
    <div className={mobile ? 'flex flex-col space-y-2' : 'hidden md:flex items-center space-x-6'}>
      {navigationItems.map((item) => (
        <button
          key={item.path}
          onClick={() => {
            navigate(item.path);
            onItemClick?.();
          }}
          className={`${
            mobile 
              ? 'text-left px-4 py-2 rounded-md hover:bg-gray-100 w-full' 
              : 'text-white hover:text-cbmepi-orange transition-colors'
          } text-sm font-medium`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );

  return (
    <header className="bg-cbmepi-black shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <CBMEPILogo />
            <div className="hidden sm:block">
              <h1 className="text-white text-lg font-bold">CBMEPI Gestão</h1>
              <p className="text-gray-300 text-xs">Sistema de Gestão Educacional</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <NavItems />

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b">
                    <div className="flex items-center space-x-3">
                      <CBMEPILogo />
                      <div>
                        <h2 className="font-bold text-cbmepi-black">CBMEPI</h2>
                        <p className="text-xs text-gray-600">Sistema de Gestão</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 py-4">
                    <NavItems mobile onItemClick={() => setIsMobileMenuOpen(false)} />
                  </div>
                  <div className="p-4 border-t">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-cbmepi-orange rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {profile?.full_name || 'Usuário'}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">
                          {profile?.role || 'student'}
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sair
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* Desktop User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="hidden md:flex items-center space-x-2 text-white hover:bg-gray-800">
                  <div className="w-8 h-8 bg-cbmepi-orange rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-medium">{profile?.full_name || 'Usuário'}</p>
                    <p className="text-xs text-gray-300 capitalize">{profile?.role || 'student'}</p>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Meu Perfil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
