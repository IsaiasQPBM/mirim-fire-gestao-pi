
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  Shield, 
  MessageSquare, 
  Bell, 
  FileText, 
  Megaphone,
  HelpCircle
} from 'lucide-react';
import Header from '@/components/Header';
import { AnimatedContainer } from '@/components/ui/animated-container';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // In a real app, this would check authentication status
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

    if (!storedUserRole || !storedUserName) {
      navigate('/');
      return;
    }

    setUserRole(storedUserRole);
    setUserName(storedUserName);

    // Demo welcome toast
    toast({
      title: "Bem-vindo de volta!",
      description: `Olá ${storedUserName}, você tem 3 novas notificações.`,
      duration: 5000,
    });
  }, [navigate, toast]);

  // Mock data for dashboard cards
  const getCardData = () => {
    if (userRole === 'admin') {
      return [
        { title: 'Total de Alunos', value: '120', icon: Users, color: 'bg-blue-100 text-blue-600', link: '/students' },
        { title: 'Disciplinas Ativas', value: '8', icon: BookOpen, color: 'bg-green-100 text-green-600', link: '/disciplines' },
        { title: 'Instrutores', value: '12', icon: Shield, color: 'bg-purple-100 text-purple-600', link: '/users' },
        { title: 'Eventos do Mês', value: '5', icon: Calendar, color: 'bg-orange-100 text-orange-600', link: '/calendar' }
      ];
    } else if (userRole === 'instructor') {
      return [
        { title: 'Seus Alunos', value: '45', icon: Users, color: 'bg-blue-100 text-blue-600', link: '/students' },
        { title: 'Suas Disciplinas', value: '3', icon: BookOpen, color: 'bg-green-100 text-green-600', link: '/disciplines' },
        { title: 'Avaliações Pendentes', value: '12', icon: BookOpen, color: 'bg-red-100 text-red-600', link: '/pedagogical/assessments' },
        { title: 'Próxima Aula', value: 'Hoje, 14h', icon: Calendar, color: 'bg-orange-100 text-orange-600', link: '/calendar' }
      ];
    } else {
      // Student role
      return [
        { title: 'Suas Disciplinas', value: '6', icon: BookOpen, color: 'bg-green-100 text-green-600', link: '/courses' },
        { title: 'Média Geral', value: '8.5', icon: BookOpen, color: 'bg-blue-100 text-blue-600', link: '/grades' },
        { title: 'Tarefas Pendentes', value: '3', icon: BookOpen, color: 'bg-red-100 text-red-600', link: '/schedule' },
        { title: 'Próxima Aula', value: 'Hoje, 14h', icon: Calendar, color: 'bg-orange-100 text-orange-600', link: '/calendar' }
      ];
    }
  };

  const getQuickActions = () => {
    if (userRole === 'admin') {
      return [
        { title: 'Novo Comunicado', icon: Megaphone, color: 'bg-amber-100 text-amber-600', link: '/communication/announcements/new' },
        { title: 'Nova Mensagem', icon: MessageSquare, color: 'bg-violet-100 text-violet-600', link: '/communication/messages/new' },
        { title: 'Gerar Relatório', icon: FileText, color: 'bg-emerald-100 text-emerald-600', link: '/reports' },
        { title: 'Ver Notificações', icon: Bell, color: 'bg-rose-100 text-rose-600', link: '/notifications' }
      ];
    } else if (userRole === 'instructor') {
      return [
        { title: 'Nova Avaliação', icon: FileText, color: 'bg-amber-100 text-amber-600', link: '/pedagogical/assessments/create' },
        { title: 'Nova Mensagem', icon: MessageSquare, color: 'bg-violet-100 text-violet-600', link: '/communication/messages/new' },
        { title: 'Ver Notificações', icon: Bell, color: 'bg-rose-100 text-rose-600', link: '/notifications' },
        { title: 'Boletim de Aluno', icon: FileText, color: 'bg-emerald-100 text-emerald-600', link: '/reports/student-bulletin' }
      ];
    } else {
      // Student role
      return [
        { title: 'Ver Mensagens', icon: MessageSquare, color: 'bg-violet-100 text-violet-600', link: '/communication/messages' },
        { title: 'Comunicados', icon: Megaphone, color: 'bg-amber-100 text-amber-600', link: '/communication/announcements' },
        { title: 'Cronograma', icon: Calendar, color: 'bg-green-100 text-green-600', link: '/schedule' },
        { title: 'Meu Boletim', icon: FileText, color: 'bg-emerald-100 text-emerald-600', link: '/reports/student-bulletin' }
      ];
    }
  };

  const cardData = getCardData();
  const quickActions = getQuickActions();

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    let greeting = '';
    
    if (hour < 12) greeting = 'Bom dia';
    else if (hour < 18) greeting = 'Boa tarde';
    else greeting = 'Boa noite';
    
    return `${greeting}, ${userName}!`;
  };

  if (!userRole) return null; // Don't render until we have the user role

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header title="Dashboard" userRole={userRole} userName={userName} />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <AnimatedContainer animation="fadeIn" className="mb-6">
          <h2 className="text-2xl font-bold text-cbmepi-black">{getWelcomeMessage()}</h2>
          <p className="text-gray-600">
            {userRole === 'admin' 
              ? 'Aqui está o resumo do sistema do Pelotão Mirim.' 
              : userRole === 'instructor' 
                ? 'Aqui está o resumo das suas atividades como instrutor.' 
                : 'Aqui está o resumo das suas atividades como aluno do Pelotão Mirim.'}
          </p>
        </AnimatedContainer>
        
        {/* Quick Actions */}
        <AnimatedContainer animation="slideUp" delay="short" className="mb-8">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            Ações Rápidas
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-1 h-5 w-5">
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Acesso rápido às funcionalidades mais utilizadas</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link to={action.link} key={action.title}>
                <Card className="shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4 flex flex-col items-center justify-center text-center h-full">
                    <div className={`p-3 rounded-full ${action.color} mb-3`}>
                      <action.icon size={24} />
                    </div>
                    <p className="font-medium text-sm">{action.title}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </AnimatedContainer>
        
        {/* Dashboard Cards */}
        <AnimatedContainer animation="slideUp" delay="medium" className="mb-8">
          <h3 className="text-lg font-medium mb-4 flex items-center">
            Resumo Geral
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="ml-1 h-5 w-5">
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Informações importantes sobre o sistema</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {cardData.map((card, index) => (
              <Link to={card.link} key={index}>
                <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center justify-between">
                      {card.title}
                      <div className={`p-2 rounded-full ${card.color}`}>
                        <card.icon size={20} />
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{card.value}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </AnimatedContainer>
        
        {/* Role-specific content */}
        <AnimatedContainer animation="slideUp" delay="long" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content card */}
          <Card className="lg:col-span-2 shadow-md">
            <CardHeader>
              <CardTitle>
                {userRole === 'admin' 
                  ? 'Visão Geral do Sistema' 
                  : userRole === 'instructor' 
                    ? 'Suas Próximas Atividades'
                    : 'Seu Progresso Acadêmico'}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="ml-1 h-5 w-5">
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {userRole === 'admin' 
                          ? 'Visualização gráfica dos dados do sistema' 
                          : userRole === 'instructor' 
                            ? 'Calendário de atividades agendadas'
                            : 'Acompanhamento do seu desempenho acadêmico'}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border rounded-md bg-gray-50">
                <p className="text-gray-500">
                  {userRole === 'admin' 
                    ? 'Gráficos e estatísticas serão exibidos aqui' 
                    : userRole === 'instructor' 
                      ? 'Seu calendário de atividades será exibido aqui'
                      : 'Seu progresso nas disciplinas será exibido aqui'}
                </p>
              </div>
            </CardContent>
          </Card>
          
          {/* Sidebar card */}
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>
                {userRole === 'admin' 
                  ? 'Atividades Recentes' 
                  : userRole === 'instructor' 
                    ? 'Notificações'
                    : 'Avisos Importantes'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0">
                    <div className="w-2 h-2 mt-2 rounded-full bg-cbmepi-orange"></div>
                    <div>
                      <p className="font-medium text-sm">
                        {userRole === 'admin' 
                          ? `Novo aluno registrado: João Silva` 
                          : userRole === 'instructor' 
                            ? 'Avaliação pendente: Turma A'
                            : 'Entrega de trabalho amanhã'}
                      </p>
                      <p className="text-xs text-gray-500">há 2 horas atrás</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </AnimatedContainer>
      </main>
    </div>
  );
};

export default Dashboard;
