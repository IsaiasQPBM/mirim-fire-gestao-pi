
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Clock, Check, Calendar, Users, Play, Loader2 } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { assessmentService, assessmentQuestionService } from '@/services/api';
import { Tables } from '@/integrations/supabase/types';

type Assessment = Tables<'assessments'> & {
  disciplines: Tables<'disciplines'> | null;
  classes: Tables<'classes'> | null;
  profiles: Tables<'profiles'> | null;
};

type QuestionType = 'multiple_choice' | 'essay' | 'practical';
type DifficultyLevel = 'easy' | 'medium' | 'hard';

interface Question {
  id: string;
  text: string;
  type: QuestionType;
  points: number;
  difficultyLevel: DifficultyLevel;
  disciplineId: string;
  options?: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  correctAnswer?: string;
}

const AssessmentView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

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
    if (id) {
      loadAssessment();
    }
  }, [id, navigate]);

  const loadAssessment = async () => {
    try {
      setLoading(true);
      const [assessmentData, assessmentQuestionsData] = await Promise.all([
        assessmentService.getById(id!),
        assessmentQuestionService.getByAssessment(id!)
      ]);
      setAssessment(assessmentData);
      
      // Set questions from assessment
      setQuestions(assessmentQuestionsData.map(aq => ({
        id: aq.questions.id,
        text: aq.questions.text,
        type: aq.questions.type as QuestionType,
        points: aq.points,
        difficultyLevel: aq.questions.difficulty_level as DifficultyLevel,
        disciplineId: aq.questions.discipline_id,
        options: aq.questions.question_options?.map(opt => ({
          id: opt.id,
          text: opt.text,
          isCorrect: opt.is_correct
        })) || [],
        correctAnswer: ''
      })));
    } catch (error) {
      console.error('Erro ao carregar avaliação:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar a avaliação.',
        variant: 'destructive',
      });
      navigate('/pedagogical/assessments');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header title="Visualizar Avaliação" userRole={userRole} userName={userName} />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
              <span className="ml-2 text-gray-500">Carregando avaliação...</span>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!assessment) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="Visualizar Avaliação" userRole={userRole} userName={userName} />
      
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
              {assessment.title}
            </h2>
            <div className="flex gap-2">
              {userRole === 'instructor' && (
                <Button variant="outline" onClick={() => navigate(`/pedagogical/assessments/${id}/edit`)}>
                  Editar
                </Button>
              )}
              {assessment.status === 'published' && (
                <Button onClick={() => navigate(`/pedagogical/assessments/${id}/take`)}>
                  <Play className="mr-2 h-4 w-4" />
                  Iniciar Avaliação
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Status</CardTitle>
              </CardHeader>
              <CardContent>
                {assessment.status === 'published' ? (
                  <Badge className="bg-green-500 text-white">
                    <Check className="h-3 w-3 mr-1" />
                    Publicado
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-amber-600 bg-amber-50 border-amber-200">
                    Rascunho
                  </Badge>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Data</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                <span>{formatDate(assessment.assessment_date)}</span>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Duração</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span>60 minutos</span>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{assessment.description || 'Nenhuma descrição fornecida.'}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Detalhes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Disciplina</h4>
                  <p>{assessment.disciplines?.name || `Disciplina ${assessment.discipline_id}`}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Turma</h4>
                  <p>{assessment.classes?.name || `Turma ${assessment.class_id}`}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Pontuação Total</h4>
                  <p>{assessment.total_points} pontos</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Questões ({questions.length})</CardTitle>
              <CardDescription>
                Lista de questões incluídas nesta avaliação
              </CardDescription>
            </CardHeader>
            <CardContent>
              {questions.length > 0 ? (
                <div className="space-y-4">
                  {questions.map((question, index) => (
                    <div key={question.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">Questão {index + 1}</h4>
                        <Badge variant="outline">{question.points} pontos</Badge>
                      </div>
                      <p className="text-gray-700 mb-3">{question.text}</p>
                      
                      {question.type === 'multiple_choice' && question.options && (
                        <div className="space-y-2">
                          {question.options.map((option) => (
                            <div key={option.id} className="flex items-center space-x-2">
                              <div className={`w-4 h-4 rounded-full border ${
                                option.isCorrect ? 'bg-green-500 border-green-500' : 'border-gray-300'
                              }`} />
                              <span className={option.isCorrect ? 'font-medium text-green-700' : 'text-gray-600'}>
                                {option.text}
                              </span>
                              {option.isCorrect && <Check className="h-4 w-4 text-green-500" />}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                        <span>Tipo: {question.type === 'multiple_choice' ? 'Múltipla Escolha' : 
                              question.type === 'essay' ? 'Dissertativa' : 'Prática'}</span>
                        <span>Dificuldade: {question.difficultyLevel === 'easy' ? 'Fácil' : 
                              question.difficultyLevel === 'medium' ? 'Média' : 'Difícil'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Nenhuma questão adicionada ainda.</p>
                  <p className="text-sm">Adicione questões ao editar a avaliação.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AssessmentView;
