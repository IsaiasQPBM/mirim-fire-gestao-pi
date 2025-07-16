
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, BookOpen, BookPlus, Users, Calendar, Clock, PieChart, ChevronDown, ChevronUp, Layers, Book, BarChart2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { courseService } from '@/services/api';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const CourseView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [course, setCourse] = useState<any>(null);
  const [disciplines, setDisciplines] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [showDrawer, setShowDrawer] = useState(false);
  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterHours, setFilterHours] = useState('');
  const [viewMode, setViewMode] = useState<'tree' | 'chart' | 'bar'>('tree');

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
    
    // Fetch course data from Supabase
    if (id) {
      setLoading(true);
      setError(null);
      courseService.getById(id)
        .then(data => {
          setCourse(data);
          setDisciplines(data.disciplines || []);
          setClasses(data.classes || []);
        })
        .catch(err => {
          setError('Erro ao carregar curso: ' + (err.message || err));
          toast({
            title: "Curso não encontrado",
            description: "O curso que você está procurando não existe.",
            variant: "destructive"
          });
          navigate('/courses');
        })
        .finally(() => setLoading(false));
    }
  }, [id, navigate, toast]);

  const getTotalHours = () => {
    return disciplines.reduce((total, discipline) => {
      return total + (discipline.theory_hours || 0) + (discipline.practice_hours || 0);
    }, 0);
  };

  const isAdmin = userRole === 'admin';

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

  if (error || !course) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h3 className="text-lg font-medium text-red-600">Erro ao carregar curso</h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <Button 
            onClick={() => navigate('/courses')}
            className="mt-4 bg-cbmepi-orange hover:bg-cbmepi-orange/90"
          >
            Voltar para Cursos
          </Button>
        </div>
      </div>
    );
  }

  const totalHours = disciplines.reduce((acc, d) => acc + (d.theory_hours || 0) + (d.practice_hours || 0), 0);
  const chartLabels = disciplines.map((d: any) => d.name);
  const chartValues = disciplines.map((d: any) => (d.theory_hours || 0) + (d.practice_hours || 0));
  const chartColors = [
    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#F87171', '#34D399', '#FBBF24', '#60A5FA', '#A78BFA', '#F472B6'
  ];
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Carga Horária',
        data: chartValues,
        backgroundColor: chartColors,
        borderWidth: 1,
      },
    ],
  };
  const chartOptions = {
    plugins: {
      legend: { display: true, position: 'bottom', labels: { color: '#374151' } },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context: any) {
            const value = context.parsed || context.raw;
            const percent = totalHours ? ((value / totalHours) * 100).toFixed(1) : 0;
            return `${context.label}: ${value}h (${percent}%)`;
          }
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: '#374151' } },
      y: { ticks: { color: '#374151' }, beginAtZero: true }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header 
        title={course.name} 
        userRole={userRole} 
        userName={userName} 
      />
      
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
              <Badge variant={course.is_active ? 'default' : 'outline'} className={course.is_active ? 'bg-green-500' : ''}>
                {course.is_active ? 'Ativo' : 'Inativo'}
              </Badge>
              
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                <span>{course.total_hours} horas totais</span>
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
                    <p className="text-gray-700">{course.description || 'Sem descrição'}</p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium mb-2">Objetivos</h3>
                    <p className="text-gray-700">{course.objectives || 'Sem objetivos definidos'}</p>
                  </div>
                  
                  {Array.isArray(course.prerequisites) && course.prerequisites.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Pré-requisitos</h3>
                      <ul className="list-disc pl-5 text-gray-700">
                        {course.prerequisites.map((prereq: string, index: number) => (
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
                          {new Date(course.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-500">Última atualização:</span>{' '}
                        <span className="text-gray-700">
                          {new Date(course.updated_at).toLocaleDateString('pt-BR')}
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
              
              {/* Filtros e alternância de visualização */}
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-4">
                <input
                  className="border rounded px-3 py-2 text-sm"
                  placeholder="Buscar disciplina..."
                  value={filterName}
                  onChange={e => setFilterName(e.target.value)}
                />
                <select
                  className="border rounded px-3 py-2 text-sm"
                  value={filterStatus}
                  onChange={e => setFilterStatus(e.target.value)}
                >
                  <option value="">Todos os Status</option>
                  <option value="ativa">Ativa</option>
                  <option value="inativa">Inativa</option>
                </select>
                <input
                  className="border rounded px-3 py-2 text-sm"
                  placeholder="Carga horária mínima"
                  type="number"
                  value={filterHours}
                  onChange={e => setFilterHours(e.target.value)}
                  min={0}
                />
                <Button variant={viewMode === 'tree' ? 'default' : 'outline'} onClick={() => setViewMode('tree')}><Layers className="mr-1 h-4 w-4" />Árvore</Button>
                <Button variant={viewMode === 'chart' ? 'default' : 'outline'} onClick={() => setViewMode('chart')}><PieChart className="mr-1 h-4 w-4" />Gráfico</Button>
              </div>

              {/* Accordion dinâmico para disciplinas */}
              {viewMode === 'tree' && (
                <Accordion type="multiple" className="mb-6">
                  {disciplines
                    .filter(d =>
                      (!filterName || d.name.toLowerCase().includes(filterName.toLowerCase())) &&
                      (!filterStatus || (filterStatus === 'ativa' ? d.is_active : !d.is_active)) &&
                      (!filterHours || ((d.theory_hours || 0) + (d.practice_hours || 0)) >= Number(filterHours))
                    )
                    .map((discipline: any) => (
                      <AccordionItem key={discipline.id} value={discipline.id}>
                        <AccordionTrigger className="flex items-center gap-2">
                          <Book className="h-5 w-5 text-cbmepi-orange" />
                          <span className="font-semibold">{discipline.name}</span>
                          <Badge variant={discipline.is_active ? 'default' : 'outline'} className={discipline.is_active ? 'bg-green-500' : ''}>
                            {discipline.is_active ? 'Ativa' : 'Inativa'}
                          </Badge>
                          <span className="ml-auto flex items-center gap-2 text-xs text-gray-500">
                            Teoria: {discipline.theory_hours || 0}h
                            Prática: {discipline.practice_hours || 0}h
                            <BarChart2 className="h-4 w-4 text-cbmepi-orange" />
                            Total: {(discipline.theory_hours || 0) + (discipline.practice_hours || 0)}h
                          </span>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <div className="mb-2 text-sm text-gray-700 dark:text-gray-200">{discipline.description || 'Sem descrição'}</div>
                            {/* Barra de progresso */}
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
                              <div
                                className="bg-cbmepi-orange h-3 rounded-full transition-all"
                                style={{ width: `${Math.round(((discipline.theory_hours || 0) + (discipline.practice_hours || 0)) / (totalHours || 1) * 100)}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-500 mb-2">
                              {Math.round(((discipline.theory_hours || 0) + (discipline.practice_hours || 0)) / (totalHours || 1) * 100)}% da carga horária do curso
                            </div>
                            {/* Turmas vinculadas */}
                            <div className="mt-2">
                              <span className="font-medium">Turmas vinculadas:</span>
                              <ul className="list-disc pl-5">
                                {classes.filter(c => c.discipline_ids?.includes(discipline.id)).length === 0 ? (
                                  <li className="text-gray-400">Nenhuma turma vinculada</li>
                                ) : (
                                  classes.filter(c => c.discipline_ids?.includes(discipline.id)).map(c => (
                                    <li key={c.id}>{c.name}</li>
                                  ))
                                )}
                              </ul>
                            </div>
                            {/* Cronograma de aulas */}
                            {discipline.schedule && Array.isArray(discipline.schedule) && discipline.schedule.length > 0 && (
                              <div className="mt-2">
                                <span className="font-medium">Cronograma de Aulas:</span>
                                <ul className="list-disc pl-5">
                                  {discipline.schedule.map((item: any, idx: number) => (
                                    <li key={idx} className="text-xs text-gray-600 dark:text-gray-300">
                                      {item.date} - {item.topic} {item.instructor && `- Instrutor: ${item.instructor}`}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              )}

              {/* Visualização em gráfico (exemplo pizza de distribuição de carga horária) */}
              {viewMode === 'chart' && (
                <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow border flex flex-col items-center">
                  <span className="text-gray-500 mb-2">Distribuição de carga horária por disciplina</span>
                  <div className="flex gap-2 mb-4">
                    <Button variant={viewMode === 'chart' ? 'default' : 'outline'} onClick={() => setViewMode('chart')}>Pizza</Button>
                    <Button variant={viewMode === 'bar' ? 'default' : 'outline'} onClick={() => setViewMode('bar')}>Barras</Button>
                  </div>
                  <div className="w-full h-64 flex items-center justify-center">
                    {viewMode === 'chart' ? (
                      <Pie data={chartData} options={chartOptions} />
                    ) : (
                      <Bar data={chartData} options={chartOptions} />
                    )}
                  </div>
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
                  {classes.map((classItem: any) => (
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
                              {new Date(classItem.start_date).toLocaleDateString('pt-BR')} a{' '}
                              {new Date(classItem.end_date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                          <div>
                            <h4 className="text-xs text-gray-500 mb-1">Horário</h4>
                            <p className="text-sm">{classItem.time_schedule}</p>
                          </div>
                          <div>
                            <h4 className="text-xs text-gray-500 mb-1">Local</h4>
                            <p className="text-sm">{classItem.location}</p>
                          </div>
                          <div>
                            <h4 className="text-xs text-gray-500 mb-1">Alunos</h4>
                            <p className="text-sm">{classItem.student_ids?.length || 0} matriculados</p>
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

      {/* Botão para abrir modal/drawer de detalhes */}
      <Dialog open={showDrawer} onOpenChange={setShowDrawer}>
        <DialogTrigger asChild>
          <Button className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white w-full mt-4" onClick={() => setShowDrawer(true)}>
            Visualizar Grade Curricular Completa
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl w-full">
          <DialogHeader>
            <DialogTitle>Grade Curricular Completa - {course.name}</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[70vh] p-2">
            {/* Reaproveitar accordion ou exibir todos os detalhes do curso, disciplinas, turmas, cronograma, etc. */}
            <Accordion type="multiple">
              {disciplines.map((discipline: any) => (
                <AccordionItem key={discipline.id} value={discipline.id}>
                  <AccordionTrigger className="flex items-center gap-2">
                    <Book className="h-5 w-5 text-cbmepi-orange" />
                    <span className="font-semibold">{discipline.name}</span>
                    <Badge variant={discipline.is_active ? 'default' : 'outline'} className={discipline.is_active ? 'bg-green-500' : ''}>
                      {discipline.is_active ? 'Ativa' : 'Inativa'}
                    </Badge>
                    <span className="ml-auto flex items-center gap-2 text-xs text-gray-500">
                      Teoria: {discipline.theory_hours || 0}h
                      Prática: {discipline.practice_hours || 0}h
                      <BarChart2 className="h-4 w-4 text-cbmepi-orange" />
                      Total: {(discipline.theory_hours || 0) + (discipline.practice_hours || 0)}h
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="mb-2 text-sm text-gray-700 dark:text-gray-200">{discipline.description || 'Sem descrição'}</div>
                      <div className="mt-2">
                        <span className="font-medium">Turmas vinculadas:</span>
                        <ul className="list-disc pl-5">
                          {classes.filter(c => c.discipline_ids?.includes(discipline.id)).length === 0 ? (
                            <li className="text-gray-400">Nenhuma turma vinculada</li>
                          ) : (
                            classes.filter(c => c.discipline_ids?.includes(discipline.id)).map(c => (
                              <li key={c.id}>{c.name}</li>
                            ))
                          )}
                        </ul>
                      </div>
                      {/* Cronograma de aulas pode ser exibido aqui, se disponível */}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseView;
