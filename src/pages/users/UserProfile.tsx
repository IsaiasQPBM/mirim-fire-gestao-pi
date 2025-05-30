
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const UserProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const [profileLoading, setProfileLoading] = useState(true);
  
  useEffect(() => {
    // Simular carregamento do perfil
    const timer = setTimeout(() => {
      setProfileLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);
  
  // Se ainda está carregando a autenticação
  if (loading || profileLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cbmepi-orange"></div>
      </div>
    );
  }
  
  // Se não há usuário autenticado
  if (!user || !profile) {
    return (
      <div className="p-6">
        <Header title="Meu Perfil" userRole="student" userName="" />
        <div className="mt-8 text-center">
          <h2 className="text-xl font-bold text-red-600">Acesso Restrito</h2>
          <p className="mt-2">Você precisa estar logado para ver seu perfil.</p>
          <Button 
            className="mt-4 bg-cbmepi-orange hover:bg-cbmepi-orange/90"
            onClick={() => navigate('/login')}
          >
            Fazer Login
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Não informado';
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
  
  const getInitials = (name: string) => {
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
      { date: new Date().toISOString(), action: 'Login no sistema' },
      { date: new Date(Date.now() - 86400000).toISOString(), action: 'Visualizou dashboard' },
      { date: new Date(Date.now() - 172800000).toISOString(), action: 'Atualizou perfil' },
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
      <Header title="Meu Perfil" userRole={profile.role} userName={profile.full_name} />
      
      <div className="max-w-5xl mx-auto mt-6">
        <Card className="overflow-hidden border-t-4 border-t-cbmepi-orange shadow-md">
          <div className="bg-gradient-to-r from-cbmepi-orange to-cbmepi-red h-32 relative">
            <div className="absolute top-4 right-4 flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white hover:bg-gray-100"
                onClick={() => navigate('/dashboard')}
              >
                <Eye size={16} className="mr-1" />
                Dashboard
              </Button>
            </div>
            
            <div className="absolute -bottom-16 left-6 w-32 h-32 rounded-full bg-cbmepi-orange text-white flex items-center justify-center text-4xl font-bold border-4 border-white">
              {getInitials(profile.full_name)}
            </div>
          </div>
          
          <CardContent className="pt-20 pb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-cbmepi-black">{profile.full_name}</h2>
                <div className="flex items-center gap-1 text-gray-600 mt-1">
                  <Mail size={16} />
                  <span className="text-sm">{profile.email}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge className={cn(roleBadgeColor[profile.role], 'capitalize')}>
                  <Shield size={14} className="mr-1" />
                  {profile.role === 'admin' ? 'Administrador' : 
                   profile.role === 'instructor' ? 'Instrutor' : 'Estudante'}
                </Badge>
                <Badge className={cn(statusBadgeColor[profile.status], 'capitalize')}>
                  {profile.status === 'active' ? 'Ativo' : 'Inativo'}
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
                        <p>{profile.full_name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Tipo de Perfil</p>
                        <p className="capitalize">
                          {profile.role === 'admin' ? 'Administrador' : 
                           profile.role === 'instructor' ? 'Instrutor' : 'Estudante'}
                        </p>
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
                        <p>{profile.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">ID do Usuário</p>
                        <p className="text-xs text-gray-400 font-mono">{user.id}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="permissions">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Suas Permissões</CardTitle>
                    <CardDescription>
                      Permissões atribuídas com base no seu perfil: <span className="font-medium capitalize">
                        {profile.role === 'admin' ? 'Administrador' : 
                         profile.role === 'instructor' ? 'Instrutor' : 'Estudante'}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {profile.role === 'admin' && (
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
                      
                      {profile.role === 'instructor' && (
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
                        </>
                      )}
                      
                      {profile.role === 'student' && (
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
                </Card>
              </TabsContent>
              
              <TabsContent value="activity">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Histórico de Atividades</CardTitle>
                    <CardDescription>
                      Registro das suas últimas ações no sistema
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
                onClick={() => navigate('/dashboard')}
              >
                <Users size={16} className="mr-1" />
                Voltar para Dashboard
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;
