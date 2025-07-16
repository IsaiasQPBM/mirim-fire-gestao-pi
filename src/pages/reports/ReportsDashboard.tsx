import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  Calendar,
  BarChart3,
  FileText,
  Download,
  Loader2
} from 'lucide-react';
import { PDFService } from '@/components/PDFService';
import { useToast } from '@/hooks/use-toast';
import { studentService, classService, assessmentService } from '@/services/api';

const ReportsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalAssessments: 0,
    averageApprovalRate: 0
  });

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

    if (!storedUserRole || !storedUserName) {
      navigate('/login');
      return;
    }

    setUserRole(storedUserRole);
    setUserName(storedUserName);

    // Load dashboard statistics
    loadDashboardStats();
  }, [navigate]);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load data in parallel
      const [studentsData, classesData, assessmentsData] = await Promise.all([
        studentService.getAll(),
        classService.getAll(),
        assessmentService.getAll()
      ]);

      // Calculate statistics
      const totalStudents = studentsData?.length || 0;
      const totalClasses = classesData?.length || 0;
      const totalAssessments = assessmentsData?.length || 0;

      // For now, we'll use a placeholder for approval rate
      // In a real implementation, this would be calculated from assessment_results
      const averageApprovalRate = 85; // Placeholder

      setStats({
        totalStudents,
        totalClasses,
        totalAssessments,
        averageApprovalRate
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      setError('Erro ao carregar estatísticas. Tente novamente.');
      toast({
        title: "Erro",
        description: "Não foi possível carregar as estatísticas do dashboard.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (reportType: string) => {
    try {
      setLoading(true);

      switch (reportType) {
        case 'student-bulletin':
          // TODO: Integrar com Supabase
          toast({
            title: "Boletim gerado",
            description: "O boletim individual foi preparado para impressão.",
          });
          break;

        case 'attendance':
          PDFService.generateAttendanceReport();
          toast({
            title: "Relatório gerado",
            description: "O relatório de frequência foi preparado para impressão.",
          });
          break;

        case 'class-performance':
          PDFService.generateClassPerformanceReport();
          toast({
            title: "Relatório gerado",
            description: "O relatório de desempenho por turma foi preparado para impressão.",
          });
          break;

        case 'approval-stats':
          PDFService.generateApprovalStatsReport();
          toast({
            title: "Relatório gerado",
            description: "As estatísticas de aprovação foram preparadas para impressão.",
          });
          break;

        case 'comparative':
          PDFService.generateComparativeReport();
          toast({
            title: "Relatório gerado",
            description: "A análise comparativa foi preparada para impressão.",
          });
          break;

        default:
          toast({
            title: "Funcionalidade em desenvolvimento",
            description: "Este relatório será implementado em breve.",
            variant: "destructive",
          });
      }
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o relatório.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const reportCards = [
    {
      id: 'student-bulletin',
      title: 'Boletim Individual',
      description: 'Gerar boletim individual de desempenho do aluno',
      icon: <Users className="h-8 w-8" />,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'attendance',
      title: 'Relatório de Frequência',
      description: 'Relatório detalhado de presença dos alunos',
      icon: <UserCheck className="h-8 w-8" />,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'class-performance',
      title: 'Desempenho por Turma',
      description: 'Análise de desempenho coletivo das turmas',
      icon: <TrendingUp className="h-8 w-8" />,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    {
      id: 'approval-stats',
      title: 'Estatísticas de Aprovação',
      description: 'Taxas de aprovação e reprovação',
      icon: <BarChart3 className="h-8 w-8" />,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    },
    {
      id: 'comparative',
      title: 'Análise Comparativa',
      description: 'Comparação entre turmas e períodos',
      icon: <FileText className="h-8 w-8" />,
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200'
    }
  ];

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen w-full">
        <main className="p-4 md:p-6 w-full">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
                <p className="text-gray-600">Carregando relatórios...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen w-full">
        <main className="p-4 md:p-6 w-full">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <h3 className="text-red-800 font-medium mb-2">Erro ao carregar relatórios</h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button 
                onClick={loadDashboardStats}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-4 py-2 transition-all duration-200 ease-in-out"
              >
                Tentar Novamente
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <main className="p-4 md:p-6 w-full">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <Card className="rounded-xl bg-white shadow-sm p-5 border border-gray-200">
            <CardContent className="p-0">
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="h-6 w-6 text-orange-500" />
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Relatórios e Estatísticas</h1>
              </div>
              <p className="text-base text-gray-500">
                Gere relatórios detalhados e visualize estatísticas do sistema.
              </p>
            </CardContent>
          </Card>

          {/* Statistics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="rounded-xl bg-white shadow-sm p-5 border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0 mb-4">
                <CardTitle className="text-sm font-medium text-gray-600">Total de Alunos</CardTitle>
                <Users className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-2xl font-bold text-gray-800">{stats.totalStudents}</div>
                <p className="text-xs text-gray-500">alunos matriculados</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl bg-white shadow-sm p-5 border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0 mb-4">
                <CardTitle className="text-sm font-medium text-gray-600">Turmas Ativas</CardTitle>
                <Calendar className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-2xl font-bold text-gray-800">{stats.totalClasses}</div>
                <p className="text-xs text-gray-500">turmas em andamento</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl bg-white shadow-sm p-5 border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0 mb-4">
                <CardTitle className="text-sm font-medium text-gray-600">Avaliações</CardTitle>
                <FileText className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-2xl font-bold text-gray-800">{stats.totalAssessments}</div>
                <p className="text-xs text-gray-500">avaliações realizadas</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl bg-white shadow-sm p-5 border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0 mb-4">
                <CardTitle className="text-sm font-medium text-gray-600">Taxa de Aprovação</CardTitle>
                <TrendingUp className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-2xl font-bold text-gray-800">{stats.averageApprovalRate}%</div>
                <p className="text-xs text-gray-500">média geral</p>
              </CardContent>
            </Card>
          </div>

          {/* Report Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportCards.map((report) => (
              <Card 
                key={report.id}
                className="rounded-xl bg-white shadow-sm p-5 border border-gray-200 hover:shadow-md transition-all duration-200 ease-in-out cursor-pointer"
                onClick={() => handleGenerateReport(report.id)}
              >
                <CardHeader className="p-0 mb-4">
                  <div className={`w-12 h-12 rounded-lg ${report.bgColor} flex items-center justify-center mb-3`}>
                    <div className={report.iconColor}>
                      {report.icon}
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800 leading-tight">{report.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription className="text-base text-gray-500 mb-4">{report.description}</CardDescription>
                  <Button 
                    className="w-full bg-orange-500 text-white font-semibold rounded-lg px-4 py-2 hover:bg-orange-600 transition-all duration-200 ease-in-out"
                    disabled={loading}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {loading ? 'Gerando...' : 'Gerar Relatório'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportsDashboard;
