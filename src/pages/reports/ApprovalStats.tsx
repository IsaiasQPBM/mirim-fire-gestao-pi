
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, Users, Award, AlertTriangle, Download, Loader2 } from 'lucide-react';
import { assessmentService, courseService, disciplineService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Assessment = Database['public']['Tables']['assessments']['Row'];

type AssessmentResult = Database['public']['Tables']['assessment_results']['Row'];

type Course = Database['public']['Tables']['courses']['Row'];

type Discipline = Database['public']['Tables']['disciplines']['Row'];

const ApprovalStats: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [results, setResults] = useState<AssessmentResult[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [disciplines, setDisciplines] = useState<Discipline[]>([]);

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

    if (!storedUserRole || !storedUserName) {
      navigate('/login');
      return;
    }

    setUserRole(storedUserRole);
    setUserName(storedUserName);

    // Load data
    loadStatsData();
  }, [navigate]);

  const loadStatsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load data in parallel
      const [assessmentsData, resultsData, coursesData, disciplinesData] = await Promise.all([
        assessmentService.getAll(),
        assessmentService.getAllResults(),
        courseService.getAll(),
        disciplineService.getAll()
      ]);

      setAssessments(assessmentsData || []);
      setResults(resultsData || []);
      setCourses(coursesData || []);
      setDisciplines(disciplinesData || []);
    } catch (error) {
      console.error('Erro ao carregar dados de estatísticas:', error);
      setError('Erro ao carregar dados de estatísticas. Tente novamente.');
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados de estatísticas.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    console.log('Generating approval statistics PDF...');
    toast({
      title: "Relatório gerado",
      description: "As estatísticas de aprovação foram preparadas para impressão.",
    });
  };

  // Função utilitária para obter o mês/ano de uma data
  function getMonthYear(dateStr: string) {
    const date = new Date(dateStr);
    return `${date.toLocaleString('pt-BR', { month: 'short' })}/${date.getFullYear()}`;
  }

  // Calculate approval statistics
  const calculateApprovalStats = () => {
    if (!results.length) {
      return {
        totalStudents: 0,
        approved: 0,
        failed: 0,
        approvalRate: 0,
        courseStats: [],
        monthlyData: [],
        pieData: []
      };
    }

    const totalStudents = results.length;
    const approved = results.filter(result => (result.score || 0) >= 7).length;
    const failed = totalStudents - approved;
    const approvalRate = Math.round((approved / totalStudents) * 100);

    // Calculate by course
    const courseStats = courses.map(course => {
      const courseAssessments = assessments.filter(a => a.course_id === course.id);
      const courseResults = results.filter(r => 
        courseAssessments.some(a => a.id === r.assessment_id)
      );
      
      const courseApproved = courseResults.filter(r => (r.score || 0) >= 7).length;
      const courseTotal = courseResults.length;
      
      return {
        course: course.name,
        approved: courseApproved,
        failed: courseTotal - courseApproved,
        total: courseTotal,
        approvalRate: courseTotal > 0 ? Math.round((courseApproved / courseTotal) * 100) : 0
      };
    });

    // Agrupar resultados por mês
    const monthlyMap: Record<string, { approved: number; failed: number }> = {};
    results.forEach(result => {
      const dateKey = getMonthYear(result.graded_at || result.created_at);
      if (!monthlyMap[dateKey]) monthlyMap[dateKey] = { approved: 0, failed: 0 };
      if ((result.score || 0) >= 7) {
        monthlyMap[dateKey].approved++;
      } else {
        monthlyMap[dateKey].failed++;
      }
    });
    const monthlyData = Object.entries(monthlyMap).map(([month, data]) => ({
      month,
      approved: data.approved,
      failed: data.failed
    }));

    const pieData = [
      { name: 'Aprovados', value: approved, color: '#22c55e' },
      { name: 'Reprovados', value: failed, color: '#ef4444' },
    ];

    return {
      totalStudents,
      approved,
      failed,
      approvalRate,
      courseStats,
      monthlyData,
      pieData
    };
  };

  const stats = calculateApprovalStats();

  if (!userRole) return null;

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cbmepi-orange" />
            <span className="ml-2 text-gray-600">Carregando estatísticas...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadStatsData} variant="outline">
              Tentar Novamente
            </Button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-4">
                <TrendingUp className="h-6 w-6 text-cbmepi-red" />
                <h1 className="text-2xl font-bold text-cbmepi-black">Estatísticas de Aprovação</h1>
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

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total de Avaliações</p>
                      <p className="text-2xl font-bold">{stats.totalStudents}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Award className="h-8 w-8 text-green-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Aprovados</p>
                      <p className="text-2xl font-bold">{stats.approved}</p>
                      <Badge className="bg-green-100 text-green-800">
                        {stats.approvalRate}% de aprovação
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Reprovados</p>
                      <p className="text-2xl font-bold">{stats.failed}</p>
                      <Badge className="bg-red-100 text-red-800">
                        {100 - stats.approvalRate}% de reprovação
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <TrendingUp className="h-8 w-8 text-purple-500" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Taxa de Aprovação</p>
                      <p className="text-2xl font-bold">{stats.approvalRate}%</p>
                      <Badge className="bg-purple-100 text-purple-800">
                        Meta: 85%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Approval by Course */}
              <Card>
                <CardHeader>
                  <CardTitle>Aprovação por Curso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stats.courseStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="course" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="approvalRate" fill="#22c55e" name="Taxa de Aprovação (%)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Overall Approval Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição Geral</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={stats.pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {stats.pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Monthly Trend */}
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Tendência Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="approved" 
                        stroke="#22c55e" 
                        strokeWidth={3}
                        name="Aprovados"
                      />
                      <Line 
                        type="monotone" 
                        dataKey="failed" 
                        stroke="#ef4444" 
                        strokeWidth={3}
                        name="Reprovados"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Course Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas Detalhadas por Curso</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Curso
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total de Avaliações
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Aprovados
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Reprovados
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Taxa de Aprovação
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {stats.courseStats.map((course, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {course.course}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {course.total}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                            {course.approved}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600 font-medium">
                            {course.failed}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {course.approvalRate}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge className={
                              course.approvalRate >= 85 ? 'bg-green-100 text-green-800' :
                              course.approvalRate >= 70 ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {course.approvalRate >= 85 ? 'Excelente' :
                               course.approvalRate >= 70 ? 'Bom' : 'Atenção'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default ApprovalStats;
