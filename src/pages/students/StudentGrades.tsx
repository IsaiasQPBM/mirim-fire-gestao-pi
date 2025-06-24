
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BookOpen, 
  Download, 
  FileText, 
  BarChart3,
  TrendingUp,
  Award,
  ArrowLeft
} from 'lucide-react';
import Header from '@/components/Header';
import { getStudentById } from '@/data/studentTypes';
import { useToast } from '@/hooks/use-toast';
import { PDFService } from '@/components/PDFService';

const StudentGrades: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const userRole = localStorage.getItem('userRole') as 'admin' | 'instructor' | 'student' || 'student';
  const userName = localStorage.getItem('userName') || '';

  useEffect(() => {
    if (id) {
      const foundStudent = getStudentById(id);
      setStudent(foundStudent);
      setLoading(false);
    }
  }, [id]);

  // Mock grades data
  const grades = [
    {
      id: '1',
      disciplineName: 'Técnicas de Resgate e Salvamento',
      assessments: [
        { name: 'Prova Teórica', grade: 8.5, maxGrade: 10, date: '2024-01-15', weight: 0.4 },
        { name: 'Prova Prática', grade: 9.0, maxGrade: 10, date: '2024-01-22', weight: 0.6 }
      ],
      finalGrade: 8.8,
      status: 'approved'
    },
    {
      id: '2',
      disciplineName: 'Primeiros Socorros',
      assessments: [
        { name: 'Avaliação Contínua', grade: 7.5, maxGrade: 10, date: '2024-01-10', weight: 0.3 },
        { name: 'Simulação Prática', grade: 8.0, maxGrade: 10, date: '2024-01-20', weight: 0.7 }
      ],
      finalGrade: 7.85,
      status: 'approved'
    },
    {
      id: '3',
      disciplineName: 'Prevenção de Incêndios',
      assessments: [
        { name: 'Projeto Final', grade: 6.5, maxGrade: 10, date: '2024-01-25', weight: 1.0 }
      ],
      finalGrade: 6.5,
      status: 'recovery'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Aprovado</Badge>;
      case 'recovery':
        return <Badge className="bg-yellow-100 text-yellow-800">Recuperação</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Reprovado</Badge>;
      default:
        return <Badge>Em andamento</Badge>;
    }
  };

  const calculateOverallAverage = () => {
    const sum = grades.reduce((acc, grade) => acc + grade.finalGrade, 0);
    return (sum / grades.length).toFixed(2);
  };

  const handleExportPDF = () => {
    if (student) {
      PDFService.generateStudentBulletin(student);
      toast({
        title: "PDF exportado",
        description: "O boletim de notas foi gerado com sucesso.",
      });
    }
  };

  const handleExportExcel = () => {
    // Mock Excel export
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Disciplina,Avaliação,Nota,Nota Máxima,Data,Peso\n" +
      grades.map(grade => 
        grade.assessments.map(assessment => 
          `${grade.disciplineName},${assessment.name},${assessment.grade},${assessment.maxGrade},${assessment.date},${assessment.weight}`
        ).join('\n')
      ).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `notas_${student?.fullName || 'aluno'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Excel exportado",
      description: "O arquivo de notas foi baixado com sucesso.",
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cbmepi-orange"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="p-6">
        <Header title="Notas do Aluno" userRole={userRole} userName={userName} />
        <div className="mt-8 text-center">
          <h2 className="text-xl font-bold text-red-600">Aluno não encontrado</h2>
          <Button 
            className="mt-4 bg-cbmepi-orange hover:bg-cbmepi-orange/90"
            onClick={() => navigate('/students')}
          >
            Voltar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Header title="Notas do Aluno" userRole={userRole} userName={userName} />
      
      <div className="max-w-7xl mx-auto mt-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/students/${id}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Voltar ao Perfil
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-cbmepi-black">{student.fullName}</h1>
              <p className="text-gray-600">Boletim de Notas</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExportExcel}>
              <Download size={16} className="mr-2" />
              Excel
            </Button>
            <Button 
              onClick={handleExportPDF}
              className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
            >
              <FileText size={16} className="mr-2" />
              PDF
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
              <BarChart3 className="h-4 w-4 text-cbmepi-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calculateOverallAverage()}</div>
              <p className="text-xs text-muted-foreground">
                De 10.0 pontos
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Disciplinas</CardTitle>
              <BookOpen className="h-4 w-4 text-cbmepi-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{grades.length}</div>
              <p className="text-xs text-muted-foreground">
                Total cursadas
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Award className="h-4 w-4 text-cbmepi-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {grades.filter(g => g.status === 'approved').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Aprovado(s)
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="disciplines" className="space-y-6">
          <TabsList>
            <TabsTrigger value="disciplines">Por Disciplina</TabsTrigger>
            <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
            <TabsTrigger value="statistics">Estatísticas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="disciplines" className="space-y-6">
            {grades.map((grade) => (
              <Card key={grade.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{grade.disciplineName}</CardTitle>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(grade.status)}
                      <Badge variant="outline">
                        Média: {grade.finalGrade}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {grade.assessments.map((assessment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{assessment.name}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(assessment.date).toLocaleDateString('pt-BR')} • Peso: {(assessment.weight * 100)}%
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">
                            {assessment.grade}/{assessment.maxGrade}
                          </p>
                          <p className="text-sm text-gray-600">
                            {((assessment.grade / assessment.maxGrade) * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          <TabsContent value="timeline">
            <Card>
              <CardHeader>
                <CardTitle>Cronologia de Avaliações</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {grades.flatMap(grade => 
                    grade.assessments.map(assessment => ({
                      ...assessment,
                      disciplineName: grade.disciplineName
                    }))
                  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((assessment, index) => (
                    <div key={index} className="flex items-center gap-4 p-3 border-l-4 border-cbmepi-orange bg-gray-50 rounded-r-lg">
                      <div className="w-3 h-3 bg-cbmepi-orange rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium">{assessment.name}</p>
                        <p className="text-sm text-gray-600">{assessment.disciplineName}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{assessment.grade}/{assessment.maxGrade}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(assessment.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="statistics">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Desempenho por Disciplina</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {grades.map((grade) => (
                      <div key={grade.id} className="flex items-center justify-between">
                        <span className="text-sm">{grade.disciplineName}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-cbmepi-orange h-2 rounded-full" 
                              style={{ width: `${(grade.finalGrade / 10) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium">{grade.finalGrade}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Resumo Geral</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Maior Nota:</span>
                      <span className="font-bold">
                        {Math.max(...grades.flatMap(g => g.assessments.map(a => a.grade)))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Menor Nota:</span>
                      <span className="font-bold">
                        {Math.min(...grades.flatMap(g => g.assessments.map(a => a.grade)))}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total de Avaliações:</span>
                      <span className="font-bold">
                        {grades.reduce((acc, g) => acc + g.assessments.length, 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxa de Aprovação:</span>
                      <span className="font-bold text-green-600">
                        {((grades.filter(g => g.status === 'approved').length / grades.length) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default StudentGrades;
