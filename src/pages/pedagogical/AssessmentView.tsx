
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, FileText, Clock, Check, Calendar, Users, Play } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mockAssessments, Assessment } from '@/data/pedagogicalTypes';

const AssessmentView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [assessment, setAssessment] = useState<Assessment | null>(null);

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
      return;
    }
    
    setAssessment(foundAssessment);
  }, [id, navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateTotalPoints = () => {
    return assessment?.questions?.reduce((total, question) => total + question.points, 0) || 0;
  };

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
              {assessment.isPublished && (
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
                {assessment.isPublished ? (
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
                <span>{formatDate(assessment.date)}</span>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">Duração</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-gray-500" />
                <span>{assessment.duration} minutos</span>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Descrição</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{assessment.description}</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Detalhes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Disciplina</h4>
                  <p>Disciplina {assessment.disciplineId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Turma</h4>
                  <p>Turma {assessment.classId}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Pontuação Total</h4>
                  <p>{calculateTotalPoints()} pontos</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Questões ({assessment.questions?.length || 0})</CardTitle>
              <CardDescription>
                Lista de questões incluídas nesta avaliação
              </CardDescription>
            </CardHeader>
            <CardContent>
              {assessment.questions?.length > 0 ? (
                <div className="space-y-6">
                  {assessment.questions.map((question, index) => (
                    <div key={question.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">
                          <span className="font-bold mr-2">Questão {index + 1}.</span>
                          {question.text}
                        </h3>
                        <Badge>{question.points} pts</Badge>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-500 space-x-4 mb-2">
                        <span>Tipo: {question.type === 'multiple_choice' ? 'Múltipla Escolha' : question.type === 'essay' ? 'Dissertativa' : 'Prática'}</span>
                        <span>Dificuldade: {question.difficultyLevel === 'easy' ? 'Fácil' : question.difficultyLevel === 'medium' ? 'Média' : 'Difícil'}</span>
                      </div>
                      
                      {question.type === 'multiple_choice' && question.options && (
                        <div className="mt-3 space-y-2">
                          {question.options.map((option) => (
                            <div 
                              key={option.id}
                              className={`p-2 rounded-md ${option.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}
                            >
                              {option.text}
                              {option.isCorrect && (
                                <Badge className="ml-2 bg-green-500">Correta</Badge>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Esta avaliação ainda não possui questões.
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
