
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Check, Trash2, Settings } from 'lucide-react';
import { mockNotifications, Notification } from '@/data/communicationTypes';
import { cn } from '@/lib/utils';

const NotificationsList: React.FC = () => {
  const navigate = useNavigate();
  
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

    if (!storedUserRole || !storedUserName) {
      navigate('/');
      return;
    }

    setUserRole(storedUserRole);
    setUserName(storedUserName);
  }, [navigate]);

  const userNotifications = notifications.filter(notification => notification.userId === 'current-user');
  const unreadNotifications = userNotifications.filter(notification => !notification.read);
  const readNotifications = userNotifications.filter(notification => notification.read);

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
        notification.userId === 'current-user' 
          ? { ...notification, read: true } 
          : notification
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch(type) {
      case 'assessment':
        return <div className="h-3 w-3 rounded-full bg-blue-500"></div>;
      case 'grade':
        return <div className="h-3 w-3 rounded-full bg-green-500"></div>;
      case 'message':
        return <div className="h-3 w-3 rounded-full bg-purple-500"></div>;
      case 'deadline':
        return <div className="h-3 w-3 rounded-full bg-red-500"></div>;
      case 'announcement':
        return <div className="h-3 w-3 rounded-full bg-orange-500"></div>;
      default:
        return <div className="h-3 w-3 rounded-full bg-gray-500"></div>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const NotificationCard = ({ notification }: { notification: Notification }) => (
    <Card className={cn(
      "border border-gray-200 shadow-sm mb-4",
      !notification.read && "bg-orange-50 border-orange-200"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="mt-1.5">{getNotificationIcon(notification.type)}</div>
            <div className="flex-1">
              <h4 className={cn(
                "text-sm mb-1",
                !notification.read && "font-medium"
              )}>
                {notification.title}
              </h4>
              <p className="text-sm text-gray-600 mb-2">{notification.content}</p>
              <p className="text-xs text-gray-400">{formatDate(notification.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {!notification.read && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => markAsRead(notification.id)}
              >
                <Check className="h-4 w-4" />
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-red-500 hover:text-red-700" 
              onClick={() => deleteNotification(notification.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header 
        title="Notificações" 
        userRole={userRole} 
        userName={userName} 
      />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Bell className="h-6 w-6 text-cbmepi-red mr-2" />
              <h1 className="text-2xl font-bold text-cbmepi-black">Notificações</h1>
              {unreadNotifications.length > 0 && (
                <Badge className="ml-3 bg-cbmepi-red">
                  {unreadNotifications.length} não lidas
                </Badge>
              )}
            </div>
            
            <div className="flex space-x-2">
              {unreadNotifications.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={markAllAsRead}
                  className="text-cbmepi-orange border-cbmepi-orange hover:bg-cbmepi-orange hover:text-white"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Marcar todas como lidas
                </Button>
              )}
              <Button 
                variant="outline"
                className="text-gray-600 border-gray-300"
              >
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
            </div>
          </div>

          <Tabs defaultValue="unread" className="space-y-6">
            <TabsList className="bg-white border border-gray-200">
              <TabsTrigger value="unread">
                Não lidas ({unreadNotifications.length})
              </TabsTrigger>
              <TabsTrigger value="read">
                Lidas ({readNotifications.length})
              </TabsTrigger>
              <TabsTrigger value="all">
                Todas ({userNotifications.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="unread">
              {unreadNotifications.length > 0 ? (
                <div>
                  {unreadNotifications.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))}
                </div>
              ) : (
                <Card className="border border-gray-200 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <Bell className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma notificação não lida</h3>
                    <p className="text-gray-500">Você está em dia com suas notificações!</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="read">
              {readNotifications.length > 0 ? (
                <div>
                  {readNotifications.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))}
                </div>
              ) : (
                <Card className="border border-gray-200 shadow-sm">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma notificação lida</h3>
                    <p className="text-gray-500">As notificações que você ler aparecerão aqui.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="all">
              <div>
                {userNotifications.map((notification) => (
                  <NotificationCard key={notification.id} notification={notification} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default NotificationsList;
