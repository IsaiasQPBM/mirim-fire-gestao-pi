
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  ArrowLeft, 
  CalendarCheck, 
  BookOpen,
  User, 
  Download as DownloadIcon,
  FileIcon,
  Info,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChartContainer } from '@/components/ui/chart';
import { studentService, assessmentService } from '@/services/api';
import type { Database } from '@/integrations/supabase/types';
import { supabase } from '@/lib/supabase';

type Student = Database['public']['Tables']['students']['Row'] & {
  profiles: {
    full_name: string;
  } | null;
};

type Assessment = Database['public']['Tables']['assessments']['Row'];

type AssessmentResult = Database['public']['Tables']['assessment_results']['Row'];

const StudentBulletin: React.FC = () => {
  const navigate = useNavigate();
  const { studentId } = useParams<{ studentId: string }>();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);

  const loadAttendanceRecords = async (studentId: string) => {
    const { data, error } = await supabase
      .from('attendance')
      .select('id, student_id, class_id, date, status')
      .eq('student_id', studentId);
    if (!error && data) setAttendanceRecords(data);
  };

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

    if (!storedUserRole || !storedUserName) {
      navigate('/login');
      return;
    }

    setUserRole(storedUserRole);
    setUserName(storedUserName);

    if (studentId) {
      loadStudentData();
      loadAttendanceRecords(studentId);
    }
  }, [navigate, studentId]);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load student data
      const studentData = await studentService.getById(studentId!);
      if (!studentData) {
        throw new Error('Aluno não encontrado');
      }
      setStudent(studentData);

      // Load assessments and results
      const [assessmentsData, resultsData] = await Promise.all([
        assessmentService.getAll(),
        assessmentService.getResultsByStudent(studentId!)
      ]);

      setAssessments(assessmentsData || []);
      setResults(resultsData || []);
    } catch (error) {
      console.error('Erro ao carregar dados do aluno:', error);
      setError('Erro ao carregar dados do aluno. Tente novamente.');
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do aluno.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if (!student) return;
    
    // TODO: Integrar com Supabase
    // Mock student data for PDF generation
    // const mockStudent = {
    //   id: student.id,
    //   userId: student.user_id,
    //   fullName: student.profiles?.full_name || 'Nome não disponível',
    //   registrationNumber: student.registration_number,
    //   birthDate: student.birth_date,
    //   email: student.profiles?.email || '',
    //   phone: student.phone,
    //   enrollmentDate: student.enrollment_date,
    //   status: student.status,
    //   address: {
    //     street: 'Rua das Flores',
    //     number: '123',
    //     complement: 'Apt 101',
    //     neighborhood: 'Centro',
    //     city: 'Teresina',
    //     state: 'PI',
    //     zipCode: '64000-000'
    //   },
    //   guardians: [],
    //   classIds: [],
    //   courseIds: [],
    //   documents: [],
    //   notes: student.notes || '',
    //   createdAt: student.created_at,
    //   updatedAt: student.updated_at
    // };

    // Import PDFService dynamically to avoid issues
    // import('@/components/PDFService').then(({ PDFService }) => {
    //   PDFService.generateStudentBulletin(mockStudent);
    //   toast({
    //     title: "Boletim gerado",
    //     description: "O boletim foi preparado para impressão.",
    //   });
    // });
  };

  // Calcular estatísticas reais de frequência
  const calculateStatistics = () => {
    if (!results.length) return { averageGrade: 0, attendanceRate: 0, completedActivities: 0 };

    const totalScore = results.reduce((sum, result) => sum + (result.score || 0), 0);
    const averageGrade = results.length > 0 ? totalScore / results.length : 0;

    // Frequência real
    const totalRecords = attendanceRecords.length;
    const present = attendanceRecords.filter(r => r.status === 'present').length;
    const attendanceRate = totalRecords > 0 ? Math.round((present / totalRecords) * 100) : 0;

    // TODO: Integrar completedActivities reais se necessário
    const completedActivities = 0;

    return { averageGrade, attendanceRate, completedActivities };
  };

  const { averageGrade, attendanceRate, completedActivities } = calculateStatistics();

  // Prepare chart data
  const performanceData = results.map(result => {
    const assessment = assessments.find(a => a.id === result.assessment_id);
    return {
      name: assessment?.title || 'Avaliação',
      nota: result.score || 0
    };
  });

  // TODO: Integrar dados reais de frequência
  const attendanceData = [];
  const attendanceSummary = [
    { name: 'Presente', value: attendanceRate, color: '#10b981' },
    { name: 'Ausente', value: 100 - attendanceRate, color: '#f43f5e' },
  ];

  if (!userRole) return null;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cbmepi-orange" />
            <span className="ml-2 text-gray-600">Carregando dados do aluno...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadStudentData} variant="outline">
              Tentar Novamente
            </Button>
          </div>
        ) : !student ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aluno não encontrado</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <Button variant="outline" onClick={() => navigate('/reports')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-cbmepi-black">Boletim Individual</h1>
                  <p className="text-gray-600">{student.profiles?.full_name || 'Nome não disponível'}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Período Atual</SelectItem>
                    <SelectItem value="last">Período Anterior</SelectItem>
                    <SelectItem value="year">Todo o Ano</SelectItem>
                  </SelectContent>
                </Select>
                
                <Button onClick={generatePDF} className="bg-cbmepi-orange hover:bg-cbmepi-orange/90">
                  <Download className="mr-2 h-4 w-4" />
                  Exportar PDF
                </Button>
              </div>
            </div>

            {/* Student Info */}
            <Card className="mb-6 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-cbmepi-orange" />
                  Informações do Aluno
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-sm text-gray-500">Matrícula</Label>
                    <p className="font-medium">{student.registration_number}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Data de Nascimento</Label>
                    <p className="font-medium">{student.birth_date}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Telefone</Label>
                    <p className="font-medium">{student.phone}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-500">Status</Label>
                    <p className="font-medium capitalize">{student.status}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Summary */}
            <Card className="mb-6 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Resumo de Desempenho</CardTitle>
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Info className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">Este é um resumo do desempenho acadêmico do aluno</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Média Geral</p>
                    <div className="flex items-end">
                      <span className="text-3xl font-bold">{averageGrade.toFixed(1)}</span>
                      <span className="text-sm text-gray-500 ml-2 mb-1">/ 10</span>
                    </div>
                    <Progress className="mt-2 h-2" value={averageGrade * 10} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Frequência</p>
                    <div className="flex items-end">
                      <span className="text-3xl font-bold">{attendanceRate}%</span>
                    </div>
                    <Progress className="mt-2 h-2" value={attendanceRate} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Atividades Concluídas</p>
                    <div className="flex items-end">
                      <span className="text-3xl font-bold">{completedActivities}%</span>
                    </div>
                    <Progress className="mt-2 h-2" value={completedActivities} />
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium mb-4">Desempenho por Disciplina</h4>
                    <div className="h-64">
                      <ChartContainer
                        config={{
                          nota: { color: "#FF6B35" },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis domain={[0, 10]} />
                            <Tooltip />
                            <Bar dataKey="nota" fill="#FF6B35" />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-4">Frequência por Mês</h4>
                    <div className="h-64">
                      <ChartContainer
                        config={{
                          presente: { color: "#10b981" },
                          ausente: { color: "#f43f5e" },
                        }}
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          {isMobile ? (
                            <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                              <Pie
                                data={attendanceSummary}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                              >
                                {attendanceSummary.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          ) : (
                            <BarChart
                              data={attendanceData}
                              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              stackOffset="expand"
                              barSize={20}
                              maxBarSize={30}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="month" />
                              <YAxis />
                              <Tooltip />
                              <Legend />
                              <Bar dataKey="presente" stackId="a" fill="#10b981" />
                              <Bar dataKey="ausente" stackId="a" fill="#f43f5e" />
                            </BarChart>
                          )}
                        </ResponsiveContainer>
                      </ChartContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Grades Table */}
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-cbmepi-orange" />
                  Notas e Avaliações
                </CardTitle>
              </CardHeader>
              <CardContent>
                {results.length > 0 ? (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Disciplina</TableHead>
                          <TableHead>Avaliação</TableHead>
                          <TableHead>Data</TableHead>
                          <TableHead>Nota</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {results.map((result) => {
                          const assessment = assessments.find(a => a.id === result.assessment_id);
                          const score = result.score || 0;
                          const isApproved = score >= 7;
                          
                          return (
                            <TableRow key={result.id}>
                              <TableCell className="font-medium">
                                {assessment?.title || 'Disciplina não encontrada'}
                              </TableCell>
                              <TableCell>{assessment?.title || 'Avaliação não encontrada'}</TableCell>
                              <TableCell>
                                {assessment?.assessment_date ? 
                                  new Date(assessment.assessment_date).toLocaleDateString('pt-BR') : 
                                  'Data não disponível'
                                }
                              </TableCell>
                              <TableCell className={isApproved ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                                {score.toFixed(1)}
                              </TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  isApproved 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {isApproved ? 'Aprovado' : 'Reprovado'}
                                </span>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Nenhuma avaliação encontrada para este aluno.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentBulletin;
