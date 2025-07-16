
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
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, BookOpen, Clock, Users, FileText, Calendar, Edit } from 'lucide-react';
import { disciplineService } from '@/services/api';

const DisciplineView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [discipline, setDiscipline] = useState<any>(null);
  const [relatedClasses, setRelatedClasses] = useState<any[]>([]);
  const [relatedLessons, setRelatedLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

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
    
    // Fetch discipline data from Supabase
    if (id) {
      setLoading(true);
      setError(null);
      
      disciplineService.getById(id)
        .then(data => {
          setDiscipline(data);
          // For now, set empty arrays for related data
          // These would be populated with real data when those services are implemented
          setRelatedClasses([]);
          setRelatedLessons([]);
        })
        .catch(err => {
          setError('Erro ao carregar disciplina: ' + (err.message || err));
          toast({
            title: "Disciplina não encontrada",
            description: "A disciplina que você está procurando não existe.",
            variant: "destructive"
          });
          navigate('/disciplines');
        })
        .finally(() => setLoading(false));
    }
  }, [id, navigate, toast]);

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

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cbmepi-orange mx-auto"></div>
          <p className="mt-2 text-cbmepi-black">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !discipline) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600">Erro ao carregar disciplina</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <Button 
            onClick={() => navigate('/disciplines')}
            className="mt-4 bg-cbmepi-orange hover:bg-cbmepi-orange/90"
          >
            Voltar para Disciplinas
          </Button>
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
                <p className="text-sm">{discipline.theory_hours + discipline.practice_hours} horas</p>
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
                  <p className="text-gray-700">{discipline.description || 'Sem descrição disponível'}</p>
                </CardContent>
              </Card>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Carga Horária Detalhada</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-gray-700">
                      <div className="flex justify-between">
                        <span>Teórica:</span>
                        <span className="font-medium">{discipline.theory_hours} horas</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Prática:</span>
                        <span className="font-medium">{discipline.practice_hours} horas</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Total:</span>
                        <span className="font-bold">{discipline.theory_hours + discipline.practice_hours} horas</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border border-gray-200 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-lg">Informações do Curso</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-gray-700">
                      <div className="flex justify-between">
                        <span>Curso:</span>
                        <span className="font-medium">{discipline.courses?.name || 'Não informado'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span>{getStatusBadge(discipline.status)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Criada em:</span>
                        <span className="font-medium">
                          {discipline.created_at ? new Date(discipline.created_at).toLocaleDateString('pt-BR') : 'Não informado'}
                        </span>
                      </div>
                    </div>
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
