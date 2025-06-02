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
import { toast } from '@/hooks/use-toast';
import { mockCourses, mockClasses } from '@/data/mockCurriculumData';
import { Class } from '@/data/curriculumTypes';

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
  const [classData, setClassData] = useState<Class | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
    
    // Fetch class data
    const foundClass = mockClasses.find(c => c.id === id);
    
    if (!foundClass) {
      toast({
        title: "Turma não encontrada",
        description: "A turma que você está procurando não existe.",
        variant: "destructive"
      });
      navigate('/classes');
      return;
    }
    
    setClassData(foundClass);
    
    // Set form values
    form.reset({
      name: foundClass.name,
      courseId: foundClass.courseId,
      startDate: foundClass.startDate, // Assumes YYYY-MM-DD format
      endDate: foundClass.endDate,     // Assumes YYYY-MM-DD format
      timeSchedule: foundClass.timeSchedule,
      location: foundClass.location,
      status: foundClass.status,
    });
    
    setLoading(false);
  }, [id, navigate, form]);

  const onSubmit = (data: FormValues) => {
    // Update class (in a real app, this would be an API call)
    const updatedClass = {
      ...classData!,
      name: data.name,
      courseId: data.courseId,
      startDate: data.startDate,
      endDate: data.endDate,
      timeSchedule: data.timeSchedule,
      location: data.location,
      status: data.status,
      updatedAt: new Date().toISOString(),
    };

    console.log("Updated class data:", updatedClass);

    // Show success message and navigate back to class view
    toast({
      title: "Turma atualizada com sucesso",
      description: `As alterações em "${data.name}" foram salvas.`,
    });

    navigate(`/classes/${id}`);
  };

  if (loading || !classData) {
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
      <Header />
      
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

export default ClassEdit;
