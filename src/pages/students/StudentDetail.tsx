
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardFooter
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { 
  User, 
  BookOpen, 
  Clipboard,
  MessageSquare,
  FileText,
  Edit,
  Users,
  Plus,
  GraduationCap,
  BarChart3,
  Calendar
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
import { getStudentById, Student } from '@/data/studentTypes';
import { useToast } from '@/hooks/use-toast';
import PedagogicalObservations from '@/components/students/PedagogicalObservations';
import StudentCommunications from '@/components/students/StudentCommunications';
import DocumentsList from '@/components/students/DocumentsList';
import StudentEditForm from '@/components/students/StudentEditForm';
import MessageModal from '@/components/students/MessageModal';
import ObservationForm from '@/components/students/ObservationForm';
import StudentHeader from '@/components/students/StudentHeader';
import StudentInfo from '@/components/students/StudentInfo';
import StudentAcademic from '@/components/students/StudentAcademic';
import { PDFService } from '@/components/PDFService';

const StudentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showObservationForm, setShowObservationForm] = useState(false);
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
    if (['admin', 'instructor'].includes(userRole)) return true;
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
    setIsEditing(true);
  };
  
  const handleSaveStudent = (updatedStudent: Student) => {
    setStudent(updatedStudent);
    setIsEditing(false);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };
  
  const handleSendMessage = () => {
    setShowMessageModal(true);
  };
  
  const handlePrintProfile = () => {
    if (student) {
      PDFService.generateStudentBulletin(student);
      toast({
        title: "Perfil exportado",
        description: "O boletim individual do aluno foi gerado para impressão.",
      });
    }
  };

  const handleAddObservation = () => {
    setShowObservationForm(true);
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
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/students">Alunos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Aluno não encontrado</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
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
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/students">Alunos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Acesso Restrito</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
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

  if (isEditing) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <Header title="Editar Aluno" userRole={userRole} userName={userName} />
        <div className="max-w-7xl mx-auto mt-6">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/students">Alunos</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/students/${student.id}`}>{student.fullName}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Editar</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <StudentEditForm 
            student={student}
            onSave={handleSaveStudent}
            onCancel={handleCancelEdit}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Header title="Perfil do Aluno" userRole={userRole} userName={userName} />
      
      <div className="max-w-7xl mx-auto mt-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/students">Alunos</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{student.fullName}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card className="overflow-hidden border-t-4 border-t-cbmepi-orange shadow-md">
          <StudentHeader
            student={student}
            userRole={userRole}
            getInitials={getInitials}
            getStatusLabel={getStatusLabel}
            getStatusColor={getStatusColor}
            onEdit={handleEditStudent}
            onSendMessage={handleSendMessage}
          />
          
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

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/students/${id}/grades`)}
                className="flex items-center gap-2"
              >
                <BarChart3 size={16} />
                Ver Notas
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/students/${id}/schedule`)}
                className="flex items-center gap-2"
              >
                <Calendar size={16} />
                Cronograma
              </Button>
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
              
              <TabsContent value="info">
                <StudentInfo student={student} formatDate={formatDate} />
              </TabsContent>
              
              <TabsContent value="academic">
                <StudentAcademic studentId={student.id} formatDate={formatDate} />
              </TabsContent>
              
              <TabsContent value="observations">
                <div className="space-y-4">
                  {['admin', 'instructor'].includes(userRole) && (
                    <div className="flex justify-end">
                      <Button 
                        onClick={handleAddObservation}
                        className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
                      >
                        <Plus size={16} className="mr-1" />
                        Nova Observação
                      </Button>
                    </div>
                  )}
                  <PedagogicalObservations studentId={student.id} />
                </div>
              </TabsContent>
              
              <TabsContent value="documents">
                <DocumentsList student={student} userRole={userRole} />
              </TabsContent>
              
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
                        Exportar PDF
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">Exportar boletim individual como PDF</p>
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

      {showMessageModal && (
        <MessageModal
          isOpen={showMessageModal}
          onClose={() => setShowMessageModal(false)}
          studentName={student.fullName}
          studentId={student.id}
        />
      )}

      {showObservationForm && (
        <ObservationForm
          isOpen={showObservationForm}
          onClose={() => setShowObservationForm(false)}
          studentName={student.fullName}
          studentId={student.id}
        />
      )}
    </div>
  );
};

export default StudentDetail;
