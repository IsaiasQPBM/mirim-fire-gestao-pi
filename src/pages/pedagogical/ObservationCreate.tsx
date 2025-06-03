
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Header from '@/components/Header';
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
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { studentsService } from '@/services/studentsService';
import { observationsService } from '@/services/observationsService';
import { useAuth } from '@/hooks/useAuth';

interface FormValues {
  studentId: string;
  date: string;
  type: 'behavioral' | 'academic' | 'attendance' | 'health' | 'personal';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  followUpRequired: boolean;
  followUpDate?: string;
}

const ObservationCreate = () => {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const form = useForm<FormValues>({
    defaultValues: {
      studentId: '',
      date: new Date().toISOString().split('T')[0],
      type: 'academic',
      priority: 'medium',
      description: '',
      followUpRequired: false,
      followUpDate: '',
    }
  });

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const { data, error } = await studentsService.getAll();
        if (error) {
          toast({
            title: "Erro",
            description: "Não foi possível carregar a lista de alunos.",
            variant: "destructive"
          });
          return;
        }
        setStudents(data || []);
      } catch (error) {
        console.error('Error loading students:', error);
        toast({
          title: "Erro",
          description: "Erro inesperado ao carregar alunos.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadStudents();
  }, []);

  const onSubmit = async (data: FormValues) => {
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await observationsService.create({
        student_id: data.studentId,
        instructor_id: user.id,
        type: data.type,
        priority: data.priority,
        description: data.description,
        date: data.date,
        follow_up_required: data.followUpRequired,
        follow_up_date: data.followUpDate || undefined,
      });

      if (error) {
        toast({
          title: "Erro",
          description: `Erro ao salvar observação: ${error}`,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: 'Observação registrada com sucesso',
        description: 'A observação foi salva no sistema.',
      });

      navigate('/pedagogical/observations');
    } catch (error) {
      console.error('Error creating observation:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao salvar observação.",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header />
        <main className="flex-1 p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cbmepi-orange"></div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 p-6 overflow-y-auto">
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
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um aluno" />
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
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/pedagogical/observations')}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Salvar Observação
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default ObservationCreate;
