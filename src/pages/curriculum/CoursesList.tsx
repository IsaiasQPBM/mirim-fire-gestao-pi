
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Course } from '@/data/curriculumTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { courseService } from '@/services/api';

const CoursesList: React.FC = () => {
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
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
    
    // Fetch courses from Supabase
    setLoading(true);
    setError(null);
    courseService.getAll()
      .then(data => {
        setCourses(data);
        setFilteredCourses(data);
      })
      .catch(err => {
        setError('Erro ao carregar cursos: ' + (err.message || err));
        toast({
          title: 'Erro ao carregar cursos',
          description: err.message || 'Não foi possível carregar os cursos.',
          variant: 'destructive',
        });
      })
      .finally(() => setLoading(false));
  }, [navigate, toast]);

  useEffect(() => {
    const filtered = courses.filter(course => 
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
    setFilteredCourses(filtered);
  }, [searchQuery, courses]);

  const handleCreateCourse = () => {
    navigate('/courses/create');
  };

  const handleViewCourse = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  const handleEditCourse = (courseId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/courses/${courseId}/edit`);
  };

  if (!userRole) return null;

  const isAdmin = userRole === 'admin';

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto text-center py-12">
          <h3 className="text-lg font-medium text-red-600">Erro ao carregar cursos</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-4 py-2 transition-all duration-200 ease-in-out"
          >
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-orange-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Cursos</h1>
              <p className="text-base text-gray-500 mt-1">Gerencie todos os cursos do sistema</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <Input
                type="text"
                placeholder="Pesquisar cursos..."
                className="pl-10 w-full sm:w-64 rounded-lg border border-gray-300 px-4 py-2 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {isAdmin && (
              <Button 
                onClick={handleCreateCourse}
                className="bg-orange-500 text-white font-semibold rounded-lg px-4 py-2 hover:bg-orange-600 transition-all duration-200 ease-in-out"
              >
                <PlusCircle className="mr-2" size={16} />
                Novo Curso
              </Button>
            )}
          </div>
        </div>
        
        {filteredCourses.length === 0 ? (
          <Card className="rounded-xl bg-white shadow-sm p-5 border border-gray-200">
            <CardContent className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-800">Nenhum curso encontrado</h3>
              <p className="mt-1 text-sm text-gray-600">
                {searchQuery ? `Não foram encontrados cursos com "${searchQuery}".` : 'Não há cursos cadastrados no sistema.'}
              </p>
              {isAdmin && (
                <div className="mt-6">
                  <Button 
                    onClick={handleCreateCourse}
                    className="bg-orange-500 text-white font-semibold rounded-lg px-4 py-2 hover:bg-orange-600 transition-all duration-200 ease-in-out"
                  >
                    <PlusCircle className="mr-2" size={16} />
                    Criar Primeiro Curso
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <Card 
                key={course.id}
                className="rounded-xl bg-white shadow-sm p-5 border border-gray-200 hover:shadow-md transition-all duration-200 ease-in-out cursor-pointer"
                onClick={() => handleViewCourse(course.id)}
              >
                <CardHeader className="p-0 mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl font-bold text-gray-800 leading-tight">{course.name}</CardTitle>
                      <CardDescription className="text-base text-gray-500 mt-1">
                        {course.total_hours} horas totais
                      </CardDescription>
                    </div>
                    <Badge variant={course.is_active ? 'active' : 'inactive'} className="text-white rounded-full px-3 py-1 text-xs font-semibold">
                      {course.is_active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0 mb-4">
                  <p className="text-sm text-gray-600 line-clamp-3">{course.description || 'Sem descrição'}</p>
                </CardContent>
                <CardFooter className="p-0 flex justify-between items-center">
                  <div className="text-xs text-gray-500">
                    Criado em: {new Date(course.created_at).toLocaleDateString('pt-BR')}
                  </div>
                  
                  {isAdmin && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={(e) => handleEditCourse(course.id, e)}
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
    </div>
  );
};

export default CoursesList;
