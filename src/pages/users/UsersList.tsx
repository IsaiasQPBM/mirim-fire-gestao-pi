
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, User, Shield, UserCheck, UserX, Edit, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Header from '@/components/Header';
import { useUsers, useUpdateUser } from '@/hooks/useData';
import { useToast } from '@/hooks/use-toast';
import { TableRow as TableRowType, TableUpdate } from '@/lib/supabase';
import clsx from 'clsx';
import { userService } from '@/services/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import UserEditForm from '@/components/users/UserEditForm';
import { v4 as uuidv4 } from 'uuid';

// Exemplo de dados mockados para visualização (remover ao integrar com backend)
const users = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@cbmepi.pi.gov.br',
    status: 'Ativo',
    role: 'Administrador',
    avatar: '',
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@cbmepi.pi.gov.br',
    status: 'Inativo',
    role: 'Instrutor',
    avatar: '',
  },
  {
    id: '3',
    name: 'Carlos Souza',
    email: 'carlos@cbmepi.pi.gov.br',
    status: 'Ativo',
    role: 'Aluno',
    avatar: '',
  },
];

const statusBadge = (status: string) => (
  <Badge className={clsx('px-2 py-1 text-xs font-semibold', {
    'bg-green-100 text-green-800': status === 'Ativo',
    'bg-red-100 text-red-800': status === 'Inativo',
  })}>
    {status === 'Ativo' ? <UserCheck className="inline mr-1 h-3 w-3" /> : <UserX className="inline mr-1 h-3 w-3" />}
    {status}
  </Badge>
);

const roleBadge = (role: string) => (
  <Badge className={clsx('px-2 py-1 text-xs font-semibold', {
    'bg-blue-100 text-blue-800': role === 'Administrador',
    'bg-orange-100 text-orange-800': role === 'Instrutor',
    'bg-gray-100 text-gray-800': role === 'Aluno',
  })}>
    {role === 'Administrador' ? <Shield className="inline mr-1 h-3 w-3" /> :
     role === 'Instrutor' ? <User className="inline mr-1 h-3 w-3" /> :
     <User className="inline mr-1 h-3 w-3" />}
    {role}
  </Badge>
);

