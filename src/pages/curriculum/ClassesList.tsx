
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Class } from '@/data/curriculumTypes';
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
import { PlusCircle, Search, Users, Calendar, MapPin, Eye, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { classService, courseService } from '@/services/api';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Filter, MoreVertical, UserCheck, UserX } from 'lucide-react';
import clsx from 'clsx';

const ClassesList: React.FC = () => {
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [classes, setClasses] = useState<any[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('all');
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
    
    // Fetch classes and courses from Supabase
    setLoading(true);
    setError(null);
    
    Promise.all([
      classService.getAll(),
      courseService.getAll()
    ])
      .then(([classesData, coursesData]) => {
        setClasses(classesData);
        setFilteredClasses(classesData);
        setCourses(coursesData);
      })
      .catch(err => {
        setError('Erro ao carregar turmas: ' + (err.message || err));
        toast({
          title: 'Erro ao carregar turmas',
          description: err.message || 'Não foi possível carregar as turmas.',
          variant: 'destructive',
        });
      })
      .finally(() => setLoading(false));
  }, [navigate, toast]);

  useEffect(() => {
    let filtered = classes;
    
    // Apply course filter
    if (courseFilter !== 'all') {
      filtered = filtered.filter(classItem => classItem.course_id === courseFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(classItem => classItem.status === statusFilter);
    }
    
    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(classItem => 
        classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (classItem.courses?.name && classItem.courses.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (classItem.location && classItem.location.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    setFilteredClasses(filtered);
  }, [searchQuery, courseFilter, statusFilter, classes]);

  const handleCreateClass = () => {
    navigate('/classes/create');
  };

  const handleViewClass = (classId: string) => {
    navigate(`/classes/${classId}`);
  };

  const handleEditClass = (classId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/classes/${classId}/edit`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="active" className="text-white rounded-full px-3 py-1 text-xs font-semibold">Em andamento</Badge>;
      case 'upcoming':
        return <Badge variant="pending" className="text-white rounded-full px-3 py-1 text-xs font-semibold">Programada</Badge>;
      case 'concluded':
        return <Badge variant="inactive" className="text-white rounded-full px-3 py-1 text-xs font-semibold">Concluída</Badge>;
      default:
        return <Badge variant="outline" className="text-white rounded-full px-3 py-1 text-xs font-semibold">Desconhecido</Badge>;
    }
  };

  const isAdmin = userRole === 'admin';

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50">
        <Header title="Turmas" userRole={userRole} userName={userName} />
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
        <Header title="Turmas" userRole={userRole} userName={userName} />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto text-center py-12">
            <h3 className="text-lg font-medium text-red-600">Erro ao carregar turmas</h3>
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
        title="Turmas" 
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
                <BreadcrumbPage>Turmas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-orange-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Turmas</h1>
                <p className="text-base text-gray-500 mt-1">Gerencie todas as turmas do sistema</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <Input
                  type="text"
                  placeholder="Pesquisar turmas..."
                  className="pl-10 w-full sm:w-64 rounded-lg border border-gray-300 px-4 py-2 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {isAdmin && (
                <Button 
                  onClick={handleCreateClass}
                  className="bg-orange-500 text-white font-semibold rounded-lg px-4 py-2 hover:bg-orange-600 transition-all duration-200 ease-in-out"
                >
                  <PlusCircle className="mr-2" size={16} />
                  Nova Turma
                </Button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 items-center bg-white rounded-lg shadow-sm p-4 mb-6">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm w-full sm:w-[200px]"
            >
              <option value="all">Todos os cursos</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm w-full sm:w-[200px]"
            >
              <option value="all">Todos os status</option>
              <option value="active">Em andamento</option>
              <option value="upcoming">Programada</option>
              <option value="concluded">Concluída</option>
            </select>
          </div>

          {/* Classes Grid */}
          {filteredClasses.length === 0 ? (
            <Card className="rounded-xl bg-white shadow-sm p-5 border border-gray-200">
              <CardContent className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-800">Nenhuma turma encontrada</h3>
                <p className="mt-1 text-sm text-gray-600">
                  {searchQuery ? `Não foram encontradas turmas com "${searchQuery}".` : 'Não há turmas cadastradas no sistema.'}
                </p>
                {isAdmin && (
                  <div className="mt-6">
                    <Button 
                      onClick={handleCreateClass}
                      className="bg-orange-500 text-white font-semibold rounded-lg px-4 py-2 hover:bg-orange-600 transition-all duration-200 ease-in-out"
                    >
                      <PlusCircle className="mr-2" size={16} />
                      Criar Primeira Turma
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map((classItem) => (
                <Card 
                  key={classItem.id}
                  className="rounded-xl bg-white shadow-sm p-5 border border-gray-200 hover:shadow-md transition-all duration-200 ease-in-out cursor-pointer"
                  onClick={() => handleViewClass(classItem.id)}
                >
                  <CardHeader className="p-0 mb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl font-bold text-gray-800 leading-tight">{classItem.name}</CardTitle>
                        <CardDescription className="text-base text-gray-500 mt-1">
                          {classItem.courses?.name || 'Curso não definido'}
                        </CardDescription>
                      </div>
                      {getStatusBadge(classItem.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Início: {new Date(classItem.start_date).toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{classItem.location || 'Local não definido'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{classItem.max_students || 0} alunos máximos</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-0 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      Criada em: {new Date(classItem.created_at).toLocaleDateString('pt-BR')}
                    </div>
                    
                    {isAdmin && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => handleEditClass(classItem.id, e)}
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

export default ClassesList;
