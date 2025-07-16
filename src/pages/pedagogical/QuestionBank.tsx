
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Filter, Trash2, PenSquare, Eye, Check, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { questionService, questionOptionService, disciplineService } from '@/services/api';
import { Tables } from '@/integrations/supabase/types';

// Tipos para questões
type QuestionType = 'multiple_choice' | 'essay' | 'practical';
type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

type Question = Tables<'questions'> & {
  disciplines: Tables<'disciplines'> | null;
  profiles: Tables<'profiles'> | null;
  question_options: Tables<'question_options'>[];
};

interface QuestionFormValues {
  text: string;
  type: QuestionType;
  points: number;
  difficultyLevel: DifficultyLevel;
  disciplineId: string;
  options: QuestionOption[];
  correctAnswer?: string;
}

const QuestionBank = () => {
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [disciplines, setDisciplines] = useState<Tables<'disciplines'>[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<QuestionType | 'all'>('all');
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyLevel | 'all'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit'>('create');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [options, setOptions] = useState<QuestionOption[]>([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  
  const form = useForm<QuestionFormValues>({
    defaultValues: {
      text: '',
      type: 'multiple_choice',
      points: 10,
      difficultyLevel: 'medium',
      disciplineId: '',
      options: []
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
      const [questionsData, disciplinesData] = await Promise.all([
        questionService.getAll(),
        disciplineService.getAll()
      ]);
      setQuestions(questionsData);
      setFilteredQuestions(questionsData);
      setDisciplines(disciplinesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as questões.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Apply filters
    let result = questions;

    if (searchTerm) {
      result = result.filter(question => 
        question.text.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      result = result.filter(question => question.type === typeFilter);
    }

    if (difficultyFilter !== 'all') {
      result = result.filter(question => question.difficulty_level === difficultyFilter);
    }

    setFilteredQuestions(result);
  }, [searchTerm, typeFilter, difficultyFilter, questions]);

  // Handle editing a question
  const handleEditQuestion = (question: Question) => {
    setSelectedQuestion(question);
    setDialogMode('edit');
    
    // Set form values
    form.reset({
      text: question.text,
      type: question.type as QuestionType,
      points: question.points,
      difficultyLevel: question.difficulty_level as DifficultyLevel,
      disciplineId: question.discipline_id,
      correctAnswer: '',
    });
    
    // Set options if they exist
    setOptions(question.question_options.map(opt => ({
      id: opt.id,
      text: opt.text,
      isCorrect: opt.is_correct
    })));
    
    setIsDialogOpen(true);
  };

  // Handle creating a new question
  const handleCreateQuestion = () => {
    setSelectedQuestion(null);
    setDialogMode('create');
    
    // Reset form values
    form.reset({
      text: '',
      type: 'multiple_choice',
      points: 10,
      difficultyLevel: 'medium',
      disciplineId: '',
      options: []
    });
    
    // Reset options
    setOptions([]);
    
    setIsDialogOpen(true);
  };

  // Add a new option for multiple choice questions
  const addOption = () => {
    const newOption: QuestionOption = {
      id: `new-${options.length + 1}`,
      text: '',
      isCorrect: false
    };
    setOptions([...options, newOption]);
  };

  // Update option text
  const updateOptionText = (index: number, text: string) => {
    const newOptions = [...options];
    newOptions[index].text = text;
    setOptions(newOptions);
  };

  // Update if option is correct
  const setCorrectOption = (index: number) => {
    const newOptions = [...options];
    newOptions.forEach((opt, i) => {
      opt.isCorrect = i === index;
    });
    setOptions(newOptions);
  };

  // Remove an option
  const removeOption = (index: number) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const onSubmit = async (data: QuestionFormValues) => {
    try {
      // Add options to data for multiple choice questions
      if (data.type === 'multiple_choice') {
        data.options = options;
        
        // Validate that at least one option is marked as correct
        const hasCorrectOption = options.some(opt => opt.isCorrect);
        if (!hasCorrectOption) {
          toast({
            title: 'Erro na questão',
            description: 'Você precisa marcar pelo menos uma alternativa como correta.',
            variant: 'destructive'
          });
          return;
        }
      }

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

      if (dialogMode === 'create') {
        // Create question
        const questionData = {
          text: data.text,
          type: data.type,
          points: data.points,
          difficulty_level: data.difficultyLevel,
          discipline_id: data.disciplineId,
          created_by: userId,
        };

        const newQuestion = await questionService.create(questionData);

        // Create options if it's a multiple choice question
        if (data.type === 'multiple_choice' && data.options.length > 0) {
          const optionsData = data.options.map((opt, index) => ({
            question_id: newQuestion.id,
            text: opt.text,
            is_correct: opt.isCorrect,
            order_index: index,
          }));

          await questionOptionService.createMany(optionsData);
        }

        toast({
          title: 'Questão criada com sucesso',
          description: 'A questão foi adicionada ao banco de questões.'
        });
      } else {
        // Update existing question
        if (!selectedQuestion) return;

        const questionData = {
          text: data.text,
          type: data.type,
          points: data.points,
          difficulty_level: data.difficultyLevel,
          discipline_id: data.disciplineId,
        };

        await questionService.update(selectedQuestion.id, questionData);

        // Update options if it's a multiple choice question
        if (data.type === 'multiple_choice') {
          // Delete existing options
          await questionOptionService.deleteByQuestion(selectedQuestion.id);

          // Create new options
          if (data.options.length > 0) {
            const optionsData = data.options.map((opt, index) => ({
              question_id: selectedQuestion.id,
              text: opt.text,
              is_correct: opt.isCorrect,
              order_index: index,
            }));

            await questionOptionService.createMany(optionsData);
          }
        }

        toast({
          title: 'Questão atualizada com sucesso',
          description: 'As alterações foram salvas com sucesso.'
        });
      }

      // Reload data
      await loadData();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao salvar questão:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar a questão.',
        variant: 'destructive',
      });
    }
  };

  const getQuestionTypeLabel = (type: string) => {
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

  const getDifficultyLabel = (level: string) => {
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

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'hard':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!userRole) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="Banco de Questões" userRole={userRole} userName={userName} />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Banco de Questões
            </h2>
            <Button onClick={handleCreateQuestion}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Questão
            </Button>
          </div>

          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle>Filtros</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Buscar questões..." 
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full md:w-[200px]">
                  <Select
                    value={typeFilter}
                    onValueChange={(value) => setTypeFilter(value as QuestionType | 'all')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo de Questão" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Tipos</SelectItem>
                      <SelectItem value="multiple_choice">Múltipla Escolha</SelectItem>
                      <SelectItem value="essay">Dissertativa</SelectItem>
                      <SelectItem value="practical">Prática</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-[200px]">
                  <Select
                    value={difficultyFilter}
                    onValueChange={(value) => setDifficultyFilter(value as DifficultyLevel | 'all')}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Dificuldade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas</SelectItem>
                      <SelectItem value="easy">Fácil</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="hard">Difícil</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
                  <span className="ml-2 text-gray-500">Carregando questões...</span>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50%]">Questão</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Dificuldade</TableHead>
                      <TableHead>Pontos</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredQuestions.length > 0 ? (
                      filteredQuestions.map((question) => (
                      <TableRow key={question.id}>
                        <TableCell className="font-medium truncate max-w-[300px]">
                          {question.text}
                        </TableCell>
                        <TableCell>
                          {getQuestionTypeLabel(question.type)}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${getDifficultyColor(question.difficulty_level)} text-white`}>
                            {getDifficultyLabel(question.difficulty_level)}
                          </Badge>
                        </TableCell>
                        <TableCell>{question.points}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                            >
                              <span className="sr-only">Ver</span>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={() => handleEditQuestion(question)}
                            >
                              <span className="sr-only">Editar</span>
                              <PenSquare className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <span className="sr-only">Excluir</span>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-6 text-gray-500">
                        Nenhuma questão encontrada com os filtros selecionados.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      
      {/* Question Creation/Editing Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === 'create' ? 'Criar Nova Questão' : 'Editar Questão'}
            </DialogTitle>
            <DialogDescription>
              {dialogMode === 'create' 
                ? 'Adicione uma nova questão ao banco de questões.' 
                : 'Edite os detalhes da questão selecionada.'}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Enunciado da Questão</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Digite o texto da questão..." 
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Clear options if changing away from multiple choice
                          if (value !== 'multiple_choice') {
                            setOptions([]);
                          } else if (options.length === 0) {
                            // Add two default options if switching to multiple choice
                            setOptions([
                              { id: 'new-1', text: '', isCorrect: true },
                              { id: 'new-2', text: '', isCorrect: false }
                            ]);
                          }
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="multiple_choice">Múltipla Escolha</SelectItem>
                          <SelectItem value="essay">Dissertativa</SelectItem>
                          <SelectItem value="practical">Prática</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="difficultyLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dificuldade</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a dificuldade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="easy">Fácil</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="hard">Difícil</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="points"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pontos</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormDescription>
                        Valor da questão
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

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

              {/* Options for multiple choice questions */}
              {form.watch('type') === 'multiple_choice' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <FormLabel>Alternativas</FormLabel>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={addOption}
                    >
                      <PlusCircle className="h-4 w-4 mr-1" />
                      Adicionar Alternativa
                    </Button>
                  </div>
                  
                  {options.length > 0 ? (
                    <div className="space-y-2">
                      {options.map((option, index) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <div 
                            className={`w-6 h-6 rounded-full cursor-pointer flex items-center justify-center border ${
                              option.isCorrect 
                                ? 'bg-green-500 border-green-500 text-white' 
                                : 'border-gray-300 bg-white'
                            }`}
                            onClick={() => setCorrectOption(index)}
                          >
                            {option.isCorrect && <Check className="h-4 w-4" />}
                          </div>
                          <Input
                            value={option.text}
                            onChange={(e) => updateOptionText(index, e.target.value)}
                            placeholder={`Alternativa ${index + 1}`}
                            className="flex-1"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 px-2"
                            onClick={() => removeOption(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 border rounded-md border-dashed text-gray-400">
                      Clique em "Adicionar Alternativa" para criar opções de resposta
                    </div>
                  )}
                </div>
              )}

              {/* Answer field for essay questions - just for show, not functional in this mockup */}
              {form.watch('type') === 'essay' && (
                <FormItem>
                  <FormLabel>Resposta de Referência (para correção)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Digite uma resposta de referência para auxiliar na correção..." 
                      className="min-h-[100px]"
                    />
                  </FormControl>
                </FormItem>
              )}

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {dialogMode === 'create' ? 'Criar Questão' : 'Salvar Alterações'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default QuestionBank;
