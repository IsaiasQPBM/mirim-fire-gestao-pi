
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Clock, Save, ArrowLeft, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
// import { mockAssessments, Assessment, StudentAnswer } from '@/data/pedagogicalTypes';

type Assessment = { id: string; title: string; duration: number; questions: any[]; };
type StudentAnswer = { questionId: string; answer: string | string[]; };

const AssessmentTake = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<StudentAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [startTime] = useState(new Date());
  
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
    // TODO: Integrar com Supabase
    const foundAssessment = undefined;
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
    
    // Initialize answers array
    if (foundAssessment.questions) {
      const initialAnswers = foundAssessment.questions.map(question => ({
        questionId: question.id,
        answer: question.type === 'multiple_choice' ? '' : '',
      }));
      setAnswers(initialAnswers);
    }
    
    // Set timer
    setTimeRemaining(foundAssessment.duration * 60); // Convert minutes to seconds
  }, [id, navigate]);
  
  useEffect(() => {
    // Timer countdown
    if (timeRemaining <= 0) {
      handleSubmit();
      return;
    }
    
    const timer = setInterval(() => {
      setTimeRemaining(prevTime => prevTime - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeRemaining]);
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const handleAnswerChange = (questionId: string, answer: string | string[]) => {
    setAnswers(prevAnswers => 
      prevAnswers.map(a => 
        a.questionId === questionId ? { ...a, answer } : a
      )
    );
  };
  
  const handleNextQuestion = () => {
    if (assessment?.questions && currentQuestionIndex < assessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleSubmit = () => {
    const endTime = new Date();
    const timeTaken = (endTime.getTime() - startTime.getTime()) / 1000; // in seconds
    
    // In a real app, this would be an API call
    console.log('Assessment submitted:', {
      assessmentId: id,
      answers,
      startTime,
      endTime,
      timeTaken
    });
    
    toast({
      title: "Avaliação enviada",
      description: "Sua avaliação foi enviada com sucesso."
    });
    
    // Navigate to results page with a mock result ID
    navigate(`/pedagogical/results/mock-result-id`);
  };
  
  if (!assessment || !assessment.questions) return null;
  
  const currentQuestion = assessment.questions[currentQuestionIndex];
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="Realizando Avaliação" userRole={userRole} userName={userName} />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {assessment.title}
            </h2>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-red-500 mr-2" />
              <span className="font-mono">Tempo restante: {formatTime(timeRemaining)}</span>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <div>
                <span className="font-medium">Progresso: </span>
                <span>{currentQuestionIndex + 1} de {assessment.questions.length} questões</span>
              </div>
              <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500" 
                  style={{ 
                    width: `${((currentQuestionIndex + 1) / assessment.questions.length) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Questão {currentQuestionIndex + 1}</CardTitle>
                  <CardDescription>
                    {currentQuestion.type === 'multiple_choice' ? 'Múltipla Escolha' : 
                     currentQuestion.type === 'essay' ? 'Dissertativa' : 'Prática'}
                  </CardDescription>
                </div>
                <Badge>{currentQuestion.points} pontos</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-lg font-medium">
                {currentQuestion.text}
              </div>
              
              {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                <RadioGroup 
                  value={answers.find(a => a.questionId === currentQuestion.id)?.answer as string}
                  onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
                  className="space-y-3"
                >
                  {currentQuestion.options.map((option) => (
                    <div key={option.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <Label htmlFor={option.id} className="text-base">
                        {option.text}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
              
              {currentQuestion.type === 'essay' && (
                <Textarea 
                  placeholder="Digite sua resposta aqui..."
                  className="min-h-[200px]"
                  value={answers.find(a => a.questionId === currentQuestion.id)?.answer as string}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                />
              )}
              
              {currentQuestion.type === 'practical' && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
                  <p className="text-yellow-800">
                    Esta é uma questão prática. Siga as instruções do avaliador para realizá-la.
                  </p>
                </div>
              )}
              
              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Anterior
                </Button>
                
                {currentQuestionIndex === assessment.questions.length - 1 ? (
                  <Button onClick={handleSubmit}>
                    <Save className="mr-2 h-4 w-4" />
                    Enviar Avaliação
                  </Button>
                ) : (
                  <Button onClick={handleNextQuestion}>
                    Próxima
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AssessmentTake;
