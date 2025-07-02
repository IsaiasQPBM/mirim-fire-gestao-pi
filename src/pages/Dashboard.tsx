
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
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
  FileText
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole') || '';
  const userName = localStorage.getItem('userName') || '';

  const quickActions = [
    {
      title: 'Novo Comunicado',
      description: 'Enviar comunicado para alunos',
      icon: Send,
      color: 'bg-blue-500 hover:bg-blue-600',
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

  return (
    <div className="bg-gray-50 min-h-screen w-full">
      <Header title="Dashboard" userRole={userRole} userName={userName} />
      
      <main className="p-4 md:p-6 w-full">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg border p-6 shadow-sm">
            <h1 className="text-2xl md:text-3xl font-bold text-cbmepi-black mb-2">
              {getGreeting()}, {userName}!
            </h1>
            <p className="text-gray-600">
              Aqui está o resumo do sistema do Pelotão Mirim.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredActions.map((action, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer" onClick={action.action}>
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-3`}>
                    <action.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-base">{action.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{action.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
                <GraduationCap className="h-4 w-4 text-cbmepi-orange" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">+5 este mês</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Turmas Ativas</CardTitle>
                <Users className="h-4 w-4 text-cbmepi-orange" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">2 turmas novas</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Disciplinas</CardTitle>
                <BookOpen className="h-4 w-4 text-cbmepi-orange" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">Todas ativas</p>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avaliações</CardTitle>
                <ClipboardList className="h-4 w-4 text-cbmepi-orange" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-muted-foreground">3 pendentes</p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardCharts />
            
            <Card className="border border-gray-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-cbmepi-orange" />
                  Resumo Geral
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div>
                      <p className="font-medium text-blue-900">Bem-vindo de volta!</p>
                      <p className="text-sm text-blue-700">Olá {userName}, você tem 3 novas notificações.</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Nova turma criada</p>
                        <p className="text-xs text-gray-500">Turma Alfa-3 foi registrada no sistema</p>
                      </div>
                      <span className="text-xs text-gray-400">2h</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Avaliação pendente</p>
                        <p className="text-xs text-gray-500">5 alunos aguardam correção de prova</p>
                      </div>
                      <span className="text-xs text-gray-400">4h</span>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">Relatório disponível</p>
                        <p className="text-xs text-gray-500">Relatório mensal de frequência pronto</p>
                      </div>
                      <span className="text-xs text-gray-400">1d</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
