
import { useState, useEffect } from 'react';
import { coursesService, type Course } from '@/services/coursesService';
import { useToast } from '@/hooks/use-toast';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await coursesService.getAll();
      
      if (error) {
        setError(error);
        toast({
          variant: 'destructive',
          title: 'Erro ao carregar cursos',
          description: error,
        });
      } else {
        setCourses(data || []);
        setError(null);
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar cursos',
        description: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const createCourse = async (courseData: any) => {
    try {
      const { data, error } = await coursesService.create(courseData);
      
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erro ao criar curso',
          description: error,
        });
        return { success: false, error };
      }

      if (data) {
        setCourses(prev => [...prev, data]);
        toast({
          title: 'Curso criado com sucesso',
        });
      }

      return { success: true, error: null };
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar curso',
        description: err.message,
      });
      return { success: false, error: err.message };
    }
  };

  const updateCourse = async (id: string, updates: any) => {
    try {
      const { data, error } = await coursesService.update(id, updates);
      
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erro ao atualizar curso',
          description: error,
        });
        return { success: false, error };
      }

      if (data) {
        setCourses(prev => prev.map(course => 
          course.id === id ? data : course
        ));
        toast({
          title: 'Curso atualizado com sucesso',
        });
      }

      return { success: true, error: null };
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar curso',
        description: err.message,
      });
      return { success: false, error: err.message };
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      const { error } = await coursesService.delete(id);
      
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erro ao excluir curso',
          description: error,
        });
        return { success: false, error };
      }

      setCourses(prev => prev.filter(course => course.id !== id));
      toast({
        title: 'Curso excluído com sucesso',
      });

      return { success: true, error: null };
    } catch (err: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao excluir curso',
        description: err.message,
      });
      return { success: false, error: err.message };
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    loading,
    error,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
  };
}
