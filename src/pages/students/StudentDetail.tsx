
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter,
  CardDescription 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  GraduationCap, 
  BookOpen, 
  Clock,
  Clipboard,
  MessageSquare,
  FileText,
  Edit,
  AlertCircle,
  CheckCircle,
  BarChart,
  MapPin,
  Users
} from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Header from '@/components/Header';
import { getStudentById, Student, getTimelineEventsByStudentId, getAttendanceByStudentId, getCommunicationsByStudentId, getAcademicRecordByStudentId } from '@/data/studentTypes';
import { Line, Bar } from 'recharts';
import { useToast } from '@/hooks/use-toast';
import TimelineComponent from '@/components/students/Timeline';
import AttendanceChart from '@/components/students/AttendanceChart';
import PerformanceChart from '@/components/students/PerformanceChart';
import PedagogicalObservations from '@/components/students/PedagogicalObservations';
import StudentCommunications from '@/components/students/StudentCommunications';
import DocumentsList from '@/components/students/DocumentsList';

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  const userRole = localStorage.getItem('userRole') as 'admin' | 'instructor' | 'student' || 'student';
  const userName = localStorage.getItem('userName') || '';

  useEffect(() => {
    if (id) {
      const foundStudent = getStudentById(id);
      setStudent(foundStudent);
      setLoading(false);
    }
  }, [id]);
  
  const canAccessStudentDetail = () => {
    if (!student) return false;
    
    // Admins and instructors can see all students
    if (['admin', 'instructor'].includes(userRole)) return true;
    
    // Students can only see their own profile
    if (userRole === 'student' && student.fullName === userName) return true;
    
    return false;
  };
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'active': return 'Ativo';
      case 'inactive': return 'Inativo';
      case 'on_leave': return 'Em licença';
      default: return status;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-300';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-300';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return '';
    }
  };
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };
  
  const handleEditStudent = () => {
    toast({
      title: "Função em desenvolvimento",
      description: "A edição de alunos estará disponível em breve.",
      variant: "default",
    });
  };
  
  const handleSendMessage = () => {
    toast({
      title: "Função em desenvolvimento",
      description: "O envio de mensagens estará disponível em breve.",
      variant: "default",
    });
  };
  
  const handlePrintProfile = () => {
    toast({
      title: "Função em desenvolvimento",
      description: "A impressão de perfil estará disponível em breve.",
      variant: "default",
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
        <Header title="Perfil do Aluno" userRole={userRole} userName={userName} />
        <div className="mt-8 text-center">
          <h2 className="text-xl font-bold text-red-600">Aluno não encontrado</h2>
          <p className="mt-2">O aluno que você está procurando não existe.</p>
          <Button 
            className="mt-4 bg-cbmepi-orange hover:bg-cbmepi-orange/90"
            onClick={() => navigate('/students')}
          >
            Voltar para Lista de Alunos
          </Button>
        </div>
      </div>
    );
  }
  
  if (!canAccessStudentDetail()) {
    return (
      <div className="p-6">
        <Header title="Perfil do Aluno" userRole={userRole} userName={userName} />
        <div className="mt-8 text-center">
          <h2 className="text-xl font-bold text-red-600">Acesso Restrito</h2>
          <p className="mt-2">Você não tem permissão para visualizar este perfil.</p>
          <Button 
            className="mt-4 bg-cbmepi-orange hover:bg-cbmepi-orange/90"
            onClick={() => navigate('/dashboard')}
          >
            Voltar para Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const timelineEvents = getTimelineEventsByStudentId(student.id);
  const attendanceRecords = getAttendanceByStudentId(student.id);
  const communications = getCommunicationsByStudentId(student.id);
  const academicRecord = getAcademicRecordByStudentId(student.id);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Header title="Perfil do Aluno" userRole={userRole} userName={userName} />
      
      <div className="max-w-7xl mx-auto mt-6">
        <Card className="overflow-hidden border-t-4 border-t-cbmepi-orange shadow-md">
          <div className="bg-gradient-to-r from-cbmepi-orange to-cbmepi-red h-32 relative">
            {['admin', 'instructor'].includes(userRole) && (
              <div className="absolute top-4 right-4 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white hover:bg-gray-100"
                  onClick={handleEditStudent}
                >
                  <Edit size={16} className="mr-1" />
                  Editar
                </Button>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white hover:bg-gray-100"
                  onClick={handleSendMessage}
                >
                  <MessageSquare size={16} className="mr-1" />
                  Mensagem
                </Button>
              </div>
            )}
            
            <div className="absolute -bottom-16 left-6 w-32 h-32 rounded-full bg-cbmepi-orange text-white flex items-center justify-center text-4xl font-bold border-4 border-white">
              {student.profileImage ? (
                <img 
                  src={student.profileImage} 
                  alt={student.fullName} 
                  className="w-full h-full object-cover rounded-full" 
                />
              ) : (
                getInitials(student.fullName)
              )}
            </div>
          </div>
          
          <CardContent className="pt-20 pb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-cbmepi-black">{student.fullName}</h2>
                <div className="flex items-center gap-1 text-gray-600 mt-1">
                  <GraduationCap size={16} />
                  <span className="text-sm">Matrícula: {student.registrationNumber}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge className={getStatusColor(student.status)}>
                  {getStatusLabel(student.status)}
                </Badge>
                {student.classIds.length > 0 && (
                  <Badge variant="outline">
                    {student.classIds.length} {student.classIds.length === 1 ? 'Turma' : 'Turmas'}
                  </Badge>
                )}
              </div>
            </div>
            
            <Tabs defaultValue="info" className="mt-8">
              <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
                <TabsTrigger value="info">
                  <User size={16} className="mr-2 hidden md:inline" />
                  Informações
                </TabsTrigger>
                <TabsTrigger value="academic">
                  <BookOpen size={16} className="mr-2 hidden md:inline" />
                  Acadêmico
                </TabsTrigger>
                <TabsTrigger value="observations">
                  <Clipboard size={16} className="mr-2 hidden md:inline" />
                  Observações
                </TabsTrigger>
                <TabsTrigger value="documents">
                  <FileText size={16} className="mr-2 hidden md:inline" />
                  Documentos
                </TabsTrigger>
                <TabsTrigger value="communications">
                  <MessageSquare size={16} className="mr-2 hidden md:inline" />
                  Comunicações
                </TabsTrigger>
              </TabsList>
              
              {/* Personal Information Tab */}
              <TabsContent value="info" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <User size={18} className="mr-2 text-cbmepi-orange" />
                        Dados Pessoais
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Nome Completo</p>
                        <p>{student.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Matrícula</p>
                        <p>{student.registrationNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Data de Nascimento</p>
                        <p>{formatDate(student.birthDate)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Data de Matrícula</p>
                        <p>{formatDate(student.enrollmentDate)}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <Phone size={18} className="mr-2 text-cbmepi-orange" />
                        Contato
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p>{student.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Telefone</p>
                        <p>{student.phone}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <MapPin size={18} className="mr-2 text-cbmepi-orange" />
                        Endereço
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Logradouro</p>
                        <p>{student.address.street}, {student.address.number}
                          {student.address.complement && `, ${student.address.complement}`}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Bairro</p>
                        <p>{student.address.neighborhood}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Cidade/Estado</p>
                        <p>{student.address.city}/{student.address.state}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">CEP</p>
                        <p>{student.address.zipCode}</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <Users size={18} className="mr-2 text-cbmepi-orange" />
                        Responsáveis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {student.guardians.map(guardian => (
                        <div key={guardian.id} className="mb-4 pb-4 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{guardian.name}</p>
                            {guardian.isEmergencyContact && (
                              <Badge variant="outline" className="text-xs">
                                <AlertCircle size={12} className="mr-1 text-red-500" />
                                Emergência
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{guardian.relationship}</p>
                          <div className="mt-2 flex flex-col text-sm">
                            <div className="flex items-center gap-1">
                              <Phone size={14} className="text-gray-400" />
                              <span>{guardian.phone}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Mail size={14} className="text-gray-400" />
                              <span>{guardian.email}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
                
                {student.notes && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <Clipboard size={18} className="mr-2 text-cbmepi-orange" />
                        Anotações Administrativas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700">{student.notes}</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              {/* Academic Tab */}
              <TabsContent value="academic" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Academic Record */}
                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <GraduationCap size={18} className="mr-2 text-cbmepi-orange" />
                        Histórico Acadêmico
                      </CardTitle>
                      <CardDescription>
                        Cursos e disciplinas do aluno
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {academicRecord ? (
                        <div>
                          <div className="mb-4 pb-4 border-b">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{academicRecord.courseName}</h3>
                              <Badge 
                                className={
                                  academicRecord.status === 'in_progress' 
                                    ? 'bg-blue-100 text-blue-800 border-blue-300' 
                                    : academicRecord.status === 'completed'
                                    ? 'bg-green-100 text-green-800 border-green-300'
                                    : 'bg-red-100 text-red-800 border-red-300'
                                }
                              >
                                {academicRecord.status === 'in_progress' 
                                  ? 'Em andamento' 
                                  : academicRecord.status === 'completed'
                                  ? 'Concluído'
                                  : 'Desistente'}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-500">
                              Início: {formatDate(academicRecord.startDate)}
                              {academicRecord.endDate && ` • Término: ${formatDate(academicRecord.endDate)}`}
                            </p>
                          </div>
                          
                          <div className="space-y-4 mt-4">
                            <h4 className="font-medium text-sm text-gray-600">Disciplinas:</h4>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <table className="w-full">
                                <thead>
                                  <tr className="border-b border-gray-200">
                                    <th className="text-left pb-2 font-medium text-sm text-gray-600">Disciplina</th>
                                    <th className="text-left pb-2 font-medium text-sm text-gray-600">Status</th>
                                    <th className="text-left pb-2 font-medium text-sm text-gray-600">Nota</th>
                                    <th className="text-left pb-2 font-medium text-sm text-gray-600">Instrutor</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {academicRecord.disciplines.map(discipline => (
                                    <tr key={discipline.id} className="border-b border-gray-100 last:border-0">
                                      <td className="py-3">{discipline.name}</td>
                                      <td className="py-3">
                                        <Badge 
                                          className={
                                            discipline.status === 'in_progress' 
                                              ? 'bg-blue-100 text-blue-800 border-blue-300' 
                                              : discipline.status === 'completed'
                                              ? 'bg-green-100 text-green-800 border-green-300'
                                              : 'bg-gray-100 text-gray-600 border-gray-300'
                                          }
                                          variant="outline"
                                        >
                                          {discipline.status === 'in_progress' 
                                            ? 'Em andamento' 
                                            : discipline.status === 'completed'
                                            ? 'Concluído'
                                            : 'Não iniciado'}
                                        </Badge>
                                      </td>
                                      <td className="py-3">{discipline.grade || '-'}</td>
                                      <td className="py-3">{discipline.instructorName}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-center py-4 text-gray-500">
                          Nenhum registro acadêmico encontrado para este aluno.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  
                  {/* Performance Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <BarChart size={18} className="mr-2 text-cbmepi-orange" />
                        Desempenho Acadêmico
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <PerformanceChart studentId={student.id} />
                    </CardContent>
                  </Card>
                  
                  {/* Attendance Chart */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center">
                        <CheckCircle size={18} className="mr-2 text-cbmepi-orange" />
                        Frequência
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                      <AttendanceChart studentId={student.id} />
                    </CardContent>
                  </Card>
                </div>
                
                {/* Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center">
                      <Clock size={18} className="mr-2 text-cbmepi-orange" />
                      Linha do Tempo
                    </CardTitle>
                    <CardDescription>
                      Histórico de atividades, avaliações e marcos importantes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TimelineComponent studentId={student.id} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Observations Tab */}
              <TabsContent value="observations">
                <PedagogicalObservations studentId={student.id} />
              </TabsContent>
              
              {/* Documents Tab */}
              <TabsContent value="documents">
                <DocumentsList student={student} userRole={userRole} />
              </TabsContent>
              
              {/* Communications Tab */}
              <TabsContent value="communications">
                <StudentCommunications 
                  studentId={student.id} 
                  studentName={student.fullName} 
                  userRole={userRole}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="border-t bg-gray-50 py-4">
            <div className="flex justify-between items-center w-full">
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate('/students')}
              >
                <Users size={16} className="mr-1" />
                Voltar para Lista
              </Button>
              
              <div className="flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrintProfile}
                      >
                        <FileText size={16} className="mr-1" />
                        Imprimir Perfil
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Exportar perfil do aluno como PDF</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                {['admin', 'instructor'].includes(userRole) && (
                  <Button
                    size="sm"
                    className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
                    onClick={handleEditStudent}
                  >
                    <Edit size={16} className="mr-1" />
                    Editar Aluno
                  </Button>
                )}
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default StudentDetail;
