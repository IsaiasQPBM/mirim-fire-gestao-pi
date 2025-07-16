
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { courseService } from '@/services/api';

const formSchema = z.object({
  name: z.string().min(3, { message: 'O nome do curso deve ter pelo menos 3 caracteres' }),
  description: z.string().min(10, { message: 'A descrição deve ter pelo menos 10 caracteres' }),
  objectives: z.string().min(10, { message: 'Os objetivos devem ter pelo menos 10 caracteres' }),
  totalHours: z.number().min(1, { message: 'A carga horária deve ser maior que zero' }),
  prerequisites: z.string(),
  isActive: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

const CourseCreate: React.FC = () => {
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      objectives: '',
      totalHours: 40,
      prerequisites: '',
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
        description: "Você não tem permissão para criar cursos",
        variant: "destructive"
      });
      return;
    }

    setUserRole(storedUserRole);
    setUserName(storedUserName);
  }, [navigate, toast]);

  const onSubmit = async (data: FormValues) => {
    setLoading(true);
    
    try {
      // Convert prerequisites string to array
      const prerequisitesArray = data.prerequisites
        ? data.prerequisites.split(',').map(item => item.trim())
        : [];

      // Create course data for Supabase
      const courseData = {
        name: data.name,
        description: data.description,
        objectives: data.objectives,
        total_hours: data.totalHours,
        prerequisites: prerequisitesArray,
        is_active: data.isActive,
      };

      // Save to Supabase
      await courseService.create(courseData);

      // Show success message and navigate back to courses list
      toast({
        title: "Curso criado com sucesso",
        description: `O curso "${data.name}" foi criado com sucesso.`,
      });

      navigate('/courses');
    } catch (error: any) {
      toast({
        title: "Erro ao criar curso",
        description: error.message || 'Não foi possível criar o curso.',
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
        title="Criar Curso" 
        userRole={userRole} 
        userName={userName} 
      />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/courses')}
              className="mb-4"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar para Cursos
            </Button>
            
            <div className="flex items-center">
              <BookPlus className="h-6 w-6 text-cbmepi-red mr-2" />
              <h1 className="text-2xl font-bold text-cbmepi-black">Criar Novo Curso</h1>
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
                      <FormLabel className="font-medium">Nome do Curso</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Formação Básica de Bombeiro Mirim" {...field} />
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
                          placeholder="Descreva o curso de forma detalhada" 
                          className="min-h-24 resize-y"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="objectives"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-medium">Objetivos</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Liste os objetivos educacionais do curso" 
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
                    name="totalHours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Carga Horária Total</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1}
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
                    name="prerequisites"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Pré-requisitos (separados por vírgula)</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ex: Curso Básico, Introdução..." 
                            {...field} 
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
                      <FormLabel className="font-medium">Curso Ativo</FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-4 flex justify-end space-x-3">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/courses')}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                    disabled={loading}
                  >
                    {loading ? 'Criando...' : 'Criar Curso'}
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

export default CourseCreate;
