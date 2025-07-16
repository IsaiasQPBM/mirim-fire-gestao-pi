
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
// import { Notification, mockNotifications } from '@/data/communicationTypes';
import { cn } from '@/lib/utils';

interface NotificationsPanelProps {
  userId: string;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ userId }) => {
  const [notifications, setNotifications] = useState<any[]>([]); // TODO: Integrar com Supabase
  const [isOpen, setIsOpen] = useState(false);

  const userNotifications = notifications.filter(notification => notification.userId === userId);
  const unreadCount = userNotifications.filter(notification => !notification.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.userId === userId 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const getNotificationIcon = (type: any) => {
    switch(type) {
      case 'assessment':
        return <div className="h-2 w-2 rounded-full bg-blue-500"></div>;
      case 'grade':
        return <div className="h-2 w-2 rounded-full bg-green-500"></div>;
      case 'message':
        return <div className="h-2 w-2 rounded-full bg-purple-500"></div>;
      case 'deadline':
        return <div className="h-2 w-2 rounded-full bg-red-500"></div>;
      case 'announcement':
        return <div className="h-2 w-2 rounded-full bg-orange-500"></div>;
      default:
        return <div className="h-2 w-2 rounded-full bg-gray-500"></div>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-cbmepi-red text-white text-xs flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-medium">Notificações</h3>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-8"
              onClick={markAllAsRead}
            >
              Marcar todas como lidas
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[350px]">
          {userNotifications.length > 0 ? (
            <div className="divide-y">
              {userNotifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={cn(
                    "p-4 flex items-start space-x-3",
                    !notification.read && "bg-orange-50"
                  )}
                >
                  <div className="mt-1.5">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1">
                    {notification.link ? (
                      <Link 
                        to={notification.link} 
                        onClick={() => {
                          markAsRead(notification.id);
                          setIsOpen(false);
                        }}
                      >
                        <h4 className={cn(
                          "text-sm mb-1",
                          !notification.read && "font-medium"
                        )}>
                          {notification.title}
                        </h4>
                      </Link>
                    ) : (
                      <h4 className={cn(
                        "text-sm mb-1",
                        !notification.read && "font-medium"
                      )}>
                        {notification.title}
                      </h4>
                    )}
                    <p className="text-xs text-gray-500">{notification.content}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(notification.createdAt)}</p>
                  </div>
                  {!notification.read && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6" 
                      onClick={() => markAsRead(notification.id)}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-gray-500">Nenhuma notificação no momento.</p>
            </div>
          )}
        </ScrollArea>
        <div className="p-2 border-t">
          <Link to="/notifications" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" size="sm" className="w-full">
              Ver todas as notificações
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsPanel;
