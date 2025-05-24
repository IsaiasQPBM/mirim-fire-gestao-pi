
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSupabaseQuery } from '@/hooks/useSupabaseQuery';
import { coursesService } from '@/services/coursesService';
import { cacheService } from '@/services/cacheService';
import { BookOpen, Clock, Users, RefreshCw } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  description?: string;
  objectives?: string;
  total_hours: number;
  prerequisites?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const CourseList: React.FC = () => {
  const cacheKey = cacheService.buildKey('courses_list');
  
  const { data: courses, loading, error, refetch } = useSupabaseQuery<Course[]>(
    () => coursesService.getAll(),
    {
      cacheKey,
      cacheTTL: 5 * 60 * 1000, // 5 minutos
      onError: (error) => console.error('Erro ao carregar cursos:', error),
    }
  );

  const handleRefresh = () => {
    refetch();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Carregando cursos...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-800">Erro ao carregar cursos: {error}</p>
        <Button 
          onClick={handleRefresh}
          variant="outline" 
          size="sm" 
          className="mt-2"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    return (
      <div className="text-center p-8">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum curso encontrado</h3>
        <p className="text-gray-500">Não há cursos cadastrados no momento.</p>
        <Button 
          onClick={handleRefresh}
          variant="outline" 
          className="mt-4"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Cursos Disponíveis</h2>
        <Button 
          onClick={handleRefresh}
          variant="outline" 
          size="sm"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Atualizar
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{course.name}</CardTitle>
                <Badge variant={course.is_active ? "default" : "secondary"}>
                  {course.is_active ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              {course.description && (
                <CardDescription className="line-clamp-2">
                  {course.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{course.total_hours}h total</span>
                </div>
                
                {course.prerequisites && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Pré-requisitos:</span>
                    <p className="text-gray-600 mt-1">{course.prerequisites}</p>
                  </div>
                )}
                
                {course.objectives && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Objetivos:</span>
                    <p className="text-gray-600 mt-1 line-clamp-3">{course.objectives}</p>
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button variant="outline" className="w-full">
                  <Users className="w-4 h-4 mr-2" />
                  Ver Detalhes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CourseList;
