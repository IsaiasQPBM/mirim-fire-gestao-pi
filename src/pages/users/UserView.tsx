
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Shield, Mail, Phone, Calendar, User } from 'lucide-react';
import Header from '@/components/Header';
import { User as UserType, getUserById } from '@/data/userTypes';

const UserView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const userRole = localStorage.getItem('userRole') as 'admin' | 'instructor' | 'student' || 'student';
  const userName = localStorage.getItem('userName') || '';

  useEffect(() => {
    if (id) {
      const foundUser = getUserById(id);
      setUser(foundUser || null);
      setLoading(false);
    }
  }, [id]);

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
        <Header title="Detalhes do Usuário" userRole={userRole} userName={userName} />
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <Header title="Detalhes do Usuário" userRole={userRole} userName={userName} />
      
      <div className="max-w-4xl mx-auto mt-6">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="outline"
            onClick={() => navigate('/users')}
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Voltar para Lista
          </Button>
          
          {userRole === 'admin' && (
            <div className="flex gap-2">
              <Button
                onClick={() => navigate(`/users/${id}/edit`)}
                className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
              >
                <Edit size={16} className="mr-2" />
                Editar
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/users/${id}/permissions`)}
              >
                <Shield size={16} className="mr-2" />
                Permissões
              </Button>
            </div>
          )}
        </div>

        <Card className="border-t-4 border-t-cbmepi-orange shadow-md">
          <div className="bg-gradient-to-r from-cbmepi-orange to-cbmepi-red h-24" />
          <CardContent className="pt-0">
            <div className="flex items-start gap-6 -mt-12">
              <div className="w-24 h-24 rounded-full bg-cbmepi-orange text-white flex items-center justify-center text-2xl font-bold border-4 border-white shadow-lg">
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
              
              <div className="flex-1 mt-8">
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-2xl font-bold text-cbmepi-black">{user.fullName}</h1>
                  <div className="flex gap-2">
                    <Badge className={roleBadgeColor[user.role]}>
                      {user.role === 'admin' ? 'Administrador' : 
                       user.role === 'instructor' ? 'Instrutor' : 'Aluno'}
                    </Badge>
                    <Badge className={statusBadgeColor[user.status]}>
                      {user.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User size={20} className="text-cbmepi-orange" />
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Telefone</p>
                  <p className="font-medium">{user.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar size={16} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Data de Nascimento</p>
                  <p className="font-medium">
                    {new Date(user.birthDate).toLocaleDateString('pt-BR')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield size={20} className="text-cbmepi-orange" />
                Informações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Data de Cadastro</p>
                <p className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>
              
              {user.lastLogin && (
                <div>
                  <p className="text-sm text-gray-500">Último Acesso</p>
                  <p className="font-medium">
                    {new Date(user.lastLogin).toLocaleString('pt-BR')}
                  </p>
                </div>
              )}
              
              <div>
                <p className="text-sm text-gray-500">ID do Usuário</p>
                <p className="font-medium font-mono text-xs bg-gray-100 p-2 rounded">
                  {user.id}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserView;
