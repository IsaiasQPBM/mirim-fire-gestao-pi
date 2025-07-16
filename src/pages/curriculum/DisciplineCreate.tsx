
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { BookPlus, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { disciplineService, courseService } from '@/services/api';

const formSchema = z.object({
  name: z.string().min(3, { message: 'O nome da disciplina deve ter pelo menos 3 caracteres' }),
  description: z.string().min(10, { message: 'A descrição deve ter pelo menos 10 caracteres' }),
  courseId: z.string().min(1, { message: 'Selecione um curso' }),
  theoryHours: z.number().min(0, { message: 'A carga horária teórica não pode ser negativa' }),
  practiceHours: z.number().min(0, { message: 'A carga horária prática não pode ser negativa' }),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const DisciplineCreate: React.FC = () => {
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
      description: '',
      courseId: presetCourseId,
      theoryHours: 10,
      practiceHours: 10,
      isActive: true,
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
        description: "Você não tem permissão para criar disciplinas",
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
      // Create discipline data for Supabase
      const disciplineData = {
        course_id: data.courseId,
        name: data.name,
        description: data.description,
        theory_hours: data.theoryHours,
        practice_hours: data.practiceHours,
        is_active: data.isActive,
        status: data.isActive ? 'active' : 'inactive',
      };

      // Save to Supabase
      await disciplineService.create(disciplineData);

      // Show success message and navigate back to disciplines list
      toast({
        title: "Disciplina criada com sucesso",
        description: `A disciplina "${data.name}" foi criada com sucesso.`,
      });

      if (presetCourseId) {
        navigate(`/courses/${presetCourseId}`);
      } else {
        navigate('/disciplines');
      }
    } catch (error: any) {
      toast({
        title: "Erro ao criar disciplina",
        description: error.message || 'Não foi possível criar a disciplina.',
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
        title="Criar Disciplina" 
        userRole={userRole} 
        userName={userName} 
      />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate(presetCourseId ? `/courses/${presetCourseId}` : '/disciplines')}
              className="mb-4"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              {presetCourseId ? 'Voltar para o Curso' : 'Voltar para Disciplinas'}
            </Button>
            
            <div className="flex items-center">
              <BookPlus className="h-6 w-6 text-cbmepi-red mr-2" />
              <h1 className="text-2xl font-bold text-cbmepi-black">Criar Nova Disciplina</h1>
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
                      <FormLabel className="font-medium">Nome da Disciplina</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Noções de Primeiros Socorros" {...field} />
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
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva a disciplina de forma detalhada" 
                          className="min-h-24 resize-y"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="theoryHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Carga Horária Teórica</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={0}
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="practiceHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Carga Horária Prática</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={0}
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Input 
                          type="checkbox" 
                          className="w-4 h-4"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-medium">Disciplina Ativa</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-4 flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate(presetCourseId ? `/courses/${presetCourseId}` : '/disciplines')}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                    disabled={loading}
                  >
                    {loading ? 'Criando...' : 'Criar Disciplina'}
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

export default DisciplineCreate;
