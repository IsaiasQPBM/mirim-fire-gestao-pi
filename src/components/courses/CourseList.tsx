
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCourses } from '@/hooks/useCourses';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PlusCircle, Search, BookOpen, Clock, Trash2, Edit, Eye, Loader2 } from 'lucide-react';

const CourseList: React.FC = () => {
  const { courses, loading, error, fetchCourses, deleteCourse } = useCourses();
  const [filteredCourses, setFilteredCourses] = useState(courses);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Filtrar cursos com base na pesquisa
    if (searchQuery.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course => 
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.description && course.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredCourses(filtered);
    }
  }, [searchQuery, courses]);

  const handleCreateCourse = () => {
    navigate('/courses/create');
  };

  const handleViewCourse = (id: string) => {
    navigate(`/courses/${id}`);
  };

  const handleEditCourse = (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/courses/${id}/edit`);
  };

  const handleDeleteCourse = async (id: string) => {
    setIsDeleting(id);
    try {
      const { error } = await deleteCourse(id);
      if (!error) {
        // O curso foi excluído com sucesso, refresh já é feito pelo hook
      }
    } catch (error) {
      console.error('Error deleting course:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-cbmepi-orange" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700">
        <p className="font-medium">Erro ao carregar cursos</p>
        <p>{error}</p>
        <Button onClick={fetchCourses} variant="outline" className="mt-2">
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Pesquisar cursos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>
        <Button onClick={handleCreateCourse} className="bg-cbmepi-orange hover:bg-cbmepi-orange/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Novo Curso
        </Button>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum curso encontrado</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery ? 
              `Não foram encontrados cursos com "${searchQuery}".` : 
              'Não há cursos cadastrados no sistema.'}
          </p>
          <div className="mt-6">
            <Button onClick={handleCreateCourse} className="bg-cbmepi-orange hover:bg-cbmepi-orange/90">
              <PlusCircle className="mr-2 h-4 w-4" />
              Criar Primeiro Curso
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <Card 
              key={course.id} 
              className="hover:shadow-md transition-shadow cursor-pointer" 
              onClick={() => handleViewCourse(course.id)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex justify-between items-start">
                  <span className="truncate">{course.name}</span>
                  <Badge variant={course.is_active ? "default" : "secondary"}>
                    {course.is_active ? "Ativo" : "Inativo"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {course.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {course.description}
                  </p>
                )}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{course.total_hours} horas</span>
                </div>
                <div className="flex justify-end space-x-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={(e) => handleEditCourse(course.id, e)}
                    className="text-gray-600"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Confirmação</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tem certeza que deseja excluir o curso "{course.name}"? Esta ação não pode ser desfeita.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCourse(course.id);
                          }}
                          className="bg-red-600 hover:bg-red-700"
                          disabled={isDeleting === course.id}
                        >
                          {isDeleting === course.id ? (
                            <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Excluindo...</>
                          ) : (
                            <>Sim, excluir</>
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CourseList;
