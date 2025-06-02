import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Header from '@/components/Header';
import { toast } from '@/hooks/use-toast';
import { ChevronLeft, Users, Calendar, MapPin, Clock, User, PlusCircle, BookOpen, PenLine } from 'lucide-react';
import { mockClasses, mockLessons } from '@/data/mockCurriculumData';
import { Class, Lesson } from '@/data/curriculumTypes';

const ClassView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [classData, setClassData] = useState<Class | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
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
    
    // Fetch class data
    const foundClass = mockClasses.find(c => c.id === id);
    
    if (!foundClass) {
      toast({
        title: "Turma não encontrada",
        description: "A turma que você está procurando não existe.",
        variant: "destructive"
      });
      navigate('/classes');
      return;
    }
    
    // Get lessons for this class
    const classLessons = mockLessons.filter(lesson => lesson.classId === id);
    
    setClassData(foundClass);
    setLessons(classLessons);
    setLoading(false);
  }, [id, navigate]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Em andamento</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-500">Programada</Badge>;
      case 'concluded':
        return <Badge className="bg-gray-500">Concluída</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const getLessonStatusBadge = (status: string) => {
    switch (status) {
      case 'planned':
        return <Badge className="bg-blue-500">Planejada</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Concluída</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelada</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const isAdmin = userRole === 'admin';
  const isInstructor = userRole === 'admin' || userRole === 'instructor';

  if (loading || !classData) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cbmepi-orange mx-auto"></div>
          <p className="mt-2 text-cbmepi-black">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/classes">Turmas</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{classData.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <Button
              variant="ghost"
              onClick={() => navigate('/classes')}
              className="mb-4"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar para Turmas
            </Button>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Users className="h-6 w-6 text-cbmepi-red mr-2" />
                <h1 className="text-2xl font-bold text-cbmepi-black">{classData.name}</h1>
              </div>
              
              <div className="flex items-center space-x-3">
                {getStatusBadge(classData.status)}
                
                {isAdmin && (
                  <Button 
                    onClick={() => navigate(`/classes/${id}/edit`)}
                    variant="outline" 
                    className="border-cbmepi-orange text-cbmepi-orange hover:bg-cbmepi-orange hover:text-white"
                  >
                    Editar Turma
                  </Button>
                )}
              </div>
            </div>
            
            <p className="text-gray-600 mt-1 font-medium">{classData.courseName}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Período</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-3 pt-0">
                <Calendar className="h-5 w-5 text-cbmepi-orange" />
                <div>
                  <p className="text-sm">{new Date(classData.startDate).toLocaleDateString('pt-BR')} a</p>
                  <p className="text-sm">{new Date(classData.endDate).toLocaleDateString('pt-BR')}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Horários</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-3 pt-0">
                <Clock className="h-5 w-5 text-cbmepi-orange" />
                <p className="text-sm">{classData.timeSchedule}</p>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Local</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-3 pt-0">
                <MapPin className="h-5 w-5 text-cbmepi-orange" />
                <p className="text-sm">{classData.location}</p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="students" className="space-y-6">
            <TabsList className="bg-white border border-gray-200">
              <TabsTrigger value="students">Alunos ({classData.studentIds.length})</TabsTrigger>
              <TabsTrigger value="instructors">Instrutores ({classData.instructorIds.length})</TabsTrigger>
              <TabsTrigger value="lessons">
                Aulas ({lessons.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="students" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-cbmepi-black">Alunos Matriculados</h2>
                
                {isAdmin && (
                  <Button 
                    className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Aluno
                  </Button>
                )}
              </div>
              
              {classData.studentIds.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum aluno matriculado</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Esta turma ainda não possui alunos matriculados.
                  </p>
                  {isAdmin && (
                    <div className="mt-6">
                      <Button 
                        className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Matricular Primeiro Aluno
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <Card className="border border-gray-200 shadow-sm">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Aluno</TableHead>
                          {isAdmin && <TableHead className="text-right">Ações</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {classData.studentIds.map((studentId) => (
                          <TableRow key={studentId}>
                            <TableCell className="font-medium">{studentId}</TableCell>
                            <TableCell>Nome do Aluno (Simulado)</TableCell>
                            {isAdmin && (
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                  Ver Perfil
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="instructors" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-cbmepi-black">Instrutores da Turma</h2>
                
                {isAdmin && (
                  <Button 
                    className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Adicionar Instrutor
                  </Button>
                )}
              </div>
              
              {classData.instructorIds.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <User className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum instrutor designado</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Esta turma ainda não possui instrutores designados.
                  </p>
                  {isAdmin && (
                    <div className="mt-6">
                      <Button 
                        className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Designar Primeiro Instrutor
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <Card className="border border-gray-200 shadow-sm">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Instrutor</TableHead>
                          {isAdmin && <TableHead className="text-right">Ações</TableHead>}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {classData.instructorIds.map((instructorId) => (
                          <TableRow key={instructorId}>
                            <TableCell className="font-medium">{instructorId}</TableCell>
                            <TableCell>Nome do Instrutor (Simulado)</TableCell>
                            {isAdmin && (
                              <TableCell className="text-right">
                                <Button variant="outline" size="sm">
                                  Ver Perfil
                                </Button>
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="lessons" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-cbmepi-black">Aulas Programadas</h2>
                
                {isInstructor && (
                  <Button 
                    className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nova Aula
                  </Button>
                )}
              </div>
              
              {lessons.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma aula programada</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Esta turma ainda não possui aulas programadas.
                  </p>
                  {isInstructor && (
                    <div className="mt-6">
                      <Button 
                        className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                      >
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Programar Primeira Aula
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {lessons.map((lesson) => (
                    <Card key={lesson.id} className="border border-gray-200 shadow-sm">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{lesson.title}</CardTitle>
                            <CardDescription>{new Date(lesson.date).toLocaleDateString('pt-BR')} | {lesson.startTime} - {lesson.endTime}</CardDescription>
                          </div>
                          {getLessonStatusBadge(lesson.status)}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-4">{lesson.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Instrutor:</p>
                            <p>{lesson.instructorId}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Disciplina:</p>
                            <p>{lesson.disciplineId}</p>
                          </div>
                        </div>
                        
                        {lesson.resources.length > 0 && (
                          <div className="mt-4">
                            <p className="text-gray-500 text-sm mb-1">Recursos:</p>
                            <ul className="list-disc list-inside text-sm text-gray-600">
                              {lesson.resources.map((resource, index) => (
                                <li key={index}>{resource}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {isInstructor && (
                          <div className="flex justify-end mt-4 space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-cbmepi-orange border-cbmepi-orange hover:bg-cbmepi-orange hover:text-white"
                            >
                              <PenLine className="mr-2 h-4 w-4" />
                              Editar Aula
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default ClassView;
