
import React from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Search, Bell, User } from 'lucide-react';
import GlobalSearch from './GlobalSearch';
import NotificationsPanel from './NotificationsPanel';
import LogoutButton from './LogoutButton';

interface HeaderProps {
  title: string;
  userRole: string;
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ title, userRole, userName }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="text-orange-500 hover:text-orange-600 transition-all duration-200 ease-in-out" />
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>
      
      <div className="flex items-center gap-4">
        <GlobalSearch />
        <NotificationsPanel userId={userName} />
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User size={16} className="text-orange-500" />
          <span className="hidden sm:inline font-medium">{userName}</span>
          <span className="text-xs text-gray-400 hidden md:inline">({userRole})</span>
        </div>
        
        <LogoutButton />
      </div>
    </header>
  );
};

export default Header;
