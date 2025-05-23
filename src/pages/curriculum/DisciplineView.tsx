
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
import { ChevronLeft, BookOpen, Clock, Users, FileText, Calendar, Edit } from 'lucide-react';
import { mockDisciplines, mockClasses, mockLessons } from '@/data/mockCurriculumData';
import { Discipline } from '@/data/curriculumTypes';

const DisciplineView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [discipline, setDiscipline] = useState<Discipline | null>(null);
  const [relatedClasses, setRelatedClasses] = useState<any[]>([]);
  const [relatedLessons, setRelatedLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

    if (!storedUserRole || !storedUserName) {
      navigate('/login');
      return;
    }

    setUserRole(storedUserRole);
    setUserName(storedUserName);
    
    // Fetch discipline data
    const foundDiscipline = mockDisciplines.find(d => d.id === id);
    
    if (!foundDiscipline) {
      toast({
        title: "Disciplina não encontrada",
        description: "A disciplina que você está procurando não existe.",
        variant: "destructive"
      });
      navigate('/disciplines');
      return;
    }
    
    // Get related classes and lessons
    const classes = mockClasses.filter(c => c.disciplineIds?.includes(id || ''));
    const lessons = mockLessons.filter(l => l.disciplineId === id);
    
    setDiscipline(foundDiscipline);
    setRelatedClasses(classes);
    setRelatedLessons(lessons);
    setLoading(false);
  }, [id, navigate]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Ativa</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500">Inativa</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-500">Rascunho</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const isAdmin = userRole === 'admin';
  const isInstructor = userRole === 'admin' || userRole === 'instructor';

  if (loading || !discipline) {
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
      <Header 
        title={discipline.name} 
        userRole={userRole} 
        userName={userName} 
      />
      
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
                  <BreadcrumbLink href="/disciplines">Disciplinas</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{discipline.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            
            <Button
              variant="ghost"
              onClick={() => navigate('/disciplines')}
              className="mb-4"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar para Disciplinas
            </Button>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <BookOpen className="h-6 w-6 text-cbmepi-red mr-2" />
                <h1 className="text-2xl font-bold text-cbmepi-black">{discipline.name}</h1>
              </div>
              
              <div className="flex items-center space-x-3">
                {getStatusBadge(discipline.status)}
                
                {isAdmin && (
                  <Button 
                    onClick={() => navigate(`/disciplines/${id}/edit`)}
                    variant="outline" 
                    className="border-cbmepi-orange text-cbmepi-orange hover:bg-cbmepi-orange hover:text-white"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Editar Disciplina
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Carga Horária</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-3 pt-0">
                <Clock className="h-5 w-5 text-cbmepi-orange" />
                <p className="text-sm">{discipline.workload} horas</p>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Turmas Vinculadas</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-3 pt-0">
                <Users className="h-5 w-5 text-cbmepi-orange" />
                <p className="text-sm">{relatedClasses.length} turmas</p>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Aulas Programadas</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center space-x-3 pt-0">
                <Calendar className="h-5 w-5 text-cbmepi-orange" />
                <p className="text-sm">{relatedLessons.length} aulas</p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="bg-white border border-gray-200">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="classes">Turmas ({relatedClasses.length})</TabsTrigger>
              <TabsTrigger value="lessons">Aulas ({relatedLessons.length})</TabsTrigger>
              <TabsTrigger value="materials">Materiais</TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-6">
              <Card className="border border-gray-200 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Descrição da Disciplina</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">{discipline.description}</p>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Objetivos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Desenvolver conhecimentos fundamentais da área</li>
                      <li>Aplicar conceitos teóricos em situações práticas</li>
                      <li>Fomentar o pensamento crítico e analítico</li>
                      <li>Preparar para desafios profissionais futuros</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Metodologia</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-gray-700">
                      <li>Aulas expositivas e dialogadas</li>
                      <li>Exercícios práticos e estudos de caso</li>
                      <li>Trabalhos individuais e em grupo</li>
                      <li>Avaliações formativas e somativas</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="classes" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-cbmepi-black">Turmas que Cursam esta Disciplina</h2>
              </div>
              
              {relatedClasses.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma turma vinculada</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Esta disciplina ainda não está vinculada a nenhuma turma.
                  </p>
                </div>
              ) : (
                <Card className="border border-gray-200 shadow-sm">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome da Turma</TableHead>
                          <TableHead>Período</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {relatedClasses.map((classItem) => (
                          <TableRow key={classItem.id}>
                            <TableCell className="font-medium">{classItem.name}</TableCell>
                            <TableCell>
                              {new Date(classItem.startDate).toLocaleDateString('pt-BR')} - {' '}
                              {new Date(classItem.endDate).toLocaleDateString('pt-BR')}
                            </TableCell>
                            <TableCell>{getStatusBadge(classItem.status)}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => navigate(`/classes/${classItem.id}`)}
                              >
                                Ver Detalhes
                              </Button>
                            </TableCell>
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
                <h2 className="text-lg font-semibold text-cbmepi-black">Aulas da Disciplina</h2>
              </div>
              
              {relatedLessons.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma aula programada</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Não há aulas programadas para esta disciplina.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {relatedLessons.map((lesson) => (
                    <Card key={lesson.id} className="border border-gray-200 shadow-sm">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">{lesson.title}</CardTitle>
                            <CardDescription>
                              {new Date(lesson.date).toLocaleDateString('pt-BR')} | {lesson.startTime} - {lesson.endTime}
                            </CardDescription>
                          </div>
                          <Badge className={
                            lesson.status === 'completed' ? 'bg-green-500' : 
                            lesson.status === 'planned' ? 'bg-blue-500' : 'bg-red-500'
                          }>
                            {lesson.status === 'completed' ? 'Concluída' : 
                             lesson.status === 'planned' ? 'Planejada' : 'Cancelada'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">{lesson.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="materials" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-cbmepi-black">Materiais Didáticos</h2>
                
                {isInstructor && (
                  <Button className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white">
                    <FileText className="mr-2 h-4 w-4" />
                    Adicionar Material
                  </Button>
                )}
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">Materiais em desenvolvimento</h3>
                <p className="mt-1 text-sm text-gray-500">
                  A seção de materiais didáticos estará disponível em breve.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default DisciplineView;
