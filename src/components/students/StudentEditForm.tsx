
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Student } from '@/data/studentTypes';
import { useToast } from '@/hooks/use-toast';
import { Save, X } from 'lucide-react';
import { studentService } from '@/services/api';
import { userService } from '@/services/api';

interface StudentEditFormProps {
  student: Student;
  onSave: (updatedStudent: Student) => void;
  onCancel: () => void;
  saving?: boolean;
}

const StudentEditForm: React.FC<StudentEditFormProps> = ({ student, onSave, onCancel, saving = false }) => {
  const [formData, setFormData] = useState({
    fullName: student.fullName,
    email: student.email,
    status: student.status,
  });
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedStudent: Student = {
      ...student,
      ...formData
    };

    try {
      if (!student.id) {
        // Novo aluno: criar no Supabase
        const created = await studentService.create({
          status: updatedStudent.status as string,
        });
        onSave({
          ...updatedStudent,
          ...created,
          status: created.status as string,
        });
        toast({
          title: "Aluno cadastrado",
          description: "O aluno foi cadastrado com sucesso.",
        });
      } else {
        // Atualiza perfil em profiles
        if (student.userId) {
          await userService.update(student.userId, {
            full_name: formData.fullName,
            email: formData.email,
          });
        }
        // Atualiza aluno em students
        await studentService.update(student.id, {
          status: formData.status,
        });
        onSave(updatedStudent);
        toast({
          title: "Aluno atualizado",
          description: "Os dados do aluno foram atualizados com sucesso.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erro ao salvar aluno",
        description: error.message || "Ocorreu um erro ao salvar o aluno.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Editar Dados do Aluno
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* Dados Pessoais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Ativo</SelectItem>
                  <SelectItem value="inactive">Inativo</SelectItem>
                  <SelectItem value="on_leave">Em licença</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={student.notes || ''}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={4}
              placeholder="Observações gerais sobre o aluno..."
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
            <X size={16} className="mr-1" />
            Cancelar
          </Button>
          <Button type="submit" disabled={saving} className="bg-cbmepi-orange hover:bg-cbmepi-orange/90">
            {saving ? <Save className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
            Salvar Alterações
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default StudentEditForm;
