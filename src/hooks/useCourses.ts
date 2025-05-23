
import { useState, useEffect, useCallback } from 'react';
import { coursesService, type Course } from '@/services/coursesService';
import { useToast } from '@/hooks/use-toast';
import { cacheService } from '@/services/cacheService';
import { supabase } from '@/integrations/supabase/client';

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Método para buscar todos os cursos com cache
  const fetchCourses = useCallback(async (ignoreCache = false) => {
    try {
      setLoading(true);
      
      // Verificar cache primeiro
      const cacheKey = 'courses_list';
      if (!ignoreCache) {
        const cachedCourses = cacheService.get<Course[]>(cacheKey);
        if (cachedCourses) {
          setCourses(cachedCourses);
          setError(null);
          setLoading(false);
          return;
        }
      }
      
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
        
        // Armazenar no cache por 5 minutos
        cacheService.set(cacheKey, data || [], 5 * 60 * 1000);
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
  }, [toast]);

  // Criar curso
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
        // Atualizar lista local para UI imediata
        setCourses(prev => [...prev, data]);
        
        // Invalidar cache
        cacheService.remove('courses_list');
        
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

  // Atualizar curso
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
        // Atualizar lista local para UI imediata
        setCourses(prev => prev.map(course => 
          course.id === id ? data : course
        ));
        
        // Invalidar cache
        cacheService.remove('courses_list');
        cacheService.remove(`course_${id}`);
        
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

  // Excluir curso
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

      // Atualizar lista local para UI imediata
      setCourses(prev => prev.filter(course => course.id !== id));
      
      // Invalidar cache
      cacheService.remove('courses_list');
      cacheService.remove(`course_${id}`);
      
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

  // Buscar um curso específico por ID
  const getCourse = async (id: string, ignoreCache = false) => {
    try {
      const cacheKey = `course_${id}`;
      
      // Verificar cache primeiro
      if (!ignoreCache) {
        const cachedCourse = cacheService.get<Course>(cacheKey);
        if (cachedCourse) {
          return { data: cachedCourse, error: null };
        }
      }
      
      const { data, error } = await coursesService.getById(id);
      
      if (!error && data) {
        // Armazenar no cache por 5 minutos
        cacheService.set(cacheKey, data, 5 * 60 * 1000);
      }
      
      return { data, error };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  // Configurar inscrição em tempo real para alterações na tabela de cursos
  useEffect(() => {
    fetchCourses();
    
    // Configurar inscrição em tempo real
    const channel = supabase
      .channel('public:courses')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'courses' 
        }, 
        (payload) => {
          console.log('Realtime update on courses table:', payload);
          
          // Refresh dos dados quando houver alterações
          fetchCourses(true); // Ignorar cache
          
          // Mostrar notificação
          if (payload.eventType === 'INSERT') {
            toast({
              title: 'Novo curso adicionado',
              description: 'Um novo curso foi adicionado ao sistema.',
            });
          } else if (payload.eventType === 'UPDATE') {
            toast({
              title: 'Curso atualizado',
              description: 'Um curso foi atualizado no sistema.',
            });
          } else if (payload.eventType === 'DELETE') {
            toast({
              title: 'Curso removido',
              description: 'Um curso foi removido do sistema.',
            });
          }
        }
      )
      .subscribe();
    
    // Limpar inscrição quando o componente for desmontado
    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchCourses]);

  // Obter apenas cursos ativos
  const getActiveCourses = async () => {
    try {
      const cacheKey = 'active_courses_list';
      const cachedCourses = cacheService.get<Course[]>(cacheKey);
      
      if (cachedCourses) {
        return { data: cachedCourses, error: null };
      }
      
      const { data, error } = await coursesService.getActiveCourses();
      
      if (!error && data) {
        cacheService.set(cacheKey, data, 5 * 60 * 1000);
      }
      
      return { data, error };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  return {
    courses,
    loading,
    error,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourse,
    getActiveCourses,
  };
}
