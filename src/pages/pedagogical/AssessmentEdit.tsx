import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SaveIcon, Plus, Trash2, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { mockAssessments, Assessment, Question, mockQuestions } from '@/data/pedagogicalTypes';

const AssessmentEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<Question[]>([]);
  const [isPublished, setIsPublished] = useState(false);

  const form = useForm({
    defaultValues: {
      title: '',
      description: '',
      disciplineId: '',
      classId: '',
      date: '',
      duration: 60,
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

    // Load assessment data
    const foundAssessment = mockAssessments.find(a => a.id === id);
    
    if (!foundAssessment) {
      navigate('/pedagogical/assessments');
      toast({
        title: "Erro",
        description: "Avaliação não encontrada.",
        variant: "destructive"
      });
      return;
    }
    
    setAssessment(foundAssessment);
    setSelectedQuestions(foundAssessment.questions || []);
    setIsPublished(foundAssessment.isPublished);
    
    // Set form values
    form.reset({
      title: foundAssessment.title,
      description: foundAssessment.description,
      disciplineId: foundAssessment.disciplineId,
      classId: foundAssessment.classId,
      date: foundAssessment.date,
      duration: foundAssessment.duration,
    });
    
    // Load available questions for the discipline
    const disciplineQuestions = mockQuestions.filter(q => 
      q.disciplineId === foundAssessment.disciplineId
    );
    setAvailableQuestions(disciplineQuestions);
  }, [id, navigate, form]);

  const onSubmit = (data: any) => {
    // In a real app, this would be an API call
    console.log('Assessment updated:', {
      ...data,
      questions: selectedQuestions,
      isPublished: isPublished
    });
    
    toast({
      title: "Avaliação atualizada",
      description: "As alterações foram salvas com sucesso."
    });
    
    navigate('/pedagogical/assessments');
  };

  const addQuestion = (question: Question) => {
    setSelectedQuestions(prev => [...prev, question]);
  };

  const removeQuestion = (questionId: string) => {
    setSelectedQuestions(prev => prev.filter(q => q.id !== questionId));
  };

  const calculateTotalPoints = () => {
    return selectedQuestions.reduce((total, question) => total + question.points, 0);
  };

  const togglePublishStatus = () => {
    setIsPublished(!isPublished);
  };

  // Mock data for selects
  const disciplines = [
    { id: '1', name: 'Primeiros Socorros' },
    { id: '2', name: 'Técnicas de Resgate' },
    { id: '3', name: 'Prevenção de Incêndios' },
  ];
  
  const classes = [
    { id: '1', name: 'Turma A - 2023' },
    { id: '2', name: 'Turma B - 2023' },
    { id: '3', name: 'Turma C - 2023' },
  ];

  if (!assessment) return null;
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <Button 
            variant="ghost" 
            className="mb-6"
            onClick={() => navigate('/pedagogical/assessments')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para lista
          </Button>
          
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Editar Avaliação
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="publish-status"
                  checked={isPublished}
                  onCheckedChange={togglePublishStatus}
                />
                <label htmlFor="publish-status" className="text-sm font-medium">
                  {isPublished ? 'Publicado' : 'Rascunho'}
                </label>
              </div>
              <Button onClick={form.handleSubmit(onSubmit)}>
                <SaveIcon className="mr-2 h-4 w-4" />
                Salvar Alterações
              </Button>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Avaliação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título da Avaliação</FormLabel>
                        <FormControl>
                          <Input placeholder="Digite o título da avaliação..." {...field} />
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
                            placeholder="Digite uma descrição para a avaliação..." 
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
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
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
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione a turma" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {classes.map(cls => (
                                <SelectItem key={cls.id} value={cls.id}>
                                  {cls.name}
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
                            <Input type="number" min="1" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Questões ({selectedQuestions.length})</span>
                    <span className="text-sm font-normal">
                      Total de pontos: {calculateTotalPoints()}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="selected">
                    <TabsList className="mb-4">
                      <TabsTrigger value="selected">Questões Selecionadas</TabsTrigger>
                      <TabsTrigger value="available">Adicionar Questões</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="selected">
                      {selectedQuestions.length > 0 ? (
                        <div className="space-y-4">
                          {selectedQuestions.map((question) => (
                            <Card key={question.id} className="border border-gray-200">
                              <CardContent className="p-4">
                                <div className="flex justify-between">
                                  <div className="flex-1">
                                    <p className="font-medium mb-2">{question.text}</p>
                                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                                      <span>Tipo: {question.type === 'multiple_choice' ? 'Múltipla Escolha' : question.type === 'essay' ? 'Dissertativa' : 'Prática'}</span>
                                      <span>Pontos: {question.points}</span>
                                      <span>Dificuldade: {question.difficultyLevel === 'easy' ? 'Fácil' : question.difficultyLevel === 'medium' ? 'Média' : 'Difícil'}</span>
                                    </div>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => removeQuestion(question.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          Nenhuma questão selecionada. Vá para a aba "Adicionar Questões" para incluir questões nesta avaliação.
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="available">
                      {availableQuestions.length > 0 ? (
                        <div className="space-y-4">
                          {availableQuestions.map((question) => (
                            <Card key={question.id} className={`border ${selectedQuestions.some(q => q.id === question.id) ? 'border-blue-300 bg-blue-50' : 'border-gray-200'}`}>
                              <CardContent className="p-4">
                                <div className="flex justify-between">
                                  <div className="flex-1">
                                    <p className="font-medium mb-2">{question.text}</p>
                                    <div className="flex items-center text-sm text-gray-500 space-x-4">
                                      <span>Tipo: {question.type === 'multiple_choice' ? 'Múltipla Escolha' : question.type === 'essay' ? 'Dissertativa' : 'Prática'}</span>
                                      <span>Pontos: {question.points}</span>
                                      <span>Dificuldade: {question.difficultyLevel === 'easy' ? 'Fácil' : question.difficultyLevel === 'medium' ? 'Média' : 'Difícil'}</span>
                                    </div>
                                  </div>
                                  {selectedQuestions.some(q => q.id === question.id) ? (
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                      onClick={() => removeQuestion(question.id)}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  ) : (
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      className="text-green-500 hover:text-green-700 hover:bg-green-50"
                                      onClick={() => addQuestion(question)}
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          Nenhuma questão disponível para esta disciplina. Adicione questões ao banco de questões primeiro.
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
};

export default AssessmentEdit;
