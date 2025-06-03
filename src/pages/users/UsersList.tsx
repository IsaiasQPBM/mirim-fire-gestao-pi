
import React, { useState, useEffect } from 'react';
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
import UserCard from '@/components/users/UserCard';
import Header from '@/components/Header';
import { profilesService } from '@/services/profilesService';
import type { Profile } from '@/services/profilesService';

// Convert Profile to User format for compatibility
interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  role: 'admin' | 'instructor' | 'student';
  status: 'active' | 'inactive';
  createdAt: string;
}

const UsersList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'admin' | 'instructor' | 'student' | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  const userRole = localStorage.getItem('userRole') as 'admin' | 'instructor' | 'student' || 'student';

  // Only admin should be able to see this page
  if (userRole !== 'admin') {
    return (
      <div className="p-6">
        <Header />
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

  // Load users from database
  useEffect(() => {
    const loadUsers = async () => {
      try {
        console.log('📋 Loading users from database...');
        const { data, error } = await profilesService.getAll();
        
        if (error) {
          console.error('❌ Error loading users:', error);
          return;
        }

        if (data) {
          // Convert Profile[] to User[] format
          const convertedUsers: User[] = data.map((profile: Profile) => ({
            id: profile.id,
            fullName: profile.full_name,
            email: profile.email || '',
            phone: profile.phone,
            role: profile.role,
            status: profile.status,
            createdAt: profile.created_at
          }));
          
          console.log('✅ Users loaded:', convertedUsers.length);
          setUsers(convertedUsers);
        }
      } catch (error) {
        console.error('💥 Unexpected error loading users:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

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
  };
  
  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value as 'admin' | 'instructor' | 'student' | 'all');
  };
  
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value as 'active' | 'inactive' | 'all');
  };
  
  React.useEffect(() => {
    filterUsers();
  }, [searchQuery, roleFilter, statusFilter, users]);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <Header />
        <div className="mt-8 text-center">
          <p>Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Header />
      
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
          <p className="text-gray-500">
            {users.length === 0 
              ? "Nenhum usuário encontrado. Clique em 'Novo Usuário' para cadastrar o primeiro."
              : "Nenhum usuário encontrado com os filtros aplicados."
            }
          </p>
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
