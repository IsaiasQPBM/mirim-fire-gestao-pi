import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Download, 
  ArrowLeft, 
  CalendarCheck, 
  BookOpen,
  User, 
  Download as DownloadIcon,
  FileIcon,
  Info
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
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

const performanceData = [
  { name: 'Disciplina 1', nota: 8.5 },
  { name: 'Disciplina 2', nota: 7.2 },
  { name: 'Disciplina 3', nota: 9.0 },
  { name: 'Disciplina 4', nota: 6.8 },
  { name: 'Disciplina 5', nota: 8.0 },
];

const attendanceData = [
  { month: 'Jan', presente: 95, ausente: 5 },
  { month: 'Fev', presente: 90, ausente: 10 },
  { month: 'Mar', presente: 88, ausente: 12 },
  { month: 'Abr', presente: 92, ausente: 8 },
  { month: 'Mai', presente: 85, ausente: 15 },
];

// Mobile-optimized data for pie chart display
const attendanceSummary = [
  { name: 'Presente', value: 90, color: '#10b981' },
  { name: 'Ausente', value: 10, color: '#f43f5e' },
];

const StudentBulletin: React.FC = () => {
  const [userRole, setUserRole] = useState<string>(localStorage.getItem('userRole') || '');
  const [userName, setUserName] = useState<string>(localStorage.getItem('userName') || '');
  const [selectedStudent, setSelectedStudent] = useState<string>('Pedro Santos');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2025-1');
  const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const handleExportPDF = () => {
    setIsGeneratingReport(true);
    
    // Simulating PDF generation with a timeout
    setTimeout(() => {
      setIsGeneratingReport(false);
      toast({
        title: "PDF gerado com sucesso",
        description: `O boletim de ${selectedStudent} foi exportado para PDF.`,
      });
    }, 1500);
  };

  const handleExportExcel = () => {
    setIsGeneratingReport(true);
    
    // Simulating Excel generation with a timeout
    setTimeout(() => {
      setIsGeneratingReport(false);
      toast({
        title: "Excel gerado com sucesso",
        description: `Os dados de ${selectedStudent} foram exportados para Excel.`,
      });
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={() => navigate('/reports')} className="mr-2">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar
          </Button>
          <h2 className="text-2xl font-bold text-cbmepi-black">Boletim Individual</h2>
        </div>

        {/* Filters */}
        <Card className="mb-6 shadow-sm">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div>
                <Label htmlFor="student">Aluno</Label>
                <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                  <SelectTrigger id="student">
                    <SelectValue placeholder="Selecione um aluno" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pedro Santos">Pedro Santos</SelectItem>
                    <SelectItem value="Maria Oliveira">Maria Oliveira</SelectItem>
                    <SelectItem value="João Silva">João Silva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="period">Período</Label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                  <SelectTrigger id="period">
                    <SelectValue placeholder="Selecione um período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025-1">1º Semestre 2025</SelectItem>
                    <SelectItem value="2024-2">2º Semestre 2024</SelectItem>
                    <SelectItem value="2024-1">1º Semestre 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="lg:col-span-2 flex items-end gap-2">
                <Button className="flex-1" onClick={handleExportPDF} disabled={isGeneratingReport}>
                  <FileText className="mr-2 h-4 w-4" />
                  {isGeneratingReport ? 'Processando...' : 'Exportar PDF'}
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleExportExcel} disabled={isGeneratingReport}>
                  <FileIcon className="mr-2 h-4 w-4" />
                  {isGeneratingReport ? 'Processando...' : 'Exportar Excel'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Student Info */}
        <Card className="mb-6 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Informações do Aluno</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-blue-100">
                  <User className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nome Completo</p>
                  <p className="font-medium">{selectedStudent}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-green-100">
                  <CalendarCheck className="h-5 w-5 text-green-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Turma</p>
                  <p className="font-medium">Turma A - 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-full bg-purple-100">
                  <BookOpen className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Curso</p>
                  <p className="font-medium">Bombeiro Mirim</p>
                </div>
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
                  <span className="text-3xl font-bold">8.2</span>
                  <span className="text-sm text-gray-500 ml-2 mb-1">/ 10</span>
                </div>
                <Progress className="mt-2 h-2" value={82} />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Frequência</p>
                <div className="flex items-end">
                  <span className="text-3xl font-bold">92%</span>
                </div>
                <Progress className="mt-2 h-2" value={92} />
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Atividades Concluídas</p>
                <div className="flex items-end">
                  <span className="text-3xl font-bold">85%</span>
                </div>
                <Progress className="mt-2 h-2" value={85} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Display bar chart on desktop, pie chart on mobile for better display */}
              <div>
                <h4 className="text-sm font-medium mb-4">Desempenho por Disciplina</h4>
                <div className="h-64">
                  <ChartContainer
                    config={{
                      nota: { color: "#ea384c" },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      {isMobile ? (
                        // Mobile optimized version with fewer bars
                        <BarChart 
                          data={performanceData.slice(0, 3)}
                          margin={{ top: 5, right: 10, left: 0, bottom: 20 }}
                          barSize={30}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" angle={-45} textAnchor="end" height={50} />
                          <YAxis domain={[0, 10]} />
                          <Tooltip />
                          <Bar dataKey="nota" fill="#ea384c" />
                        </BarChart>
                      ) : (
                        <BarChart 
                          data={performanceData}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis domain={[0, 10]} />
                          <Tooltip />
                          <Bar dataKey="nota" fill="#ea384c" />
                        </BarChart>
                      )}
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
                        // Mobile optimized version with pie chart
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

        {/* Grades Table - Responsive version */}
        <Card className="mb-6 shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg">Notas por Avaliação</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Avaliação</TableHead>
                    <TableHead className="text-right">Nota</TableHead>
                    <TableHead className={isMobile ? "hidden" : ""}>Data</TableHead>
                    <TableHead className={`text-right ${isMobile ? "hidden md:table-cell" : ""}`}>Média Turma</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Primeiros Socorros</TableCell>
                    <TableCell>Avaliação 1</TableCell>
                    <TableCell className="text-right">8.5</TableCell>
                    <TableCell className={isMobile ? "hidden" : ""}>15/03/2025</TableCell>
                    <TableCell className={`text-right ${isMobile ? "hidden md:table-cell" : ""}`}>7.8</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Primeiros Socorros</TableCell>
                    <TableCell>Avaliação 2</TableCell>
                    <TableCell className="text-right">9.0</TableCell>
                    <TableCell className={isMobile ? "hidden" : ""}>10/04/2025</TableCell>
                    <TableCell className={`text-right ${isMobile ? "hidden md:table-cell" : ""}`}>8.2</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Combate a Incêndio</TableCell>
                    <TableCell>Avaliação 1</TableCell>
                    <TableCell className="text-right">7.2</TableCell>
                    <TableCell className={isMobile ? "hidden" : ""}>20/03/2025</TableCell>
                    <TableCell className={`text-right ${isMobile ? "hidden md:table-cell" : ""}`}>7.0</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Combate a Incêndio</TableCell>
                    <TableCell>Avaliação Prática</TableCell>
                    <TableCell className="text-right">8.0</TableCell>
                    <TableCell className={isMobile ? "hidden" : ""}>25/04/2025</TableCell>
                    <TableCell className={`text-right ${isMobile ? "hidden md:table-cell" : ""}`}>7.5</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Defesa Civil</TableCell>
                    <TableCell>Avaliação 1</TableCell>
                    <TableCell className="text-right">6.8</TableCell>
                    <TableCell className={isMobile ? "hidden" : ""}>05/05/2025</TableCell>
                    <TableCell className={`text-right ${isMobile ? "hidden md:table-cell" : ""}`}>6.5</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default StudentBulletin;
