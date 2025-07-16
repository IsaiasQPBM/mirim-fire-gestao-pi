
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, BookOpen, Award, AlertTriangle, Activity } from 'lucide-react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from '@/components/ui/chart';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';
// import { mockUsers, User as UserType } from '@/data/userTypes';
// import { mockObservations, mockStudentPerformance, mockAssessments } from '@/data/pedagogicalTypes';

// Define chart config
const chartConfig = {
  performance: {
    label: "Desempenho",
    theme: {
      light: "#FF5722", // Primary orange
      dark: "#FF5722"
    }
  },
  average: {
    label: "Média da Turma",
    theme: {
      light: "#B71C1C", // Secondary red
      dark: "#B71C1C"
    }
  }
};

const StudentDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [student, setStudent] = useState<any | null>(null); // TODO: Integrar com Supabase
  const navigate = useNavigate();
  
  // Prepare the performance data for charts
  const performanceData = []; // TODO: Integrar com Supabase

  // Skills radar data
  const skillsData = [
    { subject: 'Teórico', A: 80, fullMark: 100 },
    { subject: 'Prático', A: 70, fullMark: 100 },
    { subject: 'Liderança', A: 90, fullMark: 100 },
    { subject: 'Trabalho em Equipe', A: 85, fullMark: 100 },
    { subject: 'Disciplina', A: 95, fullMark: 100 },
  ];

  // Disciplinas performance
  const disciplinePerformance = [
    { name: 'Primeiros Socorros', value: 70 },
    { name: 'Técnicas de Resgate', value: 85 },
    { name: 'Prevenção de Incêndios', value: 65 },
    { name: 'Disciplina Militar', value: 90 },
  ];

  // Colors for pie chart
  const COLORS = ['#FF5722', '#FF8A65', '#B71C1C', '#E57373'];

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

    // Get student data
    // const studentData = mockUsers.find(user => user.id === id);
    // if (studentData) {
    //   setStudent(studentData);
    // } else {
    //   navigate('/pedagogical/observations');
    // }
    // TODO: Integrar com Supabase
  }, [id, navigate]);

  const studentObservations = []; // TODO: Integrar com Supabase

  // Count observations by type for the pie chart
  const observationsByType: Record<string, number> = studentObservations.reduce((acc, obs) => {
    acc[obs.type] = (acc[obs.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const observationsTypeData = Object.entries(observationsByType).map(([type, count]) => ({
    name: type === 'behavioral' ? 'Comportamental' :
          type === 'academic' ? 'Acadêmica' :
          type === 'attendance' ? 'Presença' :
          type === 'health' ? 'Saúde' : 'Pessoal',
    value: count
  }));

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-orange-500';
      case 'urgent':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'behavioral':
        return 'bg-blue-500';
      case 'academic':
        return 'bg-purple-500';
      case 'attendance':
        return 'bg-cyan-500';
      case 'health':
        return 'bg-red-500';
      case 'personal':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Calculate overall performance
  const calculateOverallPerformance = () => {
    const performances = []; // TODO: Integrar com Supabase
    if (performances.length === 0) return 0;
    
    const total = performances.reduce((sum, perf) => sum + (perf.score / perf.maxScore), 0);
    return Math.round((total / performances.length) * 100);
  };

  const overallPerformance = calculateOverallPerformance();

  // Find disciplines with low performance (below 70%)
  const lowPerformanceAreas = []; // TODO: Integrar com Supabase

  if (!userRole || !student) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header title={`Dashboard do Aluno: ${student.fullName}`} userRole={userRole} userName={userName} />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Student Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
            <Card className="lg:col-span-1 flex flex-col items-center justify-center p-6">
              <div className="w-32 h-32 rounded-full bg-gray-200 mb-4 flex items-center justify-center">
                {student.profileImage ? (
                  <img 
                    src={student.profileImage} 
                    alt={student.fullName} 
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-16 h-16 text-gray-400" />
                )}
              </div>
              <h3 className="text-xl font-bold mb-1">{student.fullName}</h3>
              <p className="text-gray-500 mb-2">Aluno</p>
              <p className="text-sm text-gray-500 mb-4">
                {new Date(student.birthDate).toLocaleDateString('pt-BR')}
              </p>
              <div className="flex space-x-2">
                <Badge variant="outline" className="bg-cbmepi-orange/10 text-cbmepi-orange border-cbmepi-orange">
                  Turma 2023
                </Badge>
                <Badge variant="outline" className={`${student.status === 'active' ? 'bg-green-100 text-green-800 border-green-800' : 'bg-red-100 text-red-800 border-red-800'}`}>
                  {student.status === 'active' ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle>Desempenho Geral</CardTitle>
                <CardDescription>Visão geral do progresso do aluno</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col items-center justify-center bg-white p-4 rounded-lg border">
                    <div className="text-4xl font-bold text-cbmepi-orange mb-2">{overallPerformance}%</div>
                    <p className="text-sm text-gray-500">Aproveitamento Geral</p>
                  </div>
                  
                  <div className="flex flex-col justify-center bg-white p-4 rounded-lg border">
                    <div className="flex items-center mb-2">
                      <BookOpen className="w-5 h-5 mr-2 text-cbmepi-orange" />
                      <h4 className="font-medium">Áreas de Destaque</h4>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm">• Técnicas de Resgate</p>
                      <p className="text-sm">• Disciplina Militar</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center bg-white p-4 rounded-lg border">
                    <div className="flex items-center mb-2">
                      <AlertTriangle className="w-5 h-5 mr-2 text-cbmepi-red" />
                      <h4 className="font-medium">Áreas para Melhoria</h4>
                    </div>
                    <div className="space-y-1">
                      {lowPerformanceAreas.length > 0 ? (
                        lowPerformanceAreas.map((area, index) => (
                          <p key={index} className="text-sm">• {area}</p>
                        ))
                      ) : (
                        <p className="text-sm">Não há áreas críticas identificadas.</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Tabs */}
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="performance">Desempenho</TabsTrigger>
              <TabsTrigger value="observations">Observações</TabsTrigger>
              <TabsTrigger value="assessments">Avaliações</TabsTrigger>
            </TabsList>
            
            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Evolução de Desempenho</CardTitle>
                  <CardDescription>Acompanhamento do desempenho do aluno ao longo do tempo</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ChartContainer config={chartConfig}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 100]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Line 
                        type="monotone" 
                        dataKey="performance"
                        name="performance"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="average" 
                        name="average"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Desempenho por Disciplina</CardTitle>
                    <CardDescription>Comparação de desempenho entre diferentes disciplinas</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={disciplinePerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#FF5722">
                          {disciplinePerformance.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Distribuição de Observações</CardTitle>
                    <CardDescription>Tipos de observações registradas</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={observationsTypeData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {observationsTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Observations Tab */}
            <TabsContent value="observations">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Observações Pedagógicas</CardTitle>
                    <CardDescription>Histórico de observações registradas para o aluno</CardDescription>
                  </div>
                  <Button onClick={() => navigate('/pedagogical/observations/create')}>
                    Nova Observação
                  </Button>
                </CardHeader>
                <CardContent>
                  {studentObservations.length > 0 ? (
                    <div className="space-y-4">
                      {studentObservations.map((observation) => (
                        <div key={observation.id} className="border rounded-md p-4">
                          <div className="flex flex-wrap items-start justify-between mb-2">
                            <div className="flex items-center mb-2 sm:mb-0">
                              <div className="mr-3 text-sm text-gray-500">
                                {new Date(observation.date).toLocaleDateString('pt-BR')}
                              </div>
                              <Badge className={`${getTypeBadgeColor(observation.type)} text-white`}>
                                {observation.type === 'behavioral' && 'Comportamental'}
                                {observation.type === 'academic' && 'Acadêmica'}
                                {observation.type === 'attendance' && 'Presença'}
                                {observation.type === 'health' && 'Saúde'}
                                {observation.type === 'personal' && 'Pessoal'}
                              </Badge>
                            </div>
                            <Badge className={`${getPriorityBadgeColor(observation.priority)} text-white mt-2 sm:mt-0`}>
                              {observation.priority === 'low' && 'Baixa'}
                              {observation.priority === 'medium' && 'Média'}
                              {observation.priority === 'high' && 'Alta'}
                              {observation.priority === 'urgent' && 'Urgente'}
                            </Badge>
                          </div>
                          <p className="text-gray-800 mb-2">{observation.description}</p>
                          <div className="text-xs text-gray-500">
                            Registrado por: {/* TODO: Integrar com Supabase */}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <Activity className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma observação encontrada</h3>
                      <p className="text-gray-500">
                        Não há observações pedagógicas registradas para este aluno.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Assessments Tab */}
            <TabsContent value="assessments">
              <Card>
                <CardHeader>
                  <CardTitle>Avaliações e Resultados</CardTitle>
                  <CardDescription>Histórico de avaliações e desempenho do aluno</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* TODO: Integrar com Supabase */}
                  <div className="text-center py-10">
                    <Award className="h-10 w-10 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Sem avaliações</h3>
                    <p className="text-gray-500">
                      O aluno ainda não realizou nenhuma avaliação.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
