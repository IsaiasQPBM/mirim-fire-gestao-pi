
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SaveIcon, Plus, Trash2, ArrowLeft, Search, CheckCircle, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { assessmentService, disciplineService, classService, questionService, assessmentQuestionService } from '@/services/api';
import { Tables } from '@/integrations/supabase/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Tipos temporários para questões (até implementar tabela de questões no banco)
type QuestionType = 'multiple_choice' | 'essay' | 'practical';
type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  points: number;
  difficultyLevel: DifficultyLevel;
  disciplineId: string;
  options?: QuestionOption[];
  correctAnswer?: string;
}

interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

interface FormValues {
  title: string;
  description: string;
  disciplineId: string;
  classId: string;
  date: string;
  duration: number;
  isPublished: boolean;
  questions: Question[];
}

const AssessmentCreate = () => {
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [questionFilter, setQuestionFilter] = useState<string>('');
  const [disciplines, setDisciplines] = useState<Tables<'disciplines'>[]>([]);
  const [classes, setClasses] = useState<Tables<'classes'>[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    defaultValues: {
      title: '',
      description: '',
      disciplineId: '',
      classId: '',
      date: new Date().toISOString().split('T')[0],
      duration: 60,
      isPublished: false,
      questions: [],
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
    
    // Load data
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [disciplinesData, classesData, questionsData] = await Promise.all([
        disciplineService.getAll(),
        classService.getAll(),
        questionService.getAll()
      ]);
      setDisciplines(disciplinesData);
      setClasses(classesData);
      setAvailableQuestions(questionsData.map(q => ({
        id: q.id,
        text: q.text,
        type: q.type as QuestionType,
        points: q.points,
        difficultyLevel: q.difficulty_level as DifficultyLevel,
        disciplineId: q.discipline_id,
        options: q.question_options?.map(opt => ({
          id: opt.id,
          text: opt.text,
          isCorrect: opt.is_correct
        })) || [],
        correctAnswer: ''
      })));
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados necessários.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter questions based on search term
  const filteredQuestions = availableQuestions.filter(q => 
    q.text.toLowerCase().includes(questionFilter.toLowerCase()) &&
    !selectedQuestions.some(sq => sq.id === q.id)
  );

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);
      
      // Get current user ID
      const userId = localStorage.getItem('userId');
      if (!userId) {
        toast({
          title: 'Erro',
          description: 'Usuário não identificado.',
          variant: 'destructive',
        });
        return;
      }

      // Prepare assessment data
      const assessmentData = {
        title: data.title,
        description: data.description,
        discipline_id: data.disciplineId,
        class_id: data.classId,
        assessment_date: data.date,
        assessment_type: 'written', // Default type
        total_points: selectedQuestions.reduce((sum, q) => sum + q.points, 0),
        status: data.isPublished ? 'published' : 'draft',
        instructor_id: userId,
      };

      // Create assessment
      const newAssessment = await assessmentService.create(assessmentData);

      // Add questions to assessment
      if (selectedQuestions.length > 0) {
        const assessmentQuestions = selectedQuestions.map((question, index) => ({
          assessment_id: newAssessment.id,
          question_id: question.id,
          order_index: index,
          points: question.points,
        }));

        await assessmentQuestionService.addQuestions(assessmentQuestions);
      }
      
      toast({
        title: data.isPublished ? 'Avaliação publicada com sucesso!' : 'Avaliação salva como rascunho!',
        description: data.isPublished 
          ? 'A avaliação agora está disponível para os alunos.'
          : 'A avaliação foi salva e pode ser editada posteriormente antes de publicar.',
      });

      navigate('/pedagogical/assessments');
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar a avaliação.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = (question: Question) => {
    setSelectedQuestions([...selectedQuestions, question]);
    // This is simulating removing the question from available questions
    // In a real app with a proper backend, you would fetch filtered questions from the API
  };

  const removeQuestion = (questionId: string) => {
    setSelectedQuestions(selectedQuestions.filter(q => q.id !== questionId));
  };

  const getQuestionTypeLabel = (type: QuestionType) => {
    switch (type) {
      case 'multiple_choice':
        return 'Múltipla Escolha';
      case 'essay':
        return 'Dissertativa';
      case 'practical':
        return 'Prática';
      default:
        return type;
    }
  };

  const getDifficultyLabel = (level: DifficultyLevel) => {
    switch (level) {
      case 'easy':
        return 'Fácil';
      case 'medium':
        return 'Média';
      case 'hard':
        return 'Difícil';
      default:
        return level;
    }
  };

  if (!userRole) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="Criar Nova Avaliação" userRole={userRole} userName={userName} />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Avaliação</CardTitle>
                  <CardDescription>Defina os detalhes básicos da avaliação</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título da Avaliação</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Avaliação Final de Primeiros Socorros" {...field} />
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
                        <FormLabel>Descrição</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Descreva o objetivo e instruções gerais desta avaliação..." 
                            className="min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="disciplineId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Disciplina</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a disciplina" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {disciplines.map(discipline => (
                                <SelectItem key={discipline.id} value={discipline.id}>
                                  {discipline.name}
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
                      name="classId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Turma</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a turma" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {classes.map(classItem => (
                                <SelectItem key={classItem.id} value={classItem.id}>
                                  {classItem.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data da Avaliação</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duração (minutos)</FormLabel>
                          <FormControl>
                            <Input type="number" min="5" {...field} />
                          </FormControl>
                          <FormDescription>
                            Tempo disponível para a conclusão da avaliação
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Questões</CardTitle>
                  <CardDescription>Adicione questões à avaliação</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="list" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="list">Questões Selecionadas</TabsTrigger>
                      <TabsTrigger value="add">Adicionar Questões</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="list">
                      <div className="min-h-[200px]">
                        {selectedQuestions.length > 0 ? (
                          <div className="space-y-4 mt-4">
                            {selectedQuestions.map((question, index) => (
                              <Card key={question.id} className="bg-white border border-gray-200">
                                <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
                                  <div>
                                    <div className="flex items-center mb-1">
                                      <div className="bg-cbmepi-orange text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                                        {index + 1}
                                      </div>
                                      <span className="text-sm font-medium">
                                        {getQuestionTypeLabel(question.type)} • {getDifficultyLabel(question.difficultyLevel)} • {question.points} pontos
                                      </span>
                                    </div>
                                    <CardTitle className="text-base">{question.text}</CardTitle>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 -mt-1 -mr-2"
                                    onClick={() => removeQuestion(question.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </CardHeader>
                                {question.type === 'multiple_choice' && question.options && (
                                  <CardContent className="p-4 pt-0">
                                    <div className="space-y-2">
                                      {question.options.map((option) => (
                                        <div key={option.id} className="flex items-center space-x-2 text-sm">
                                          <div className={`w-4 h-4 rounded-full ${option.isCorrect ? 'bg-green-500' : 'border border-gray-300'}`}></div>
                                          <span>{option.text}</span>
                                          {option.isCorrect && <span className="text-xs text-green-600">(Correta)</span>}
                                        </div>
                                      ))}
                                    </div>
                                  </CardContent>
                                )}
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
                            <p>Nenhuma questão adicionada</p>
                            <p className="text-sm">Vá para a aba "Adicionar Questões" para selecionar questões</p>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="add">
                      <div className="space-y-4 mt-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input 
                            placeholder="Pesquisar questões..." 
                            className="pl-10"
                            value={questionFilter}
                            onChange={(e) => setQuestionFilter(e.target.value)}
                          />
                        </div>

                        {filteredQuestions.length > 0 ? (
                          <div className="space-y-4">
                            {filteredQuestions.map((question) => (
                              <Card key={question.id} className="bg-white border border-gray-200">
                                <CardHeader className="p-4 pb-2 flex flex-row items-start justify-between">
                                  <div>
                                    <div className="flex items-center mb-1">
                                      <span className="text-sm font-medium">
                                        {getQuestionTypeLabel(question.type)} • {getDifficultyLabel(question.difficultyLevel)} • {question.points} pontos
                                      </span>
                                    </div>
                                    <CardTitle className="text-base">{question.text}</CardTitle>
                                  </div>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => addQuestion(question)}
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Adicionar
                                  </Button>
                                </CardHeader>
                                {question.type === 'multiple_choice' && question.options && (
                                  <CardContent className="p-4 pt-0">
                                    <div className="space-y-2">
                                      {question.options.map((option) => (
                                        <div key={option.id} className="flex items-center space-x-2 text-sm">
                                          <div className="w-4 h-4 rounded-full border border-gray-300"></div>
                                          <span>{option.text}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </CardContent>
                                )}
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center h-[200px] text-gray-400">
                            <p>Nenhuma questão encontrada</p>
                            <p className="text-sm">Tente alterar os filtros de pesquisa</p>
                          </div>
                        )}

                        <div className="mt-4 text-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Criar Nova Questão
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[500px]">
                              <DialogHeader>
                                <DialogTitle>Nova Questão</DialogTitle>
                                <DialogDescription>
                                  Adicione uma nova questão ao banco de questões.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4 py-4">
                                <p className="text-sm text-muted-foreground">
                                  Para criar uma nova questão, use o módulo de Banco de Questões.
                                </p>
                                <Button 
                                  className="w-full" 
                                  onClick={() => navigate('/pedagogical/question-bank')}
                                >
                                  Ir para o Banco de Questões
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Publicação</CardTitle>
                  <CardDescription>Configurações para disponibilizar a avaliação</CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Publicar Avaliação
                          </FormLabel>
                          <FormDescription>
                            Quando publicada, a avaliação ficará disponível para os alunos conforme a data agendada.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/pedagogical/assessments')}
                    disabled={loading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                  <div className="space-x-2">
                    <Button type="submit" onClick={() => form.setValue('isPublished', false)} disabled={loading}>
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <SaveIcon className="mr-2 h-4 w-4" />
                      )}
                      Salvar Rascunho
                    </Button>
                    <Button type="submit" onClick={() => form.setValue('isPublished', true)} disabled={loading}>
                      {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      Publicar
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default AssessmentCreate;
