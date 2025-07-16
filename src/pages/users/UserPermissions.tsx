
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, ArrowLeft, UserCog } from 'lucide-react';
import Header from '@/components/Header';
import { getUserById, getPermissionsByRole, User, UserPermission } from '@/data/userTypes';
import { userService } from '@/services/api';

const UserPermissions: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<any | null>(null);
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const userRole = localStorage.getItem('userRole') as 'admin' | 'instructor' | 'student' || 'student';
  const userName = localStorage.getItem('userName') || '';
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      setLoading(true);
      userService.getById(id)
        .then((data) => {
          setUser(data);
          // TODO: Buscar permissões reais do Supabase quando disponível
          // Por enquanto, manter mock
          setPermissions([]);
        })
        .catch(() => {
          setUser(null);
        })
        .finally(() => setLoading(false));
    }
  }, [id]);
  
  // Only admin should be able to see this page
  if (userRole !== 'admin') {
    return (
      <div className="p-6">
        <Header title="Permissões de Usuário" userRole={userRole} userName={userName} />
        <div className="mt-8 text-center">
          <h2 className="text-xl font-bold text-red-600">Acesso Restrito</h2>
          <p className="mt-2">Você não tem permissão para acessar esta página.</p>
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
        <Header title="Permissões de Usuário" userRole={userRole} userName={userName} />
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
  
  const handlePermissionToggle = (id: string) => {
    setPermissions(prev =>
      prev.map(permission =>
        permission.id === id
          ? { ...permission, enabled: !permission.enabled }
          : permission
      )
    );
  };
  
  const handleSavePermissions = () => {
    // In a real app, this would be an API call
    console.log('Saving permissions:', permissions);
    
    toast.promise(
      new Promise<void>(resolve => {
        setTimeout(() => {
          resolve();
        }, 1000);
      }),
      {
        loading: 'Salvando permissões...',
        success: () => {
          return 'Permissões atualizadas com sucesso!';
        },
        error: 'Erro ao salvar permissões.',
      }
    );
  };
  
  const handleResetPermissions = () => {
    // Reset permissions to default based on user role
    const defaultPermissions = getPermissionsByRole(user.role);
    setPermissions(defaultPermissions);
    
    toast.success('Permissões redefinidas para os padrões do perfil.');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Header title="Permissões de Usuário" userRole={userRole} userName={userName} />
      
      <div className="max-w-4xl mx-auto mt-6">
        <Card className="border-t-4 border-t-cbmepi-orange shadow-md">
          <CardHeader className="bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold text-cbmepi-black">
                  Gerenciar Permissões
                </CardTitle>
                <CardDescription>
                  Defina as permissões de acesso para {user.fullName}
                </CardDescription>
              </div>
              <UserCog size={24} className="text-cbmepi-orange" />
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Shield className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    <span className="font-bold">Perfil do Usuário:</span> <span className="capitalize">{user.role}</span>
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    As permissões padrão são definidas com base no perfil do usuário. Você pode personalizá-las abaixo.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              {permissions.map((permission) => (
                <div 
                  key={permission.id} 
                  className="flex items-center justify-between bg-white p-4 rounded-lg border hover:shadow-sm transition-shadow"
                >
                  <div>
                    <Label 
                      htmlFor={`permission-${permission.id}`}
                      className="font-medium cursor-pointer"
                    >
                      {permission.name}
                    </Label>
                    <p className="text-sm text-gray-500 mt-1">
                      {permission.description}
                    </p>
                  </div>
                  <Switch
                    id={`permission-${permission.id}`}
                    checked={permission.enabled}
                    onCheckedChange={() => handlePermissionToggle(permission.id)}
                  />
                </div>
              ))}
              
              {permissions.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Nenhuma permissão disponível para este usuário.</p>
                </div>
              )}
            </div>
          </CardContent>
          
          <CardFooter className="border-t bg-gray-50 py-4 flex flex-col md:flex-row justify-between gap-4">
            <Button
              variant="outline"
              onClick={() => navigate(`/users/${id}`)}
            >
              <ArrowLeft size={16} className="mr-2" />
              Voltar para Perfil
            </Button>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleResetPermissions}
              >
                Redefinir Padrões
              </Button>
              
              <Button 
                className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
                onClick={handleSavePermissions}
              >
                Salvar Permissões
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default UserPermissions;
