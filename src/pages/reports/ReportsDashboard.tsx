
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { 
  Users, 
  UserCheck, 
  TrendingUp, 
  Calendar,
  BarChart3,
  FileText,
  Download
} from 'lucide-react';
import { PDFService } from '@/components/PDFService';
import { useToast } from '@/hooks/use-toast';

const ReportsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

    if (!storedUserRole || !storedUserName) {
      navigate('/');
      return;
    }

    setUserRole(storedUserRole);
    setUserName(storedUserName);
  }, [navigate]);

  const handleGenerateReport = (reportType: string) => {
    switch (reportType) {
      case 'student-bulletin':
        // Mock student data for demonstration
        const mockStudent = {
          id: 'student-1',
          fullName: 'João Silva',
          registrationNumber: '2024001',
          birthDate: '2010-05-15',
          email: 'joao.silva@email.com',
          phone: '(86) 99999-9999',
          enrollmentDate: '2024-02-01',
          status: 'active' as const,
          address: {
            street: 'Rua das Flores',
            number: '123',
            complement: 'Apt 101',
            neighborhood: 'Centro',
            city: 'Teresina',
            state: 'PI',
            zipCode: '64000-000'
          },
          guardians: [
            {
              id: 'guardian-1',
              name: 'Maria Silva',
              relationship: 'Mãe',
              phone: '(86) 88888-8888',
              email: 'maria.silva@email.com',
              isEmergencyContact: true
            }
          ],
          classIds: ['class-1'],
          notes: 'Aluno dedicado e participativo.'
        };
        PDFService.generateStudentBulletin(mockStudent);
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
  };

  const reportCards = [
    {
      id: 'student-bulletin',
      title: 'Boletim Individual',
      description: 'Gerar boletim individual de desempenho do aluno',
      icon: <Users className="h-8 w-8" />,
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      available: true
    },
    {
      id: 'class-performance',
      title: 'Desempenho por Turma',
      description: 'Relatório de desempenho acadêmico por turma',
      icon: <UserCheck className="h-8 w-8" />,
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      available: true
    },
    {
      id: 'approval-stats',
      title: 'Estatísticas de Aprovação',
      description: 'Estatísticas de aprovação e reprovação por disciplina',
      icon: <TrendingUp className="h-8 w-8" />,
      iconColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      available: true
    },
    {
      id: 'attendance',
      title: 'Relatório de Frequência',
      description: 'Relatório detalhado de frequência de alunos',
      icon: <Calendar className="h-8 w-8" />,
      iconColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      available: true
    },
    {
      id: 'comparative',
      title: 'Análise Comparativa',
      description: 'Análise comparativa de desempenho entre períodos',
      icon: <BarChart3 className="h-8 w-8" />,
      iconColor: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      available: true
    }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header 
        title="Central de Relatórios" 
        userRole={userRole} 
        userName={userName} 
      />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <p className="text-gray-600 mt-2">
              Gere relatórios personalizados para acompanhar o desempenho e estatísticas do Pelotão Mirim.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reportCards.map((report) => (
              <Card 
                key={report.id} 
                className={`transition-all duration-200 hover:shadow-lg ${report.borderColor} border-2`}
              >
                <CardHeader className={`${report.bgColor} rounded-t-lg`}>
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg bg-white ${report.iconColor}`}>
                      {report.icon}
                    </div>
                    {report.available && (
                      <Badge className="bg-green-100 text-green-800 border-green-300">
                        Disponível
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="p-6">
                  <CardTitle className="text-lg mb-2">
                    {report.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 mb-4">
                    {report.description}
                  </CardDescription>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-cbmepi-orange hover:bg-cbmepi-orange/90"
                      onClick={() => handleGenerateReport(report.id)}
                      disabled={!report.available}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Gerar PDF
                    </Button>
                  </div>
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
