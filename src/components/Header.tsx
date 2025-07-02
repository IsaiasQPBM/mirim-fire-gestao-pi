
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import GlobalNavigation from './GlobalNavigation';
import NotificationsPanel from './NotificationsPanel';
import GlobalSearch from './GlobalSearch';
import LogoutButton from './LogoutButton';

interface HeaderProps {
  title: string;
  userRole: string;
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ title, userRole, userName }) => {
  const userId = localStorage.getItem('userId') || 'user-1';

  return (
    <div className="flex flex-col w-full">
      {/* Top header with user information */}
      <header className="bg-white border-b border-gray-200 py-3 px-4 md:py-4 md:px-6 flex justify-between items-center w-full">
        <div className="flex items-center min-w-0 flex-1">
          <h1 className="text-lg md:text-2xl font-bold text-cbmepi-black truncate">{title}</h1>

          {/* Mobile menu button */}
          <div className="md:hidden ml-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-80">
                <div className="p-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-cbmepi-orange text-white flex items-center justify-center font-bold border-2 border-cbmepi-red">
                      {userName.charAt(0)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{userName}</div>
                      <div className="text-xs text-gray-500 capitalize">{userRole}</div>
                    </div>
                  </div>
                </div>
                <div className="py-4">
                  <GlobalNavigation userRole={userRole as 'admin' | 'instructor' | 'student'} />
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <LogoutButton 
                    variant="outline" 
                    size="default" 
                    className="w-full" 
                    showText={true}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search bar - only visible on larger screens */}
          <div className="hidden lg:block w-48 xl:w-64">
            <GlobalSearch />
          </div>
          
          {/* Notifications icon */}
          <NotificationsPanel userId={userId} />
          
          {/* User avatar and info */}
          <div className="flex items-center gap-2">
            <div className="hidden md:block text-right">
              <div className="text-sm font-medium truncate max-w-32">{userName}</div>
              <div className="text-xs text-gray-500 capitalize">{userRole}</div>
            </div>
            <Link to="/profile">
              <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-cbmepi-orange text-white flex items-center justify-center font-bold border-2 border-cbmepi-red">
                {userName.charAt(0)}
              </div>
            </Link>
            
            {/* Desktop logout button */}
            <div className="hidden md:block">
              <LogoutButton 
                variant="ghost" 
                size="sm" 
                showText={false}
              />
            </div>
          </div>
        </div>
      </header>
      
      {/* Navigation menu - only visible on desktop */}
      <div className="hidden md:block">
        <GlobalNavigation userRole={userRole as 'admin' | 'instructor' | 'student'} />
      </div>
    </div>
  );
};

export default Header;
