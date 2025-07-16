
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

const DisciplineEdit: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [discipline, setDiscipline] = useState<any>(null);
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
      description: '',
      courseId: '',
      theoryHours: 0,
      practiceHours: 0,
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
        description: "Você não tem permissão para editar disciplinas",
        variant: "destructive"
      });
      return;
    }

    setUserRole(storedUserRole);
    setUserName(storedUserName);
    
    // Fetch discipline data from Supabase
    if (id) {
      setLoading(true);
      setError(null);
      
      Promise.all([
        disciplineService.getById(id),
        courseService.getAll()
      ])
        .then(([disciplineData, coursesData]) => {
          setDiscipline(disciplineData);
          setCourses(coursesData);
          
          // Set form values
          form.reset({
            name: disciplineData.name,
            description: disciplineData.description || '',
            courseId: disciplineData.course_id,
            theoryHours: disciplineData.theory_hours,
            practiceHours: disciplineData.practice_hours,
            isActive: disciplineData.is_active,
          });
        })
        .catch(err => {
          setError('Erro ao carregar disciplina: ' + (err.message || err));
          toast({
            title: "Disciplina não encontrada",
            description: "A disciplina que você está procurando não existe.",
            variant: "destructive"
          });
          navigate('/disciplines');
        })
        .finally(() => setLoading(false));
    }
  }, [id, navigate, form, toast]);

  const onSubmit = async (data: FormValues) => {
    if (!id) return;
    
    setSaving(true);
    
    try {
      // Update discipline data for Supabase
      const disciplineData = {
        course_id: data.courseId,
        name: data.name,
        description: data.description,
        theory_hours: data.theoryHours,
        practice_hours: data.practiceHours,
        is_active: data.isActive,
        status: data.isActive ? 'active' : 'inactive',
      };

      // Update in Supabase
      await disciplineService.update(id, disciplineData);

      // Show success message and navigate back to disciplines list
      toast({
        title: "Disciplina atualizada com sucesso",
        description: `As alterações em "${data.name}" foram salvas.`,
      });

      navigate('/disciplines');
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar disciplina",
        description: error.message || 'Não foi possível atualizar a disciplina.',
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

  if (error || !discipline) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600">Erro ao carregar disciplina</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <Button 
            onClick={() => navigate('/disciplines')}
            className="mt-4 bg-cbmepi-orange hover:bg-cbmepi-orange/90"
          >
            Voltar para Disciplinas
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header 
        title={`Editar: ${discipline.name}`} 
        userRole={userRole} 
        userName={userName} 
      />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/disciplines')}
              className="mb-4"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar para Disciplinas
            </Button>
            
            <div className="flex items-center">
              <BookPlus className="h-6 w-6 text-cbmepi-red mr-2" />
              <h1 className="text-2xl font-bold text-cbmepi-black">Editar Disciplina</h1>
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
                    onClick={() => navigate('/disciplines')}
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

export default DisciplineEdit;
