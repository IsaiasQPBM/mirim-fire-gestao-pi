
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { mockClasses, mockCourses } from '@/data/mockCurriculumData';
import { Class } from '@/data/curriculumTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { toast } from '@/hooks/use-toast';

const ClassesList: React.FC = () => {
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const navigate = useNavigate();

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
    
    // Fetch classes (mock data)
    // Add courseName to each class
    const classesWithCourseNames = mockClasses.map(classItem => {
      const course = mockCourses.find(c => c.id === classItem.courseId);
      return {
        ...classItem,
        courseName: course ? course.name : 'Curso Desconhecido'
      };
    });
    
    setClasses(classesWithCourseNames);
    setFilteredClasses(classesWithCourseNames);
  }, [navigate]);

  useEffect(() => {
    let filtered = classes;
    
    // Apply course filter
    if (courseFilter !== 'all') {
      filtered = filtered.filter(classItem => classItem.courseId === courseFilter);
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(classItem => classItem.status === statusFilter);
    }
    
    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(classItem => 
        classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (classItem.courseName && classItem.courseName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        classItem.location.toLowerCase().includes(searchQuery.toLowerCase())
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
        return <Badge className="bg-green-500">Em andamento</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-500">Programada</Badge>;
      case 'concluded':
        return <Badge className="bg-gray-500">Concluída</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const isAdmin = userRole === 'admin';

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

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-cbmepi-red" />
              <h1 className="text-2xl font-bold text-cbmepi-black">Gerenciamento de Turmas</h1>
            </div>
            
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Pesquisar turmas..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cbmepi-orange"
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
              >
                <option value="all">Todos os Cursos</option>
                {mockCourses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
              
              <select
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cbmepi-orange"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Todos os Status</option>
                <option value="active">Em andamento</option>
                <option value="upcoming">Programada</option>
                <option value="concluded">Concluída</option>
              </select>
              
              {isAdmin && (
                <Button 
                  onClick={handleCreateClass}
                  className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                >
                  <PlusCircle className="mr-2" size={16} />
                  Nova Turma
                </Button>
              )}
            </div>
          </div>
          
          {filteredClasses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma turma encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery || courseFilter !== 'all' || statusFilter !== 'all' ? 
                  `Não foram encontradas turmas com os filtros atuais.` : 
                  'Não há turmas cadastradas no sistema.'}
              </p>
              {isAdmin && (
                <div className="mt-6">
                  <Button 
                    onClick={handleCreateClass}
                    className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                  >
                    <PlusCircle className="mr-2" size={16} />
                    Criar Primeira Turma
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map((classItem) => (
                <Card 
                  key={classItem.id}
                  className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => handleViewClass(classItem.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{classItem.name}</CardTitle>
                      {getStatusBadge(classItem.status)}
                    </div>
                    <p className="text-sm text-gray-500">{classItem.courseName}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span>
                          {new Date(classItem.startDate).toLocaleDateString('pt-BR')} a {' '}
                          {new Date(classItem.endDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{classItem.studentIds.length} alunos</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{classItem.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                      <span className="text-xs text-gray-500">
                        Horários: {classItem.timeSchedule}
                      </span>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewClass(classItem.id);
                          }}
                          className="text-cbmepi-orange border-cbmepi-orange hover:bg-cbmepi-orange hover:text-white"
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          Ver
                        </Button>
                        
                        {isAdmin && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={(e) => handleEditClass(classItem.id, e)}
                            className="text-gray-600 border-gray-300 hover:bg-gray-100"
                          >
                            <Edit className="mr-1 h-4 w-4" />
                            Editar
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
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
