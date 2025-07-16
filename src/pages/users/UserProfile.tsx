
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Users, 
  Mail, 
  Phone, 
  Calendar, 
  Clock, 
  Shield, 
  Edit,
  Key,
  Eye
} from 'lucide-react';
import Header from '@/components/Header';
import { userService } from '@/services/api';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any | null>(null);
  const userRole = localStorage.getItem('userRole') as 'admin' | 'instructor' | 'student' || 'student';
  const userName = localStorage.getItem('userName') || '';
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      setLoading(true);
      userService.getById(id)
        .then((data) => {
          setUser(data);
        })
        .catch(() => {
          setUser(null);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);
  
  // Access control
  const canAccessUserProfile = () => {
    // Admins can see all profiles
    if (userRole === 'admin') return true;
    
    // Instructors can only see student profiles
    if (userRole === 'instructor' && user?.role === 'student') return true;
    
    // Students can only see their own profile
    if (userRole === 'student' && userName === user?.full_name) return true;
    
    return false;
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cbmepi-orange"></div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="p-6">
        <Header title="Perfil do Usuário" userRole={userRole} userName={userName} />
        <div className="mt-8 text-center">
          <h2 className="text-xl font-bold text-red-600">Usuário não encontrado</h2>
          <p className="mt-2">O usuário que você está procurando não existe.</p>
          <Button 
            className="mt-4 bg-cbmepi-orange hover:bg-cbmepi-orange/90"
            onClick={() => navigate('/users')}
          >
            Voltar para Lista de Usuários
          </Button>
        </div>
      </div>
    );
  }
  
  if (!canAccessUserProfile()) {
    return (
      <div className="p-6">
        <Header title="Perfil do Usuário" userRole={userRole} userName={userName} />
        <div className="mt-8 text-center">
          <h2 className="text-xl font-bold text-red-600">Acesso Restrito</h2>
          <p className="mt-2">Você não tem permissão para visualizar este perfil.</p>
          <Button 
            className="mt-4 bg-cbmepi-orange hover:bg-cbmepi-orange/90"
            onClick={() => navigate('/dashboard')}
          >
            Voltar para Dashboard
          </Button>
        </div>
      </div>
    );
  }
  
  const roleBadgeColor = {
    admin: 'bg-purple-100 text-purple-800 border-purple-300',
    instructor: 'bg-blue-100 text-blue-800 border-blue-300',
    student: 'bg-green-100 text-green-800 border-green-300'
  };

  const statusBadgeColor = {
    active: 'bg-green-100 text-green-800 border-green-300',
    inactive: 'bg-red-100 text-red-800 border-red-300'
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy');
    } catch (e) {
      return 'Data inválida';
    }
  };
  
  const formatDateTime = (dateTimeString?: string) => {
    if (!dateTimeString) return 'Nunca';
    try {
      return format(new Date(dateTimeString), 'dd/MM/yyyy HH:mm');
    } catch (e) {
      return 'Data inválida';
    }
  };
  
  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const renderUserActivity = () => {
    // Mock activities
    const activities = [
      { date: '2023-06-15T10:30:00', action: 'Login no sistema' },
      { date: '2023-06-14T15:45:00', action: 'Alteração de dados pessoais' },
      { date: '2023-06-10T09:15:00', action: 'Visualizou notas' },
      { date: '2023-06-05T14:20:00', action: 'Logout do sistema' },
      { date: '2023-06-02T11:10:00', action: 'Login no sistema' },
    ];

    return (
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-0">
            <div className="w-2 h-2 mt-2 rounded-full bg-cbmepi-orange"></div>
            <div>
              <p className="font-medium text-sm">{activity.action}</p>
              <p className="text-xs text-gray-500">{formatDateTime(activity.date)}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Header title="Perfil do Usuário" userRole={userRole} userName={userName} />
      
      <div className="max-w-5xl mx-auto mt-6">
        <Card className="overflow-hidden border-t-4 border-t-cbmepi-orange shadow-md">
          <div className="bg-gradient-to-r from-cbmepi-orange to-cbmepi-red h-32 relative">
            {userRole === 'admin' && (
              <div className="absolute top-4 right-4 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white hover:bg-gray-100"
                  onClick={() => navigate(`/users/${id}/edit`)}
                >
                  <Edit size={16} className="mr-1" />
                  Editar
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white hover:bg-gray-100"
                  onClick={() => navigate(`/users/${id}/permissions`)}
                >
                  <Key size={16} className="mr-1" />
                  Permissões
                </Button>
              </div>
            )}
            
            <div className="absolute -bottom-16 left-6 w-32 h-32 rounded-full bg-cbmepi-orange text-white flex items-center justify-center text-4xl font-bold border-4 border-white">
              {getInitials(user.full_name)}
            </div>
          </div>
          
          <CardContent className="pt-20 pb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-cbmepi-black">{user.full_name}</h2>
                <div className="flex items-center gap-1 text-gray-600 mt-1">
                  <Mail size={16} />
                  <span className="text-sm">{user.email}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge className={cn(roleBadgeColor[user.role], 'capitalize')}>
                  <Shield size={14} className="mr-1" />
                  {user.role}
                </Badge>
                <Badge className={cn(statusBadgeColor[user.status], 'capitalize')}>
                  {user.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
            
            <Tabs defaultValue="info" className="mt-8">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="info">
                  <User size={16} className="mr-2" />
                  Informações
                </TabsTrigger>
                <TabsTrigger value="permissions">
                  <Shield size={16} className="mr-2" />
                  Permissões
                </TabsTrigger>
                <TabsTrigger value="activity">
                  <Clock size={16} className="mr-2" />
                  Atividade
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="info" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <User size={18} className="mr-2 text-cbmepi-orange" />
                        Dados Pessoais
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Nome Completo</p>
                        <p>{user.full_name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Data de Nascimento</p>
                        <p>{formatDate(user.birth_date || '')}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Tipo de Perfil</p>
                        <p className="capitalize">{user.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <Phone size={18} className="mr-2 text-cbmepi-orange" />
                        Contato
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p>{user.email || 'Não informado'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Telefone</p>
                        <p>{user.phone || 'Não informado'}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <Calendar size={18} className="mr-2 text-cbmepi-orange" />
                        Datas
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Data de Cadastro</p>
                          <p>{formatDate(user.created_at)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Último Acesso</p>
                          <p>Não registrado</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="permissions">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Permissões do Usuário</CardTitle>
                    <CardDescription>
                      Permissões atribuídas com base no perfil: <span className="font-medium capitalize">{user.role}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {user.role === 'admin' && (
                        <>
                          <div className="flex items-center p-2 border rounded-md bg-green-50">
                            <Shield size={16} className="text-green-600 mr-2" />
                            <span>Gerenciar Usuários</span>
                          </div>
                          <div className="flex items-center p-2 border rounded-md bg-green-50">
                            <Shield size={16} className="text-green-600 mr-2" />
                            <span>Gerenciar Disciplinas</span>
                          </div>
                          <div className="flex items-center p-2 border rounded-md bg-green-50">
                            <Shield size={16} className="text-green-600 mr-2" />
                            <span>Gerenciar Calendário</span>
                          </div>
                          <div className="flex items-center p-2 border rounded-md bg-green-50">
                            <Shield size={16} className="text-green-600 mr-2" />
                            <span>Acesso Total ao Sistema</span>
                          </div>
                        </>
                      )}
                      
                      {user.role === 'instructor' && (
                        <>
                          <div className="flex items-center p-2 border rounded-md bg-green-50">
                            <Shield size={16} className="text-green-600 mr-2" />
                            <span>Visualizar Alunos</span>
                          </div>
                          <div className="flex items-center p-2 border rounded-md bg-green-50">
                            <Shield size={16} className="text-green-600 mr-2" />
                            <span>Gerenciar Notas</span>
                          </div>
                          <div className="flex items-center p-2 border rounded-md bg-green-50">
                            <Shield size={16} className="text-green-600 mr-2" />
                            <span>Gerenciar Frequência</span>
                          </div>
                          <div className="flex items-center p-2 border rounded-md bg-gray-100">
                            <Shield size={16} className="text-gray-400 mr-2" />
                            <span className="text-gray-500">Eventos de Calendário</span>
                          </div>
                        </>
                      )}
                      
                      {user.role === 'student' && (
                        <>
                          <div className="flex items-center p-2 border rounded-md bg-green-50">
                            <Shield size={16} className="text-green-600 mr-2" />
                            <span>Visualizar Notas</span>
                          </div>
                          <div className="flex items-center p-2 border rounded-md bg-green-50">
                            <Shield size={16} className="text-green-600 mr-2" />
                            <span>Visualizar Calendário</span>
                          </div>
                          <div className="flex items-center p-2 border rounded-md bg-green-50">
                            <Shield size={16} className="text-green-600 mr-2" />
                            <span>Meu Perfil</span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    {userRole === 'admin' && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto"
                        onClick={() => navigate(`/users/${id}/permissions`)}
                      >
                        <Key size={16} className="mr-1" />
                        Gerenciar Permissões
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              </TabsContent>
              
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Histórico de Atividades</CardTitle>
                    <CardDescription>
                      Registro das últimas ações do usuário no sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {renderUserActivity()}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="border-t bg-gray-50 py-4">
            <div className="flex justify-between items-center w-full">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate('/users')}
              >
                <Users size={16} className="mr-1" />
                Voltar para Lista
              </Button>
              
              {userRole === 'admin' && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/users/${id}/edit`)}
                  >
                    <Edit size={16} className="mr-1" />
                    Editar Usuário
                  </Button>
                </div>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
