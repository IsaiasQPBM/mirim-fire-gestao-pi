
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Users, BookOpen, Calendar, Shield } from 'lucide-react';
import Header from '@/components/Header';

const Dashboard: React.FC = () => {
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const navigate = useNavigate();

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
  }, [navigate]);

  // Mock data for dashboard cards
  const getCardData = () => {
    if (userRole === 'admin') {
      return [
        { title: 'Total de Alunos', value: '120', icon: Users, color: 'bg-blue-100 text-blue-600' },
        { title: 'Disciplinas Ativas', value: '8', icon: BookOpen, color: 'bg-green-100 text-green-600' },
        { title: 'Instrutores', value: '12', icon: Shield, color: 'bg-purple-100 text-purple-600' },
        { title: 'Eventos do Mês', value: '5', icon: Calendar, color: 'bg-orange-100 text-orange-600' }
      ];
    } else if (userRole === 'instructor') {
      return [
        { title: 'Seus Alunos', value: '45', icon: Users, color: 'bg-blue-100 text-blue-600' },
        { title: 'Suas Disciplinas', value: '3', icon: BookOpen, color: 'bg-green-100 text-green-600' },
        { title: 'Avaliações Pendentes', value: '12', icon: BookOpen, color: 'bg-red-100 text-red-600' },
        { title: 'Próxima Aula', value: 'Hoje, 14h', icon: Calendar, color: 'bg-orange-100 text-orange-600' }
      ];
    } else {
      // Student role
      return [
        { title: 'Suas Disciplinas', value: '6', icon: BookOpen, color: 'bg-green-100 text-green-600' },
        { title: 'Média Geral', value: '8.5', icon: BookOpen, color: 'bg-blue-100 text-blue-600' },
        { title: 'Tarefas Pendentes', value: '3', icon: BookOpen, color: 'bg-red-100 text-red-600' },
        { title: 'Próxima Aula', value: 'Hoje, 14h', icon: Calendar, color: 'bg-orange-100 text-orange-600' }
      ];
    }
  };

  const cardData = getCardData();

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
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-cbmepi-black">{getWelcomeMessage()}</h2>
          <p className="text-gray-600">
            {userRole === 'admin' 
              ? 'Aqui está o resumo do sistema do Pelotão Mirim.' 
              : userRole === 'instructor' 
                ? 'Aqui está o resumo das suas atividades como instrutor.' 
                : 'Aqui está o resumo das suas atividades como aluno do Pelotão Mirim.'}
          </p>
        </div>
        
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {cardData.map((card, index) => (
            <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
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
          ))}
        </div>
        
        {/* Role-specific content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main content card */}
          <Card className="lg:col-span-2 shadow-md">
            <CardHeader>
              <CardTitle>
                {userRole === 'admin' 
                  ? 'Visão Geral do Sistema' 
                  : userRole === 'instructor' 
                    ? 'Suas Próximas Atividades'
                    : 'Seu Progresso Acadêmico'}
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
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
