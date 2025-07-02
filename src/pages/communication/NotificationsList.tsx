
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  Search, 
  Filter, 
  MoreVertical, 
  Check, 
  Trash2, 
  AlertCircle,
  Info,
  MessageSquare,
  Calendar,
  Star
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'announcement' | 'reminder';
  priority: 'low' | 'medium' | 'high';
  isRead: boolean;
  isStarred: boolean;
  createdAt: string;
  sender: string;
  actionRequired: boolean;
}

const NotificationsList: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred'>('all');

  // Mock notifications data
  const mockNotifications: Notification[] = [
    {
      id: '1',
      title: 'Nova Avaliação Disponível',
      message: 'A avaliação de Primeiros Socorros está disponível para realização até 15/01/2025.',
      type: 'info',
      priority: 'high',
      isRead: false,
      isStarred: true,
      createdAt: '2025-01-02T14:30:00Z',
      sender: 'Sistema Acadêmico',
      actionRequired: true
    },
    {
      id: '2',
      title: 'Comunicado: Mudança de Horário',
      message: 'A aula de Prevenção de Incêndio foi reagendada para 08/01/2025 às 14:00.',
      type: 'announcement',
      priority: 'medium',
      isRead: false,
      isStarred: false,
      createdAt: '2025-01-02T10:15:00Z',
      sender: 'João Silva - Instrutor',
      actionRequired: false
    },
    {
      id: '3',
      title: 'Lembrete: Entrega de Documentos',
      message: 'Não esqueça de entregar os documentos pendentes até 10/01/2025.',
      type: 'reminder',
      priority: 'medium',
      isRead: true,
      isStarred: false,
      createdAt: '2025-01-01T16:45:00Z',
      sender: 'Secretaria',
      actionRequired: true
    },
    {
      id: '4',
      title: 'Parabéns! Avaliação Aprovada',
      message: 'Você foi aprovado na avaliação de Bombeiro Civil com nota 8.5.',
      type: 'success',
      priority: 'low',
      isRead: true,
      isStarred: true,
      createdAt: '2025-01-01T12:00:00Z',
      sender: 'Sistema de Avaliações',
      actionRequired: false
    },
    {
      id: '5',
      title: 'Atenção: Prazo de Matrícula',
      message: 'O prazo para matrícula em novas turmas termina em 3 dias.',
      type: 'warning',
      priority: 'high',
      isRead: false,
      isStarred: false,
      createdAt: '2024-12-31T09:20:00Z',
      sender: 'Coordenação',
      actionRequired: true
    }
  ];

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

    if (!storedUserRole || !storedUserName) {
      navigate('/login');
      return;
    }

    setUserRole(storedUserRole);
    setUserName(storedUserName);
    setNotifications(mockNotifications);
  }, [navigate]);

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (filter) {
      case 'unread':
        return matchesSearch && !notification.isRead;
      case 'starred':
        return matchesSearch && notification.isStarred;
      default:
        return matchesSearch;
    }
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const starredCount = notifications.filter(n => n.isStarred).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'success':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'announcement':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'reminder':
        return <Calendar className="h-5 w-5 text-purple-500" />;
      default:
        return <Info className="h-5 w-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
    
    toast({
      title: "Notificação marcada como lida",
      description: "A notificação foi marcada como lida.",
    });
  };

  const handleToggleStar = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isStarred: !notification.isStarred }
          : notification
      )
    );
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    
    toast({
      title: "Notificação excluída",
      description: "A notificação foi excluída com sucesso.",
    });
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
    
    toast({
      title: "Todas as notificações marcadas como lidas",
      description: "Todas as notificações foram marcadas como lidas.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header 
        title="Notificações" 
        userRole={userRole} 
        userName={userName} 
      />
      
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Notificações</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-cbmepi-orange" />
              <h1 className="text-2xl font-bold text-cbmepi-black">Notificações</h1>
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount}
                </Badge>
              )}
            </div>
            
            {unreadCount > 0 && (
              <Button 
                onClick={handleMarkAllAsRead}
                variant="outline"
                size="sm"
              >
                <Check className="mr-2 h-4 w-4" />
                Marcar todas como lidas
              </Button>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Pesquisar notificações..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilter('all')}>
                  Todas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('unread')}>
                  Não lidas ({unreadCount})
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('starred')}>
                  Com estrela ({starredCount})
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Tabs value={filter} onValueChange={(value) => setFilter(value as 'all' | 'unread' | 'starred')}>
            <TabsList className="mb-6">
              <TabsTrigger value="all">
                Todas ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread">
                Não lidas ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="starred">
                Com estrela ({starredCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={filter} className="space-y-4">
              {filteredNotifications.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Nenhuma notificação encontrada
                    </h3>
                    <p className="text-gray-500">
                      {searchTerm ? 'Tente ajustar sua pesquisa' : 'Você não tem notificações no momento.'}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredNotifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`transition-all hover:shadow-md ${
                      !notification.isRead ? 'border-l-4 border-l-cbmepi-orange bg-orange-50/30' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className={`font-medium ${!notification.isRead ? 'font-bold' : ''}`}>
                                {notification.title}
                              </h3>
                              
                              {!notification.isRead && (
                                <Badge variant="secondary" className="text-xs">
                                  Nova
                                </Badge>
                              )}
                              
                              <Badge className={getPriorityColor(notification.priority)}>
                                {notification.priority === 'high' ? 'Alta' : 
                                 notification.priority === 'medium' ? 'Média' : 'Baixa'}
                              </Badge>
                              
                              {notification.actionRequired && (
                                <Badge variant="destructive" className="text-xs">
                                  Ação Necessária
                                </Badge>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleToggleStar(notification.id)}
                                className="p-1 h-8 w-8"
                              >
                                <Star 
                                  className={`h-4 w-4 ${
                                    notification.isStarred 
                                      ? 'fill-yellow-400 text-yellow-400' 
                                      : 'text-gray-400'
                                  }`} 
                                />
                              </Button>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="p-1 h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {!notification.isRead && (
                                    <DropdownMenuItem onClick={() => handleMarkAsRead(notification.id)}>
                                      <Check className="mr-2 h-4 w-4" />
                                      Marcar como lida
                                    </DropdownMenuItem>
                                  )}
                                  <DropdownMenuItem 
                                    onClick={() => handleDelete(notification.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Excluir
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                          
                          <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                            {notification.message}
                          </p>
                          
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>{notification.sender}</span>
                            <span>
                              {format(new Date(notification.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default NotificationsList;
