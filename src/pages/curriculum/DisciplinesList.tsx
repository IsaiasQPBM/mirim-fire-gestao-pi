
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Discipline } from '@/data/curriculumTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { PlusCircle, Search, BookOpen, Clock, Eye, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { disciplineService } from '@/services/api';

const DisciplinesList: React.FC = () => {
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [disciplines, setDisciplines] = useState<any[]>([]);
  const [filteredDisciplines, setFilteredDisciplines] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

    if (!storedUserRole || !storedUserName) {
      navigate('/');
      return;
    }

    setUserRole(storedUserRole);
    setUserName(storedUserName);
    
    // Fetch disciplines from Supabase
    setLoading(true);
    setError(null);
    disciplineService.getAll()
      .then(data => {
        setDisciplines(data);
        setFilteredDisciplines(data);
      })
      .catch(err => {
        setError('Erro ao carregar disciplinas: ' + (err.message || err));
        toast({
          title: 'Erro ao carregar disciplinas',
          description: err.message || 'Não foi possível carregar as disciplinas.',
          variant: 'destructive',
        });
      })
      .finally(() => setLoading(false));
  }, [navigate, toast]);

  useEffect(() => {
    let filtered = disciplines;
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(discipline => discipline.status === statusFilter);
    }
    
    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(discipline => 
        discipline.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (discipline.description && discipline.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredDisciplines(filtered);
  }, [searchQuery, statusFilter, disciplines]);

  const handleCreateDiscipline = () => {
    navigate('/disciplines/create');
  };

  const handleViewDiscipline = (disciplineId: string) => {
    navigate(`/disciplines/${disciplineId}`);
  };

  const handleEditDiscipline = (disciplineId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/disciplines/${disciplineId}/edit`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="active" className="text-white rounded-full px-3 py-1 text-xs font-semibold">Ativa</Badge>;
      case 'inactive':
        return <Badge variant="inactive" className="text-white rounded-full px-3 py-1 text-xs font-semibold">Inativa</Badge>;
      case 'draft':
        return <Badge variant="pending" className="text-white rounded-full px-3 py-1 text-xs font-semibold">Rascunho</Badge>;
      default:
        return <Badge variant="outline" className="text-white rounded-full px-3 py-1 text-xs font-semibold">Desconhecido</Badge>;
    }
  };

  const isAdmin = userRole === 'admin';

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Header title="Disciplinas" userRole={userRole} userName={userName} />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Header title="Disciplinas" userRole={userRole} userName={userName} />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto text-center py-12">
            <h3 className="text-lg font-medium text-red-600">Erro ao carregar disciplinas</h3>
            <p className="mt-1 text-sm text-gray-500">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-4 py-2 transition-all duration-200 ease-in-out"
            >
              Tentar Novamente
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header 
        title="Disciplinas" 
        userRole={userRole} 
        userName={userName}
      />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Disciplinas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-orange-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Disciplinas</h1>
                <p className="text-base text-gray-500 mt-1">Gerencie todas as disciplinas do sistema</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <Input
                  type="text"
                  placeholder="Pesquisar disciplinas..."
                  className="pl-10 w-full sm:w-64 rounded-lg border border-gray-300 px-4 py-2 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <select
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm w-full sm:w-[200px]"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos os Status</option>
                <option value="active">Ativa</option>
                <option value="inactive">Inativa</option>
                <option value="draft">Rascunho</option>
              </select>
              
              {isAdmin && (
                <Button 
                  onClick={handleCreateDiscipline}
                  className="bg-orange-500 text-white font-semibold rounded-lg px-4 py-2 hover:bg-orange-600 transition-all duration-200 ease-in-out"
                >
                  <PlusCircle className="mr-2" size={16} />
                  Nova Disciplina
                </Button>
              )}
            </div>
          </div>

          {/* Disciplines Grid */}
          {filteredDisciplines.length === 0 ? (
            <Card className="rounded-xl bg-white shadow-sm p-5 border border-gray-200">
              <CardContent className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-800">Nenhuma disciplina encontrada</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {searchQuery ? `Não foram encontradas disciplinas com "${searchQuery}".` : 'Não há disciplinas cadastradas no sistema.'}
                </p>
                {isAdmin && (
                  <div className="mt-6">
                    <Button 
                      onClick={handleCreateDiscipline}
                      className="bg-orange-500 text-white font-semibold rounded-lg px-4 py-2 hover:bg-orange-600 transition-all duration-200 ease-in-out"
                    >
                      <PlusCircle className="mr-2" size={16} />
                      Criar Primeira Disciplina
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDisciplines.map((discipline) => (
                <Card 
                  key={discipline.id}
                  className="rounded-xl bg-white shadow-sm p-5 border border-gray-200 hover:shadow-md transition-all duration-200 ease-in-out cursor-pointer"
                  onClick={() => handleViewDiscipline(discipline.id)}
                >
                  <CardHeader className="p-0 mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl font-bold text-gray-800 leading-tight">{discipline.name}</CardTitle>
                        <CardDescription className="text-base text-gray-500 mt-1">
                          {discipline.total_hours} horas totais
                        </CardDescription>
                      </div>
                      {getStatusBadge(discipline.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 mb-4">
                    <p className="text-sm text-gray-600 line-clamp-3">{discipline.description || 'Sem descrição'}</p>
                  </CardContent>
                  <CardFooter className="p-0 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>{discipline.weekly_hours || 0}h/semana</span>
                    </div>
                    
                    {isAdmin && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => handleEditDiscipline(discipline.id, e)}
                        className="border-orange-400 text-orange-500 hover:bg-orange-50 rounded-lg px-3 py-1.5 text-sm transition-all duration-200 ease-in-out"
                      >
                        Editar
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DisciplinesList;
