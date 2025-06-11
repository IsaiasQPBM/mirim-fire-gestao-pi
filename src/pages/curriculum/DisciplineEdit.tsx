
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
import { toast } from '@/hooks/use-toast';
import { mockDisciplines, mockCourses } from '@/data/mockCurriculumData';
import { Discipline } from '@/data/curriculumTypes';

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
  const [discipline, setDiscipline] = useState<Discipline | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    
    // Fetch discipline data
    const foundDiscipline = mockDisciplines.find(d => d.id === id);
    
    if (!foundDiscipline) {
      toast({
        title: "Disciplina não encontrada",
        description: "A disciplina que você está procurando não existe.",
        variant: "destructive"
      });
      navigate('/disciplines');
      return;
    }
    
    setDiscipline(foundDiscipline);
    
    // Set form values
    form.reset({
      name: foundDiscipline.name,
      description: foundDiscipline.description,
      courseId: foundDiscipline.courseId,
      theoryHours: foundDiscipline.theoryHours,
      practiceHours: foundDiscipline.practiceHours,
      isActive: foundDiscipline.isActive,
    });
    
    setLoading(false);
  }, [id, navigate, form]);

  const onSubmit = (data: FormValues) => {
    // Update discipline (in a real app, this would be an API call)
    const updatedDiscipline = {
      ...discipline!,
      name: data.name,
      description: data.description,
      courseId: data.courseId,
      theoryHours: data.theoryHours,
      practiceHours: data.practiceHours,
      isActive: data.isActive,
      updatedAt: new Date().toISOString(),
    };

    console.log("Updated discipline data:", updatedDiscipline);

    // Show success message and navigate back to disciplines list
    toast({
      title: "Disciplina atualizada com sucesso",
      description: `As alterações em "${data.name}" foram salvas.`,
    });

    navigate('/disciplines');
  };

  if (loading || !discipline) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cbmepi-orange mx-auto"></div>
          <p className="mt-2 text-cbmepi-black">Carregando...</p>
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
                          {mockCourses.map(course => (
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
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                  >
                    Salvar Alterações
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
