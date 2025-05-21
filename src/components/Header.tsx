
import React from 'react';
import { Bell, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  title: string;
  userRole: string;
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ title, userRole, userName }) => {
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-cbmepi-black">{title}</h1>
      
      <div className="flex items-center gap-4">
        {/* Search bar - only visible on larger screens */}
        <div className="hidden md:flex items-center relative rounded-md border border-input bg-white focus-within:ring-1 focus-within:ring-primary">
          <Search size={18} className="absolute left-3 text-gray-400" />
          <Input 
            type="search"
            placeholder="Pesquisar..." 
            className="pl-10 border-none rounded-md bg-transparent w-64 h-9" 
          />
        </div>
        
        {/* Notifications icon */}
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-secondary text-white text-[10px] flex items-center justify-center">
            3
          </span>
        </Button>
        
        {/* User avatar */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block text-right">
            <div className="text-sm font-medium">{userName}</div>
            <div className="text-xs text-gray-500 capitalize">{userRole}</div>
          </div>
          <div className="w-9 h-9 rounded-full bg-cbmepi-orange text-white flex items-center justify-center font-bold border-2 border-cbmepi-red">
            {userName.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
