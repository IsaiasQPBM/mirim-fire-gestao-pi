import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { toast } from '@/hooks/use-toast';
import { ChevronLeft, BookOpen, BookPlus, Users, Calendar, Clock } from 'lucide-react';
import { mockCourses, mockDisciplines, mockClasses } from '@/data/mockCurriculumData';
import { Course, Discipline, Class } from '@/data/curriculumTypes';

const CourseView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [course, setCourse] = useState<Course | null>(null);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
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
    
    // Fetch course data
    const foundCourse = mockCourses.find(c => c.id === id);
    
    if (!foundCourse) {
      toast({
        title: "Curso não encontrado",
        description: "O curso que você está procurando não existe.",
        variant: "destructive"
      });
      navigate('/courses');
      return;
    }
    
    // Get disciplines for this course
    const courseDisciplines = mockDisciplines.filter(d => d.courseId === id);
    
    // Get classes for this course
    const courseClasses = mockClasses.filter(c => c.courseId === id);
    
    setCourse(foundCourse);
    setDisciplines(courseDisciplines);
    setClasses(courseClasses);
    setLoading(false);
  }, [id, navigate]);

  const getTotalHours = () => {
    return disciplines.reduce((total, discipline) => {
      return total + discipline.theoryHours + discipline.practiceHours;
    }, 0);
  };

  const isAdmin = userRole === 'admin';

  if (loading || !course) {
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
            <Button
              variant="ghost"
              onClick={() => navigate('/courses')}
              className="mb-4"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar para Cursos
            </Button>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <BookOpen className="h-6 w-6 text-cbmepi-red mr-2" />
                <h1 className="text-2xl font-bold text-cbmepi-black">{course.name}</h1>
              </div>
              
              {isAdmin && (
                <Button 
                  onClick={() => navigate(`/courses/${id}/edit`)}
                  variant="outline" 
                  className="border-cbmepi-orange text-cbmepi-orange hover:bg-cbmepi-orange hover:text-white"
                >
                  Editar Curso
                </Button>
              )}
            </div>
            
            <div className="flex items-center mt-2 space-x-4">
              <Badge variant={course.isActive ? 'default' : 'outline'} className={course.isActive ? 'bg-green-500' : ''}>
                {course.isActive ? 'Ativo' : 'Inativo'}
              </Badge>
              
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>{course.totalHours} horas totais</span>
              </div>
            </div>
          </div>
          
          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="bg-white border border-gray-200">
              <TabsTrigger value="info">Informações</TabsTrigger>
              <TabsTrigger value="disciplines">
                Disciplinas ({disciplines.length})
              </TabsTrigger>
              <TabsTrigger value="classes">
                Turmas ({classes.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="info" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Sobre o Curso</CardTitle>
                  <CardDescription>
                    Detalhes e características do curso
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Descrição</h3>
                    <p className="text-gray-700">{course.description}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Objetivos</h3>
                    <p className="text-gray-700">{course.objectives}</p>
                  </div>
                  
                  {course.prerequisites.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Pré-requisitos</h3>
                      <ul className="list-disc pl-5 text-gray-700">
                        {course.prerequisites.map((prereq, index) => (
                          <li key={index}>{prereq}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="pt-4">
                    <h3 className="font-medium">Informações adicionais</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      <div className="text-sm">
                        <span className="text-gray-500">Data de criação:</span>{' '}
                        <span className="text-gray-700">
                          {new Date(course.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Última atualização:</span>{' '}
                        <span className="text-gray-700">
                          {new Date(course.updatedAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="disciplines" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-cbmepi-black">Disciplinas do Curso</h2>
                
                {isAdmin && (
                  <Button 
                    onClick={() => navigate('/disciplines/create', { state: { courseId: id } })}
                    className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                  >
                    <BookPlus className="mr-2 h-4 w-4" />
                    Nova Disciplina
                  </Button>
                )}
              </div>
              
              {disciplines.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma disciplina cadastrada</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Este curso ainda não possui disciplinas cadastradas.
                  </p>
                  {isAdmin && (
                    <div className="mt-6">
                      <Button 
                        onClick={() => navigate('/disciplines/create', { state: { courseId: id } })}
                        className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                      >
                        <BookPlus className="mr-2 h-4 w-4" />
                        Adicionar Primeira Disciplina
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {disciplines.map((discipline) => (
                    <Card key={discipline.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{discipline.name}</CardTitle>
                          <Badge variant={discipline.isActive ? 'default' : 'outline'} className={discipline.isActive ? 'bg-green-500' : ''}>
                            {discipline.isActive ? 'Ativa' : 'Inativa'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{discipline.description}</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Teoria: {discipline.theoryHours}h</span>
                          <span>Prática: {discipline.practiceHours}h</span>
                          <span>Total: {discipline.theoryHours + discipline.practiceHours}h</span>
                        </div>
                        
                        {isAdmin && (
                          <div className="mt-4 flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => navigate(`/disciplines/${discipline.id}/edit`)}
                              className="text-cbmepi-orange border-cbmepi-orange hover:bg-cbmepi-orange hover:text-white"
                            >
                              Editar
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-cbmepi-black">
                    Carga horária total das disciplinas:
                  </span>
                  <span className="font-medium text-cbmepi-orange">
                    {getTotalHours()} horas
                  </span>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="classes" className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-cbmepi-black">Turmas do Curso</h2>
                
                {isAdmin && (
                  <Button 
                    onClick={() => navigate('/classes/create', { state: { courseId: id } })}
                    className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Nova Turma
                  </Button>
                )}
              </div>
              
              {classes.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma turma cadastrada</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Este curso ainda não possui turmas em andamento ou programadas.
                  </p>
                  {isAdmin && (
                    <div className="mt-6">
                      <Button 
                        onClick={() => navigate('/classes/create', { state: { courseId: id } })}
                        className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        Criar Primeira Turma
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {classes.map((classItem) => (
                    <Card key={classItem.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-center">
                          <Link to={`/classes/${classItem.id}`} className="hover:underline">
                            <CardTitle className="text-lg">{classItem.name}</CardTitle>
                          </Link>
                          <Badge 
                            className={
                              classItem.status === 'active' ? 'bg-green-500' :
                              classItem.status === 'upcoming' ? 'bg-blue-500' : 'bg-gray-500'
                            }
                          >
                            {classItem.status === 'active' ? 'Em andamento' :
                             classItem.status === 'upcoming' ? 'Programada' : 'Concluída'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div>
                            <h4 className="text-xs text-gray-500 mb-1">Período</h4>
                            <p className="text-sm">
                              {new Date(classItem.startDate).toLocaleDateString('pt-BR')} a{' '}
                              {new Date(classItem.endDate).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xs text-gray-500 mb-1">Horário</h4>
                            <p className="text-sm">{classItem.timeSchedule}</p>
                          </div>
                          <div>
                            <h4 className="text-xs text-gray-500 mb-1">Local</h4>
                            <p className="text-sm">{classItem.location}</p>
                          </div>
                          <div>
                            <h4 className="text-xs text-gray-500 mb-1">Alunos</h4>
                            <p className="text-sm">{classItem.studentIds.length} matriculados</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-end mt-2 space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigate(`/classes/${classItem.id}`)}
                          >
                            Detalhes
                          </Button>
                          
                          {isAdmin && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => navigate(`/classes/${classItem.id}/edit`)}
                              className="text-cbmepi-orange border-cbmepi-orange hover:bg-cbmepi-orange hover:text-white"
                            >
                              Editar
                            </Button>
                          )}
                        </div>
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

export default CourseView;
