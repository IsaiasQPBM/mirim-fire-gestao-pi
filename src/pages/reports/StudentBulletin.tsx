
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
  FileIcon
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
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
} from 'recharts';
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

const StudentBulletin: React.FC = () => {
  const [userRole, setUserRole] = useState<string>(localStorage.getItem('userRole') || '');
  const [userName, setUserName] = useState<string>(localStorage.getItem('userName') || '');
  const [selectedStudent, setSelectedStudent] = useState<string>('Pedro Santos');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2025-1');
  const navigate = useNavigate();

  const handleExportPDF = () => {
    // In a real application, this would generate a PDF
    console.log('Exporting PDF for student:', selectedStudent, 'period:', selectedPeriod);
  };

  const handleExportExcel = () => {
    // In a real application, this would generate an Excel file
    console.log('Exporting Excel for student:', selectedStudent, 'period:', selectedPeriod);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header title="Boletim Individual" userRole={userRole} userName={userName} />
      
      <main className="flex-1 p-6 overflow-y-auto">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <Button className="flex-1" onClick={handleExportPDF}>
                  <FileText className="mr-2 h-4 w-4" />
                  Exportar PDF
                </Button>
                <Button variant="outline" className="flex-1" onClick={handleExportExcel}>
                  <FileIcon className="mr-2 h-4 w-4" />
                  Exportar Excel
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <CardTitle className="text-lg">Resumo de Desempenho</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
              <div>
                <h4 className="text-sm font-medium mb-4">Desempenho por Disciplina</h4>
                <div className="h-64">
                  <ChartContainer
                    config={{
                      nota: { color: "#ea384c" },
                    }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
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
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grades Table */}
        <Card className="mb-6 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Notas por Avaliação</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Avaliação</TableHead>
                  <TableHead className="text-right">Nota</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead className="text-right">Média Turma</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Primeiros Socorros</TableCell>
                  <TableCell>Avaliação 1</TableCell>
                  <TableCell className="text-right">8.5</TableCell>
                  <TableCell>15/03/2025</TableCell>
                  <TableCell className="text-right">7.8</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Primeiros Socorros</TableCell>
                  <TableCell>Avaliação 2</TableCell>
                  <TableCell className="text-right">9.0</TableCell>
                  <TableCell>10/04/2025</TableCell>
                  <TableCell className="text-right">8.2</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Combate a Incêndio</TableCell>
                  <TableCell>Avaliação 1</TableCell>
                  <TableCell className="text-right">7.2</TableCell>
                  <TableCell>20/03/2025</TableCell>
                  <TableCell className="text-right">7.0</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Combate a Incêndio</TableCell>
                  <TableCell>Avaliação Prática</TableCell>
                  <TableCell className="text-right">8.0</TableCell>
                  <TableCell>25/04/2025</TableCell>
                  <TableCell className="text-right">7.5</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Defesa Civil</TableCell>
                  <TableCell>Avaliação 1</TableCell>
                  <TableCell className="text-right">6.8</TableCell>
                  <TableCell>05/05/2025</TableCell>
                  <TableCell className="text-right">6.5</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default StudentBulletin;
