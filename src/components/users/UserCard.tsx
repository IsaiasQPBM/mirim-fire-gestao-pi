
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User } from '@/data/userTypes';
import { cn } from '@/lib/utils';

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const roleBadgeColor = {
    admin: 'bg-purple-100 text-purple-800 border-purple-300',
    instructor: 'bg-blue-100 text-blue-800 border-blue-300',
    student: 'bg-green-100 text-green-800 border-green-300'
  };

  const statusBadgeColor = {
    active: 'bg-green-100 text-green-800 border-green-300',
    inactive: 'bg-red-100 text-red-800 border-red-300'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <Link to={`/users/${user.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
        <div className="bg-gradient-to-r from-cbmepi-orange to-cbmepi-red h-12" />
        <CardContent className="pt-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-cbmepi-orange text-white flex items-center justify-center text-xl font-bold border-2 border-cbmepi-red -mt-12">
              {user.profileImage ? (
                <img 
                  src={user.profileImage} 
                  alt={user.fullName} 
                  className="w-full h-full object-cover rounded-full" 
                />
              ) : (
                getInitials(user.fullName)
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-cbmepi-black">{user.fullName}</h3>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
          </div>
          
          <div className="mt-4 flex flex-wrap gap-2">
            <Badge className={cn(roleBadgeColor[user.role], 'capitalize')}>
              {user.role}
            </Badge>
            <Badge className={cn(statusBadgeColor[user.status], 'capitalize')}>
              {user.status}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default UserCard;
