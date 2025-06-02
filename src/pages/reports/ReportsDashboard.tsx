import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileCog, FileText, Download, Calendar, BarChartHorizontal, PieChart, Users, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { reportTypes } from '@/data/communicationTypes';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const ReportsDashboard: React.FC = () => {
  const [userRole, setUserRole] = useState<string>(localStorage.getItem('userRole') || '');
  const [userName, setUserName] = useState<string>(localStorage.getItem('userName') || '');
  const { toast } = useToast();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Filter report types based on user role
  const filteredReports = userRole === 'student' 
    ? reportTypes.filter(report => report.category === 'student') 
    : reportTypes;

  const getReportIcon = (iconName: string) => {
    switch(iconName) {
      case 'user':
        return <Users className="h-6 w-6 text-blue-500" />;
      case 'users':
        return <Users className="h-6 w-6 text-purple-500" />;
      case 'chart-bar':
        return <BarChartHorizontal className="h-6 w-6 text-green-500" />;
      case 'calendar':
        return <Calendar className="h-6 w-6 text-orange-500" />;
      case 'chart-pie':
        return <PieChart className="h-6 w-6 text-red-500" />;
      default:
        return <FileText className="h-6 w-6 text-gray-500" />;
    }
  };

  const handleReportSelection = (reportId: string) => {
    // Some reports may not be fully implemented yet
    const implementedReports = ['student-bulletin'];
    
    if (!implementedReports.includes(reportId)) {
      toast({
        title: "Funcionalidade em desenvolvimento",
        description: "Este relatório estará disponível em breve.",
        variant: "default",
      });
      return;
    }
    
    navigate(`/reports/${reportId}`);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-cbmepi-black">Central de Relatórios</h2>
          <p className="text-gray-600">
            Gere relatórios personalizados para acompanhar o desempenho e estatísticas do Pelotão Mirim.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredReports.map((report) => (
            <Card key={report.id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{report.name}</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="p-2 rounded-full bg-gray-100">
                          {getReportIcon(report.icon)}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-sm">{report.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <CardDescription>{report.description}</CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="rounded-md bg-gray-100 p-4 flex justify-center items-center min-h-[120px]">
                  <FileCog className="w-12 h-12 text-gray-400" />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  onClick={() => handleReportSelection(report.id)}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Gerar Relatório
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ReportsDashboard;
