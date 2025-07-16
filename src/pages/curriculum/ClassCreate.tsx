
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Users, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { classService, courseService } from '@/services/api';

const formSchema = z.object({
  name: z.string().min(3, { message: 'O nome da turma deve ter pelo menos 3 caracteres' }),
  courseId: z.string().min(1, { message: 'Selecione um curso' }),
  startDate: z.string().min(1, { message: 'A data de início é obrigatória' }),
  endDate: z.string().min(1, { message: 'A data de término é obrigatória' }),
  timeSchedule: z.string().min(1, { message: 'O horário é obrigatório' }),
  location: z.string().min(1, { message: 'O local é obrigatório' }),
  status: z.enum(['active', 'upcoming', 'concluded'], {
    required_error: 'Selecione um status',
  }),
});

type FormValues = z.infer<typeof formSchema>;

const ClassCreate: React.FC = () => {
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const presetCourseId = location.state?.courseId || '';
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      courseId: presetCourseId,
      startDate: '',
      endDate: '',
      timeSchedule: '',
      location: '',
      status: 'upcoming',
    }
  });

  useEffect(() => {
    // Check if user is logged in and is admin
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

    if (!storedUserRole || !storedUserName) {
      navigate('/');
      return;
    }

    if (storedUserRole !== 'admin') {
      navigate('/dashboard');
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para criar turmas",
        variant: "destructive"
      });
      return;
    }

    setUserRole(storedUserRole);
    setUserName(storedUserName);

    // Fetch courses from Supabase
    courseService.getAll()
      .then(data => {
        setCourses(data);
      })
      .catch(err => {
        toast({
          title: 'Erro ao carregar cursos',
          description: err.message || 'Não foi possível carregar os cursos.',
          variant: 'destructive',
        });
      });
  }, [navigate, toast]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    try {
      // Forçar status para valores aceitos pelo banco
      let status = data.status;
      if (!['upcoming', 'active', 'concluded'].includes(status)) {
        status = 'upcoming';
      }
      const classData = {
        course_id: data.courseId,
        name: data.name,
        start_date: data.startDate,
        end_date: data.endDate,
        time_schedule: data.timeSchedule,
        location: data.location,
        status
      };
      await classService.create(classData);
      toast({
        title: "Turma criada com sucesso",
        description: `A turma "${data.name}" foi criada com sucesso.`,
      });
      if (presetCourseId) {
        navigate(`/courses/${presetCourseId}`);
      } else {
        navigate('/classes');
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar turma",
        description: error.message || 'Não foi possível criar a turma.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (!userRole) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header 
        title="Criar Turma" 
        userRole={userRole} 
        userName={userName} 
      />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(presetCourseId ? `/courses/${presetCourseId}` : '/classes')}
              className="mb-4"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {presetCourseId ? 'Voltar para o Curso' : 'Voltar para Turmas'}
            </Button>
            
            <div className="flex items-center">
              <Users className="h-6 w-6 text-cbmepi-red mr-2" />
              <h1 className="text-2xl font-bold text-cbmepi-black">Criar Nova Turma</h1>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Nome da Turma</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Turma 1 - Formação Básica 2023" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="courseId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Curso</FormLabel>
                      <FormControl>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cbmepi-orange"
                          {...field}
                          disabled={!!presetCourseId}
                        >
                          <option value="">Selecione um curso</option>
                          {courses.map(course => (
                            <option key={course.id} value={course.id}>
                              {course.name}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Data de Início</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Data de Término</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="timeSchedule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Horários</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Seg, Qua e Sex, 08:00 - 12:00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Local</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Unidade Central CBMEPI" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Status</FormLabel>
                      <FormControl>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-cbmepi-orange"
                          {...field}
                        >
                          <option value="upcoming">Programada</option>
                          <option value="active">Em andamento</option>
                          <option value="concluded">Concluída</option>
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-4 flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate(presetCourseId ? `/courses/${presetCourseId}` : '/classes')}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                    disabled={loading}
                  >
                    {loading ? 'Criando...' : 'Criar Turma'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClassCreate;
