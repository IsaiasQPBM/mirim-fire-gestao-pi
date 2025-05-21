
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UserPlus, Filter, Search } from 'lucide-react';
import { mockUsers, User, UserRole, UserStatus } from '@/data/userTypes';
import UserCard from '@/components/users/UserCard';
import Header from '@/components/Header';

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState<User[]>(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const navigate = useNavigate();
  
  const userRole = localStorage.getItem('userRole') as 'admin' | 'instructor' | 'student' || 'student';
  const userName = localStorage.getItem('userName') || '';

  // Only admin should be able to see this page
  if (userRole !== 'admin') {
    return (
      <div className="p-6">
        <Header title="Gerenciamento de Usuários" userRole={userRole} userName={userName} />
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

  const filterUsers = () => {
    let result = users;
    
    if (searchQuery) {
      result = result.filter(user => 
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(user => user.status === statusFilter);
    }
    
    setFilteredUsers(result);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    filterUsers();
  };
  
  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value as UserRole | 'all');
    filterUsers();
  };
  
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as UserStatus | 'all');
    filterUsers();
  };
  
  React.useEffect(() => {
    filterUsers();
  }, [searchQuery, roleFilter, statusFilter]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Header title="Gerenciamento de Usuários" userRole={userRole} userName={userName} />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 mt-6">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-cbmepi-orange" />
          <h2 className="text-lg font-semibold">Filtros</h2>
        </div>
        
        <Button 
          className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 w-full md:w-auto"
          onClick={() => navigate('/users/create')}
        >
          <UserPlus size={18} className="mr-2" />
          Novo Usuário
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="relative">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input 
            placeholder="Buscar usuários..." 
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10" 
          />
        </div>
        
        <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por perfil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os perfis</SelectItem>
            <SelectItem value="admin">Administrador</SelectItem>
            <SelectItem value="instructor">Instrutor</SelectItem>
            <SelectItem value="student">Aluno</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="active">Ativo</SelectItem>
            <SelectItem value="inactive">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {filteredUsers.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500">Nenhum usuário encontrado com os filtros aplicados.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map(user => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UsersList;
