import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Loader2, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import { Student } from '@/data/studentTypes';
import { studentService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import StudentEditForm from '@/components/students/StudentEditForm';

const StudentEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    studentService.getById(id)
      .then((data) => {
        if (!data) {
          toast({
            title: 'Aluno não encontrado',
            description: 'O aluno solicitado não existe.',
            variant: 'destructive',
          });
          navigate('/students');
          return;
        }
        // Mapeamento para o tipo Student
        const mappedStudent: Student = {
          id: data.id,
          userId: data.user_id || '',
          fullName: data.profiles?.full_name || '',
          registrationNumber: data.registration_number || '',
          birthDate: data.birth_date || data.profiles?.birth_date || '',
          email: data.profiles?.email || '',
          phone: data.phone || data.profiles?.phone || '',
          profileImage: data.profile_image || '',
          status: data.status as any,
          classIds: [],
          courseIds: [],
          enrollmentDate: data.enrollment_date || '',
          guardians: Array.isArray(data.guardians) ? data.guardians.map((g: any) => ({
            id: g.id,
            name: g.name,
            relationship: g.relationship,
            phone: g.phone || '',
            email: g.email || '',
            isEmergencyContact: g.is_emergency_contact || false,
          })) : [],
          documents: Array.isArray(data.student_documents) ? data.student_documents.map((d: any) => ({
            id: d.id,
            name: d.name,
            type: d.type,
            uploadDate: d.upload_date,
            filePath: d.file_path,
            notes: d.notes || '',
          })) : [],
          notes: data.notes || '',
          address: typeof data.address === 'object' && data.address !== null && !Array.isArray(data.address)
            ? data.address as any
            : { street: '', number: '', neighborhood: '', city: '', state: '', zipCode: '' },
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        };
        setStudent(mappedStudent);
      })
      .catch((error) => {
        toast({
          title: 'Erro ao buscar aluno',
          description: error.message || 'Não foi possível carregar os dados do aluno.',
          variant: 'destructive',
        });
        navigate('/students');
      })
      .finally(() => setLoading(false));
  }, [id, navigate, toast]);

  const handleSave = (updatedStudent: Student) => {
    setSaving(true);
    setStudent(updatedStudent);
    toast({
      title: 'Aluno atualizado',
      description: 'Os dados do aluno foram salvos com sucesso.',
      variant: 'default',
    });
    setSaving(false);
    navigate(`/students/${updatedStudent.id}`);
  };

  const handleCancel = () => {
    navigate(`/students/${id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-cbmepi-orange" />
        <span className="ml-2 text-cbmepi-orange">Carregando dados do aluno...</span>
      </div>
    );
  }

  if (!student) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Editar Aluno" userRole={localStorage.getItem('userRole') || ''} userName={localStorage.getItem('userName') || ''} />
      <div className="max-w-4xl mx-auto mt-8">
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Editar Dados do Aluno</CardTitle>
            <Button variant="outline" onClick={handleCancel}>
              <ArrowLeft className="h-4 w-4 mr-1" /> Voltar
            </Button>
          </CardHeader>
          <CardContent>
            <StudentEditForm student={student} onSave={handleSave} onCancel={handleCancel} saving={saving} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentEditPage; 