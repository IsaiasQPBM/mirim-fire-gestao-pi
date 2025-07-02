
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Header from '@/components/Header';
import { getStudentById, Student } from '@/data/studentTypes';
import { useToast } from '@/hooks/use-toast';
import StudentEditForm from '@/components/students/StudentEditForm';
import MessageModal from '@/components/students/MessageModal';
import ObservationForm from '@/components/students/ObservationForm';
import StudentDetailHeader from '@/components/students/StudentDetailHeader';
import StudentDetailTabs from '@/components/students/StudentDetailTabs';
import StudentDetailActions from '@/components/students/StudentDetailActions';
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
  
  const handleEditStudent = () => setIsEditing(true);
  const handleSaveStudent = (updatedStudent: Student) => {
    setStudent(updatedStudent);
    setIsEditing(false);
  };
  const handleCancelEdit = () => setIsEditing(false);
  const handleSendMessage = () => setShowMessageModal(true);
  const handleAddObservation = () => setShowObservationForm(true);
  const handleBackToList = () => navigate('/students');
  
  const handlePrintProfile = () => {
    if (student) {
      PDFService.generateStudentBulletin(student);
      toast({
        title: "Perfil exportado",
        description: "O boletim individual do aluno foi gerado para impressão.",
      });
    }
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

        <div className="space-y-6">
          <StudentDetailHeader
            student={student}
            userRole={userRole}
            getInitials={getInitials}
            getStatusLabel={getStatusLabel}
            getStatusColor={getStatusColor}
            onEdit={handleEditStudent}
            onSendMessage={handleSendMessage}
          />
          
          <Card>
            <StudentDetailTabs
              student={student}
              userRole={userRole}
              formatDate={formatDate}
              onAddObservation={handleAddObservation}
            />
            
            <StudentDetailActions
              userRole={userRole}
              onBackToList={handleBackToList}
              onPrintProfile={handlePrintProfile}
              onEditStudent={handleEditStudent}
            />
          </Card>
        </div>
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
