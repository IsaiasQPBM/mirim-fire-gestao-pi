
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
import { useAuth } from '@/hooks/useAuth';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, loading } = useAuth();
  const [hasShownWelcome, setHasShownWelcome] = useState(false);

  useEffect(() => {
    console.log('📊 Dashboard - Auth State:', { 
      loading, 
      hasUser: !!user, 
      hasProfile: !!profile,
      profileRole: profile?.role 
    });

    if (loading) {
      console.log('⏳ Dashboard aguardando auth...');
      return;
    }

    if (!user || !profile) {
      console.log('❌ Dashboard - sem auth, redirecionando...');
      navigate('/login', { replace: true });
      return;
    }

    // Mostrar toast de boas-vindas apenas uma vez
    if (profile && !hasShownWelcome) {
      console.log('✅ Dashboard carregado para:', profile.full_name);
      
      toast({
        title: "Bem-vindo de volta!",
        description: `Olá ${profile.full_name}, sistema carregado com sucesso.`,
        duration: 3000,
      });
      
      setHasShownWelcome(true);
    }
  }, [navigate, toast, user, profile, loading, hasShownWelcome]);

  // Mostrar loading enquanto carregando
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#F5A623]"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  // Redirecionar se não autenticado (não renderizar nada)
  if (!user || !profile) {
    return null;
  }

  // Mock data for dashboard cards
  const getCardData = () => {
    if (profile?.role === 'admin') {
      return [
        { title: 'Total de Alunos', value: '0', icon: Users, color: 'bg-blue-100 text-blue-600', link: '/students' },
        { title: 'Disciplinas Ativas', value: '0', icon: BookOpen, color: 'bg-green-100 text-green-600', link: '/disciplines' },
        { title: 'Instrutores', value: '1', icon: Shield, color: 'bg-purple-100 text-purple-600', link: '/users' },
        { title: 'Eventos do Mês', value: '0', icon: Calendar, color: 'bg-orange-100 text-orange-600', link: '/calendar' }
      ];
    } else if (profile?.role === 'instructor') {
      return [
        { title: 'Seus Alunos', value: '0', icon: Users, color: 'bg-blue-100 text-blue-600', link: '/students' },
        { title: 'Suas Disciplinas', value: '0', icon: BookOpen, color: 'bg-green-100 text-green-600', link: '/disciplines' },
        { title: 'Avaliações Pendentes', value: '0', icon: BookOpen, color: 'bg-red-100 text-red-600', link: '/pedagogical/assessments' },
        { title: 'Próxima Aula', value: 'Nenhuma', icon: Calendar, color: 'bg-orange-100 text-orange-600', link: '/calendar' }
      ];
    } else {
      // Student role
      return [
        { title: 'Suas Disciplinas', value: '0', icon: BookOpen, color: 'bg-green-100 text-green-600', link: '/courses' },
        { title: 'Média Geral', value: '-', icon: BookOpen, color: 'bg-blue-100 text-blue-600', link: '/grades' },
        { title: 'Tarefas Pendentes', value: '0', icon: BookOpen, color: 'bg-red-100 text-red-600', link: '/schedule' },
        { title: 'Próxima Aula', value: 'Nenhuma', icon: Calendar, color: 'bg-orange-100 text-orange-600', link: '/calendar' }
      ];
    }
  };

  const getQuickActions = () => {
    if (profile?.role === 'admin') {
      return [
        { title: 'Criar Usuário', icon: Users, color: 'bg-blue-100 text-blue-600', link: '/users/create' },
        { title: 'Criar Curso', icon: BookOpen, color: 'bg-green-100 text-green-600', link: '/courses/create' },
        { title: 'Criar Turma', icon: Shield, color: 'bg-purple-100 text-purple-600', link: '/classes/create' },
        { title: 'Ver Relatórios', icon: FileText, color: 'bg-emerald-100 text-emerald-600', link: '/reports' }
      ];
    } else if (profile?.role === 'instructor') {
      return [
        { title: 'Nova Avaliação', icon: FileText, color: 'bg-amber-100 text-amber-600', link: '/pedagogical/assessments/create' },
        { title: 'Planejar Aula', icon: Calendar, color: 'bg-green-100 text-green-600', link: '/lessons/planning' },
        { title: 'Ver Alunos', icon: Users, color: 'bg-blue-100 text-blue-600', link: '/students' },
        { title: 'Relatórios', icon: FileText, color: 'bg-emerald-100 text-emerald-600', link: '/reports' }
      ];
    } else {
      // Student role
      return [
        { title: 'Ver Mensagens', icon: MessageSquare, color: 'bg-violet-100 text-violet-600', link: '/communications/messages' },
        { title: 'Calendário', icon: Calendar, color: 'bg-green-100 text-green-600', link: '/calendar' },
        { title: 'Cronograma', icon: Calendar, color: 'bg-orange-100 text-orange-600', link: '/schedule' },
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
    
    return `${greeting}, ${profile?.full_name || 'Usuário'}!`;
  };

  const getRoleDescription = () => {
    switch (profile?.role) {
      case 'admin':
        return 'Aqui está o resumo do sistema do Pelotão Mirim.';
      case 'instructor':
        return 'Aqui está o resumo das suas atividades como instrutor.';
      case 'student':
        return 'Aqui está o resumo das suas atividades como aluno do Pelotão Mirim.';
      default:
        return 'Bem-vindo ao sistema do Pelotão Mirim.';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <AnimatedContainer animation="fadeIn" className="mb-6">
          <h2 className="text-2xl font-bold text-cbmepi-black">{getWelcomeMessage()}</h2>
          <p className="text-gray-600">{getRoleDescription()}</p>
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
        
        {/* Informational content */}
        <AnimatedContainer animation="slideUp" delay="long" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-md">
            <CardHeader>
              <CardTitle>
                {profile.role === 'admin' 
                  ? 'Painel Administrativo' 
                  : profile.role === 'instructor' 
                    ? 'Suas Próximas Atividades'
                    : 'Seu Progresso Acadêmico'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center border rounded-md bg-gray-50">
                <div className="text-center">
                  <p className="text-gray-500 mb-2">
                    {profile.role === 'admin' 
                      ? 'Configure o sistema criando usuários, cursos e turmas.' 
                      : profile.role === 'instructor' 
                        ? 'Comece criando avaliações e planejando suas aulas.'
                        : 'Acompanhe seu progresso conforme participa das atividades.'}
                  </p>
                  <p className="text-sm text-gray-400">
                    Sistema limpo e pronto para uso.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Sistema Bombeiro Mirim</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 pb-3 border-b">
                  <div className="w-2 h-2 mt-2 rounded-full bg-green-500"></div>
                  <div>
                    <p className="font-medium text-sm">Sistema inicializado</p>
                    <p className="text-xs text-gray-500">Pronto para uso</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 pb-3 border-b">
                  <div className="w-2 h-2 mt-2 rounded-full bg-blue-500"></div>
                  <div>
                    <p className="font-medium text-sm">Banco de dados limpo</p>
                    <p className="text-xs text-gray-500">Apenas dados essenciais</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 pb-3 border-b">
                  <div className="w-2 h-2 mt-2 rounded-full bg-[#F5A623]"></div>
                  <div>
                    <p className="font-medium text-sm">Usuário administrador ativo</p>
                    <p className="text-xs text-gray-500">Sistema configurado</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-purple-500"></div>
                  <div>
                    <p className="font-medium text-sm">Todas as rotas funcionais</p>
                    <p className="text-xs text-gray-500">Navegação completa</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedContainer>
      </main>
    </div>
  );
};

export default Dashboard;
