
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { mockCourses } from '@/data/mockCurriculumData';
import { Course } from '@/data/curriculumTypes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { PlusCircle, Search, BookOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const CoursesList: React.FC = () => {
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
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
    
    // Fetch courses (mock data)
    setCourses(mockCourses);
    setFilteredCourses(mockCourses);
  }, [navigate]);

  useEffect(() => {
    const filtered = courses.filter(course => 
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      course.description.toLowerCase().includes(searchQuery.toLowerCase())
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

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-cbmepi-red" />
              <h1 className="text-2xl font-bold text-cbmepi-black">Gerenciamento de Cursos</h1>
            </div>
            
            <div className="flex space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Pesquisar cursos..."
                  className="pl-10 w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              {isAdmin && (
                <Button 
                  onClick={handleCreateCourse}
                  className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                >
                  <PlusCircle className="mr-2" size={16} />
                  Novo Curso
                </Button>
              )}
            </div>
          </div>
          
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum curso encontrado</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? `Não foram encontrados cursos com "${searchQuery}".` : 'Não há cursos cadastrados no sistema.'}
              </p>
              {isAdmin && (
                <div className="mt-6">
                  <Button 
                    onClick={handleCreateCourse}
                    className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                  >
                    <PlusCircle className="mr-2" size={16} />
                    Criar Primeiro Curso
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <Card 
                  key={course.id}
                  className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
                  onClick={() => handleViewCourse(course.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-cbmepi-black">{course.name}</CardTitle>
                        <CardDescription className="text-gray-500 mt-1">
                          {course.totalHours} horas totais
                        </CardDescription>
                      </div>
                      <Badge variant={course.isActive ? 'default' : 'outline'} className={course.isActive ? 'bg-green-500' : ''}>
                        {course.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 line-clamp-3">{course.description}</p>
                  </CardContent>
                  <CardFooter className="pt-0 flex justify-between items-center">
                    <div className="text-xs text-gray-500">
                      Criado em: {new Date(course.createdAt).toLocaleDateString('pt-BR')}
                    </div>
                    
                    {isAdmin && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => handleEditCourse(course.id, e)}
                        className="text-cbmepi-orange border-cbmepi-orange hover:bg-cbmepi-orange hover:text-white"
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

export default CoursesList;
