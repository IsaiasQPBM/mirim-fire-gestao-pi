
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle, XCircle, Award } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
// import { mockAssessments, StudentAssessmentResult, Assessment } from '@/data/pedagogicalTypes';

const ResultsView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  
  // Mock result data - in a real app, this would come from an API
  const [result, setResult] = useState<any>({
    id: 'mock-result-id',
    studentId: '4',
    assessmentId: '1',
    startTime: new Date().toISOString(),
    endTime: new Date().toISOString(),
    score: 75,
    totalPoints: 100,
    answers: [
      {
        questionId: '1',
        answer: '1b',
        score: 10,
        feedback: 'Resposta correta'
      },
      {
        questionId: '2',
        answer: 'Uma resposta dissertativa de exemplo...',
        score: 12,
        feedback: 'Boa resposta, mas faltou mencionar alguns pontos importantes.'
      }
    ],
    feedback: 'Bom desempenho geral. Continue estudando!',
    status: 'graded'
  });
  
  const [assessment, setAssessment] = useState<any>(null);

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

    // In a real app, we would fetch the result by ID
    // For this mock, we'll use hardcoded data
    
    // Load related assessment
    // TODO: Integrar com Supabase
  }, [id, navigate, result.assessmentId]);
  
  const getScorePercentage = () => {
    return (result.score / result.totalPoints) * 100;
  };
  
  const getScoreColor = () => {
    const percentage = getScorePercentage();
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  const getScoreMessage = () => {
    const percentage = getScorePercentage();
    if (percentage >= 80) return 'Excelente! Continue assim.';
    if (percentage >= 60) return 'Bom trabalho! Ainda há espaço para melhorar.';
    return 'Você precisa estudar mais.';
  };
  
  if (!assessment) return null;
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title="Resultado da Avaliação" userRole={userRole} userName={userName} />
      
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
              Resultado: {assessment.title}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-yellow-500" />
                  Desempenho
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-8">
                  <div className="text-5xl font-bold mb-2">
                    {result.score}/{result.totalPoints}
                  </div>
                  <Progress 
                    value={getScorePercentage()} 
                    className={`h-2 w-full ${getScoreColor()}`} 
                  />
                  <p className="text-sm mt-2 text-gray-600">
                    {getScorePercentage().toFixed(0)}% de acertos
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                  <p className="font-medium text-gray-700">{getScoreMessage()}</p>
                  {result.feedback && (
                    <p className="mt-2 text-gray-600">{result.feedback}</p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Detalhes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Data</h4>
                  <p>{new Date(result.endTime).toLocaleDateString('pt-BR')}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Tempo de conclusão</h4>
                  <p>
                    {Math.floor((new Date(result.endTime).getTime() - new Date(result.startTime).getTime()) / 60000)} minutos
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  <Badge className="bg-green-500">Corrigido</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Detalhamento por Questão</CardTitle>
              <CardDescription>
                Veja como você se saiu em cada questão
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assessment.questions?.map((question: any, index: number) => {
                const answer = result.answers.find((a: any) => a.questionId === question.id);
                const isCorrect = answer && (
                  question.type === 'multiple_choice' 
                    ? question.options?.find((o: any) => o.id === answer.answer)?.isCorrect
                    : (answer.score || 0) >= question.points * 0.7
                );
                
                return (
                  <div key={question.id} className="border-b pb-6 mb-6 last:border-b-0 last:mb-0 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">
                        <span className="font-bold mr-2">Questão {index + 1}.</span>
                        {question.text}
                      </h3>
                      <div className="flex items-center">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <Badge className={isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {answer ? `${answer.score || 0}/${question.points}` : '0/'+question.points}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 rounded-md mb-3">
                      <h4 className="text-sm font-medium mb-1">Sua resposta:</h4>
                      {question.type === 'multiple_choice' && question.options && answer ? (
                        <p>{question.options.find((o: any) => o.id === answer.answer)?.text || 'Sem resposta'}</p>
                      ) : (
                        <p>{(answer?.answer as string) || 'Sem resposta'}</p>
                      )}
                    </div>
                    
                    {question.type === 'multiple_choice' && question.options && (
                      <div className="bg-green-50 p-3 rounded-md mb-3">
                        <h4 className="text-sm font-medium text-green-700 mb-1">Resposta correta:</h4>
                        <p>{question.options.find((o: any) => o.isCorrect)?.text}</p>
                      </div>
                    )}
                    
                    {answer?.feedback && (
                      <div className="mt-2">
                        <h4 className="text-sm font-medium">Feedback do instrutor:</h4>
                        <p className="text-gray-700">{answer.feedback}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ResultsView;
