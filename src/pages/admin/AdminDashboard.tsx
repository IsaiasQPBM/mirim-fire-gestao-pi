
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Database, Users, BookOpen, Layout, Settings, Shield } from 'lucide-react';
import RealtimeUpdates from '@/components/RealtimeUpdates';

const AdminDashboard: React.FC = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  // Verificar se o usuário é administrador
  React.useEffect(() => {
    if (profile && profile.role !== 'admin') {
      navigate('/dashboard');
    }
  }, [profile, navigate]);

  if (!profile || profile.role !== 'admin') {
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Administração do Sistema</h1>
          <p className="text-gray-600">Gerenciar configurações e operações do sistema</p>
        </div>
        <RealtimeUpdates />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="bg-blue-50">
            <CardTitle className="flex items-center">
              <Database className="mr-2 h-5 w-5 text-blue-600" />
              Migração de Dados
            </CardTitle>
            <CardDescription>
              Importar e exportar dados para o Supabase
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-600 mb-4">
              Ferramentas para migração, backup e restauração de dados do sistema. 
              Gerencie a transferência de dados para o Supabase.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/admin/migration')}
            >
              Acessar Migração
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="bg-green-50">
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-green-600" />
              Gestão de Usuários
            </CardTitle>
            <CardDescription>
              Gerenciar usuários e permissões
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-600 mb-4">
              Criar, editar e gerenciar usuários do sistema. Configurar perfis, permissões e acessos.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/users')}
            >
              Acessar Usuários
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="bg-yellow-50">
            <CardTitle className="flex items-center">
              <BookOpen className="mr-2 h-5 w-5 text-yellow-600" />
              Conteúdo Acadêmico
            </CardTitle>
            <CardDescription>
              Gerenciar cursos e disciplinas
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-600 mb-4">
              Configurar a estrutura acadêmica do sistema. Gerenciar cursos, disciplinas e conteúdos.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/courses')}
            >
              Acessar Cursos
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="bg-purple-50">
            <CardTitle className="flex items-center">
              <Layout className="mr-2 h-5 w-5 text-purple-600" />
              Turmas e Classes
            </CardTitle>
            <CardDescription>
              Gerenciar turmas e alunos
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-600 mb-4">
              Criar e gerenciar turmas, matrículas de alunos e designação de instrutores.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/classes')}
            >
              Acessar Turmas
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="bg-red-50">
            <CardTitle className="flex items-center">
              <Shield className="mr-2 h-5 w-5 text-red-600" />
              Segurança
            </CardTitle>
            <CardDescription>
              Configurações de segurança e auditoria
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-600 mb-4">
              Gerenciar políticas de segurança, logs de auditoria e permissões do sistema.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/admin/security')}
            >
              Acessar Segurança
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="bg-gray-50">
            <CardTitle className="flex items-center">
              <Settings className="mr-2 h-5 w-5 text-gray-600" />
              Configurações do Sistema
            </CardTitle>
            <CardDescription>
              Configurações gerais do sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-600 mb-4">
              Gerenciar configurações gerais, parâmetros do sistema e otimizações.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full" 
              onClick={() => navigate('/admin/settings')}
            >
              Acessar Configurações
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
