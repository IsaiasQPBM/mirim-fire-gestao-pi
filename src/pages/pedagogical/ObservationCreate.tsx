
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { observationService, studentService } from '@/services/api';
import { ObservationType, PriorityLevel } from '@/data/pedagogicalTypes';
import type { Database } from '@/integrations/supabase/types';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

type Student = Database['public']['Tables']['students']['Row'] & {
  profiles: {
    full_name: string;
  } | null;
};

const formSchema = z.object({
  studentId: z.string().min(1, 'Selecione um aluno'),
  date: z.string().min(1, 'Data é obrigatória'),
  type: z.enum(['behavioral', 'academic', 'attendance', 'health', 'personal']),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
});

type FormValues = z.infer<typeof formSchema>;

const ObservationCreate = () => {
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      studentId: '',
      date: new Date().toISOString().split('T')[0],
      type: 'academic',
      priority: 'medium',
      description: '',
    }
  });

  useEffect(() => {
    // Check if user is logged in
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

    if (!storedUserRole || !storedUserName) {
      navigate('/');
      return;
    }

    setUserRole(storedUserRole);
    setUserName(storedUserName);

    // Load students from Supabase
    loadStudents();
  }, [navigate]);

  const loadStudents = async () => {
    try {
      setLoadingStudents(true);
      setError(null);
      
      const data = await studentService.getAll();
      setStudents(data || []);
    } catch (error) {
      console.error('Erro ao carregar alunos:', error);
      setError('Erro ao carregar lista de alunos. Tente novamente.');
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de alunos.",
        variant: "destructive"
      });
    } finally {
      setLoadingStudents(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      setError(null);

      // Get current user ID from localStorage
      const currentUserId = localStorage.getItem('userId');
      if (!currentUserId) {
        throw new Error('Usuário não identificado');
      }

      const observationData = {
        student_id: data.studentId,
        instructor_id: currentUserId,
        date: data.date,
        description: data.description,
        type: data.type,
        priority: data.priority,
        follow_up_required: false,
        follow_up_date: null,
      };

      await observationService.create(observationData);

      toast({
        title: 'Observação registrada com sucesso',
        description: 'A observação foi salva no sistema.',
      });

      navigate('/pedagogical/observations');
    } catch (error) {
      console.error('Erro ao criar observação:', error);
      setError('Erro ao salvar observação. Tente novamente.');
      toast({
        title: "Erro",
        description: "Não foi possível salvar a observação.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!userRole) return null;

  return (
    <div className="p-6">
      <div className="max-w-3xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Registrar Nova Observação Pedagógica</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="studentId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Aluno</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger disabled={loadingStudents}>
                              <SelectValue placeholder={
                                loadingStudents ? "Carregando alunos..." : "Selecione um aluno"
                              } />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {students.map((student) => (
                              <SelectItem key={student.id} value={student.id}>
                                {student.profiles?.full_name || 'Nome não disponível'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data da Observação</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Observação</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="behavioral">Comportamental</SelectItem>
                            <SelectItem value="academic">Acadêmica</SelectItem>
                            <SelectItem value="attendance">Presença</SelectItem>
                            <SelectItem value="health">Saúde</SelectItem>
                            <SelectItem value="personal">Pessoal</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nível de Prioridade</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione a prioridade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Baixa</SelectItem>
                            <SelectItem value="medium">Média</SelectItem>
                            <SelectItem value="high">Alta</SelectItem>
                            <SelectItem value="urgent">Urgente</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Descreva a observação pedagógica em detalhes..." 
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Seja específico e inclua detalhes relevantes sobre o comportamento ou desempenho do aluno.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/pedagogical/observations')}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading || loadingStudents}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Salvar Observação
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ObservationCreate;