export default function UsersList() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const updateUserMutation = useUpdateUser();
  const { toast } = useToast();
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        const data = await userService.getAll();
        setUsers(data || []);
      } catch (e) {
        setError('Erro ao carregar usuários');
        setUsers([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // Filtros simples (ajustar para integração real)
  const filteredUsers = users.filter(u =>
    (u.full_name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())) &&
    (filterRole ? u.role === filterRole : true) &&
    (filterStatus ? u.status === filterStatus : true)
  );

  const handleStatusChange = async (userId: string, newStatus: string) => {
    try {
      await updateUserMutation.mutateAsync({
        id: userId,
        updates: { status: newStatus }
      });
      
      toast({
        title: "Status atualizado",
        description: "O status do usuário foi atualizado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar o status do usuário.",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Ativo' ? 'Inativo' : 'Ativo';
    try {
      await userService.update(userId, { status: newStatus });
      toast({
        title: 'Usuário atualizado',
        description: `Status alterado para ${newStatus}.`,
      });
      // Atualizar lista
      const data = await userService.getAll();
      setUsers(data || []);
    } catch (e) {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o status do usuário.',
        variant: 'destructive',
      });
    }
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      admin: { label: 'Administrador', variant: 'default' as const },
      instructor: { label: 'Instrutor', variant: 'default' as const },
      student: { label: 'Aluno', variant: 'pending' as const },
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || { label: role, variant: 'outline' as const };
    
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Ativo', variant: 'active' as const },
      inactive: { label: 'Inativo', variant: 'inactive' as const },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'outline' as const };
    
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Carregando usuários...</div>;
  }
  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  if (users.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header title="Usuários" userRole="admin" userName="Admin" />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-red-600 mb-2">Nenhum usuário encontrado</h3>
              <p className="text-gray-600">Não há usuários cadastrados no momento.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen w-full p-0 md:p-6">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-cbmepi-black mb-1 tracking-tight">Gerenciamento de Usuários</h1>
          <p className="text-gray-500 text-base">Administre os usuários do sistema institucional com facilidade e segurança.</p>
        </div>
        <Button
          className="bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-full shadow-md px-6 py-2 flex items-center gap-2"
          onClick={() => { setEditingUser(null); setShowUserModal(true); }}
          aria-label="Novo Usuário"
        >
          <Plus className="h-5 w-5" /> Novo Usuário
        </Button>
      </div>

      {/* Barra de busca e filtros */}
      <div className="flex flex-col md:flex-row gap-3 mb-8">
        <div className="flex flex-1 items-center bg-gray-50 rounded-full shadow-sm px-4 py-2 gap-2 border border-gray-200">
          <Search className="h-5 w-5 text-gray-400" />
          <Input
            className="border-0 bg-transparent focus:ring-0 text-base flex-1"
            placeholder="Buscar usuário..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Filter className="h-5 w-5 text-gray-400 cursor-pointer" aria-label="Filtrar" />
        </div>
        <select
          className="rounded-full border border-gray-200 px-4 py-2 text-base bg-white shadow-sm focus:outline-none"
          value={filterRole}
          onChange={e => setFilterRole(e.target.value)}
        >
          <option value="">Todas as Funções</option>
          <option value="Administrador">Administrador</option>
          <option value="Instrutor">Instrutor</option>
          <option value="Aluno">Aluno</option>
        </select>
        <select
          className="rounded-full border border-gray-200 px-4 py-2 text-base bg-white shadow-sm focus:outline-none"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
        >
          <option value="">Todos os Status</option>
          <option value="Ativo">Ativo</option>
          <option value="Inativo">Inativo</option>
        </select>
      </div>

      {/* Lista de usuários em cartões/linhas suaves */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(user => (
          <Card
            key={user.id}
            className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-200"
            onClick={() => { setEditingUser(user); setShowUserModal(true); }}
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar className="h-12 w-12">
                {user.avatar || user.profile_image ? (
                  <AvatarImage src={user.avatar || user.profile_image} />
                ) : (
                  <AvatarFallback>
                    {user.full_name ? user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) : 'U'}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  {user.full_name}
                  {statusBadge(user.status)}
                  {roleBadge(user.role)}
                </CardTitle>
                <p className="text-gray-500 text-sm font-medium">{user.email || 'Sem email'}</p>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="shadow-lg rounded-xl border border-gray-100 animate-fade-in">
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-blue-600 hover:bg-blue-50"
                    onClick={() => navigate(`/users/${user.id}/profile`)}
                  >
                    <Eye className="h-4 w-4" /> Ver Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-indigo-600 hover:bg-indigo-50"
                    onClick={() => navigate(`/users/${user.id}/edit`)}
                  >
                    <Edit className="h-4 w-4" /> Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="flex items-center gap-2 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      if (user.status === 'Ativo' && !window.confirm('Tem certeza que deseja desativar este usuário?')) return;
                      handleToggleStatus(user.id, user.status);
                    }}
                  >
                    <UserX className="h-4 w-4" /> {user.status === 'Ativo' ? 'Desativar' : 'Ativar'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              {/* Espaço para informações extras, se necessário */}
            </CardContent>
          </Card>
        ))}
      </div>
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent className="max-w-lg w-full">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
          </DialogHeader>
          <UserEditForm
            initialValues={editingUser ? {
              fullName: editingUser.full_name,
              birthDate: editingUser.birth_date,
              role: editingUser.role,
              email: editingUser.email,
              phone: editingUser.phone,
              status: editingUser.status,
            } : undefined}
            onSubmit={async (data) => {
              if (editingUser) {
                await userService.update(editingUser.id, {
                  full_name: data.fullName,
                  birth_date: data.birthDate,
                  role: data.role,
                  email: data.email,
                  phone: data.phone,
                  status: data.status,
                });
                toast({ title: 'Usuário atualizado com sucesso!' });
              } else {
                await userService.create({
                  id: uuidv4(),
                  full_name: data.fullName,
                  birth_date: data.birthDate,
                  role: data.role,
                  email: data.email,
                  phone: data.phone,
                  status: data.status,
                });
                toast({ title: 'Usuário criado com sucesso!' });
              }
              setShowUserModal(false);
              // Atualizar lista de usuários
              const dataList = await userService.getAll();
              setUsers(dataList || []);
            }}
            submitLabel={editingUser ? 'Salvar Alterações' : 'Criar Usuário'}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
