
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const ClassEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [classData, setClassData] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      courseId: '',
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
        description: "Você não tem permissão para editar turmas",
        variant: "destructive"
      });
      return;
    }

    setUserRole(storedUserRole);
    setUserName(storedUserName);
    
    // Fetch class data from Supabase
    if (id) {
      setLoading(true);
      setError(null);
      
      Promise.all([
        classService.getById(id),
        courseService.getAll()
      ])
        .then(([classData, coursesData]) => {
          setClassData(classData);
          setCourses(coursesData);
          
          // Set form values
          form.reset({
            name: classData.name,
            courseId: classData.course_id,
            startDate: classData.start_date ? classData.start_date.split('T')[0] : '',
            endDate: classData.end_date ? classData.end_date.split('T')[0] : '',
            timeSchedule: classData.time_schedule || '',
            location: classData.location || '',
            status: classData.status || 'upcoming',
          });
        })
        .catch(err => {
          setError('Erro ao carregar turma: ' + (err.message || err));
          toast({
            title: "Turma não encontrada",
            description: "A turma que você está procurando não existe.",
            variant: "destructive"
          });
          navigate('/classes');
        })
        .finally(() => setLoading(false));
    }
  }, [id, navigate, form, toast]);

  const onSubmit = async (data: FormValues) => {
    if (!id) return;
    
    setSaving(true);
    
    try {
      // Update class data for Supabase
      const updateData = {
        course_id: data.courseId,
        name: data.name,
        start_date: data.startDate,
        end_date: data.endDate,
        time_schedule: data.timeSchedule,
        location: data.location,
        status: data.status
      };

      // Update in Supabase
      await classService.update(id, updateData);

      // Show success message and navigate back to class view
      toast({
        title: "Turma atualizada com sucesso",
        description: `As alterações em "${data.name}" foram salvas.`,
      });

      navigate(`/classes/${id}`);
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar turma",
        description: error.message || 'Não foi possível atualizar a turma.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cbmepi-orange mx-auto"></div>
          <p className="mt-2 text-cbmepi-black">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !classData) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600">Erro ao carregar turma</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <Button 
            onClick={() => navigate('/classes')}
            className="mt-4 bg-cbmepi-orange hover:bg-cbmepi-orange/90"
          >
            Voltar para Turmas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header 
        title={`Editar: ${classData.name}`} 
        userRole={userRole} 
        userName={userName} 
      />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(`/classes/${id}`)}
              className="mb-4"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar para Detalhes da Turma
            </Button>
            
            <div className="flex items-center">
              <Users className="h-6 w-6 text-cbmepi-red mr-2" />
              <h1 className="text-2xl font-bold text-cbmepi-black">Editar Turma</h1>
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
                    onClick={() => navigate(`/classes/${id}`)}
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                    disabled={saving}
                  >
                    {saving ? 'Salvando...' : 'Salvar Alterações'}
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

export default ClassEdit;
