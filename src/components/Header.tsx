
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import GlobalNavigation from './GlobalNavigation';
import NotificationsPanel from './NotificationsPanel';

interface HeaderProps {
  title: string;
  userRole: string;
  userName: string;
}

const Header: React.FC<HeaderProps> = ({ title, userRole, userName }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const userId = localStorage.getItem('userId') || 'user-1'; // Default to user-1 if not found

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would redirect to search results
    console.log('Searching for:', searchQuery);
  };

  return (
    <div className="flex flex-col">
      {/* Top header with user information */}
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-cbmepi-black">{title}</h1>

          {/* Mobile menu button */}
          <div className="md:hidden ml-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <div className="p-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-cbmepi-orange text-white flex items-center justify-center font-bold border-2 border-cbmepi-red">
                      {userName.charAt(0)}
                    </div>
                    <div>
                      <div className="font-medium">{userName}</div>
                      <div className="text-xs text-gray-500 capitalize">{userRole}</div>
                    </div>
                  </div>
                </div>
                <div className="py-4">
                  <GlobalNavigation userRole={userRole as 'admin' | 'instructor' | 'student'} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Search bar - only visible on larger screens */}
          <div className="hidden md:flex items-center relative rounded-md border border-input bg-white focus-within:ring-1 focus-within:ring-primary">
            <Search size={18} className="absolute left-3 text-gray-400" />
            <Input 
              type="search"
              placeholder="Pesquisar..." 
              className="pl-10 border-none rounded-md bg-transparent w-64 h-9" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {/* Notifications icon */}
          <NotificationsPanel userId={userId} />
          
          {/* User avatar */}
          <div className="flex items-center gap-2">
            <div className="hidden md:block text-right">
              <div className="text-sm font-medium">{userName}</div>
              <div className="text-xs text-gray-500 capitalize">{userRole}</div>
            </div>
            <Link to="/profile">
              <div className="w-9 h-9 rounded-full bg-cbmepi-orange text-white flex items-center justify-center font-bold border-2 border-cbmepi-red">
                {userName.charAt(0)}
              </div>
            </Link>
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
