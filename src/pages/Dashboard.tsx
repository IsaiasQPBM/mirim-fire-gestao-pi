
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  ClipboardList,
  MessageSquare,
  Send,
  Bell,
  BarChart3,
  Settings,
  FileText,
  Loader2
} from 'lucide-react';
import { dashboardService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const userRole = localStorage.getItem('userRole') || '';
  const userName = localStorage.getItem('userName') || '';

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalCourses: 0,
    totalAssessments: 0,
    recentStudents: 0,
    activeClasses: 0,
    pendingAssessments: 0
  });

  const quickActions = [
    {
      title: 'Novo Comunicado',
      description: 'Enviar comunicado para alunos',
      icon: Send,
      color: 'bg-orange-500 hover:bg-orange-600',
      action: () => navigate('/communication/announcements/new'),
      roles: ['admin', 'instructor']
    },
    {
      title: 'Nova Mensagem',
      description: 'Enviar mensagem individual',
      icon: MessageSquare,
      color: 'bg-green-500 hover:bg-green-600',
      action: () => navigate('/communication/messages/new'),
      roles: ['admin', 'instructor']
    },
    {
      title: 'Gerenciar Conteúdo',
      description: 'Editar textos e configurações do sistema',
      icon: Settings,
      color: 'bg-purple-500 hover:bg-purple-600',
      action: () => navigate('/admin/content'),
      roles: ['admin']
    },
    {
      title: 'Relatórios',
      description: 'Visualizar relatórios e estatísticas',
      icon: BarChart3,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      action: () => navigate('/reports'),
      roles: ['admin', 'instructor']
    }
  ];

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const filteredActions = quickActions.filter(action => 
    action.roles.includes(userRole)
  );

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const dashboardStats = await dashboardService.getDashboardStats();
      setStats(dashboardStats);
    } catch (error) {
      console.error('Erro ao carregar estatísticas do dashboard:', error);
      setError('Erro ao carregar dados do dashboard');
      toast({
        title: "Erro",
        description: "Não foi possível carregar as estatísticas do dashboard.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen w-full">
        <main className="p-4 md:p-6 w-full">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
                <p className="text-gray-600">Carregando dashboard...</p>
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
              <h3 className="text-red-800 font-medium mb-2">Erro ao carregar dashboard</h3>
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
          {/* Welcome Section */}
          <Card className="rounded-xl bg-white shadow-sm p-5 border border-gray-200">
            <CardContent className="p-0">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                {getGreeting()}, {userName}!
              </h1>
              <p className="text-base text-gray-500">
                Aqui está o resumo do sistema do Pelotão Mirim.
              </p>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredActions.map((action, index) => (
              <Card key={index} className="rounded-xl bg-white shadow-sm p-5 border border-gray-200 hover:shadow-md transition-all duration-200 ease-in-out cursor-pointer" onClick={action.action}>
                <CardHeader className="p-0 mb-4">
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3 transition-all duration-200 ease-in-out`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-800 leading-tight">{action.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <CardDescription className="text-base text-gray-500">{action.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="rounded-xl bg-white shadow-sm p-5 border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0 mb-4">
                <CardTitle className="text-sm font-medium text-gray-600">Total de Alunos</CardTitle>
                <GraduationCap className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-2xl font-bold text-gray-800">{stats.totalStudents}</div>
                <p className="text-xs text-gray-500">+{stats.recentStudents} este mês</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl bg-white shadow-sm p-5 border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0 mb-4">
                <CardTitle className="text-sm font-medium text-gray-600">Turmas Ativas</CardTitle>
                <Users className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-2xl font-bold text-gray-800">{stats.activeClasses}</div>
                <p className="text-xs text-gray-500">de {stats.totalClasses} turmas</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl bg-white shadow-sm p-5 border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0 mb-4">
                <CardTitle className="text-sm font-medium text-gray-600">Cursos Disponíveis</CardTitle>
                <BookOpen className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-2xl font-bold text-gray-800">{stats.totalCourses}</div>
                <p className="text-xs text-gray-500">cursos ativos</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl bg-white shadow-sm p-5 border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 p-0 mb-4">
                <CardTitle className="text-sm font-medium text-gray-600">Avaliações</CardTitle>
                <ClipboardList className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-2xl font-bold text-gray-800">{stats.totalAssessments}</div>
                <p className="text-xs text-gray-500">{stats.pendingAssessments} pendentes</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <DashboardCharts />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
