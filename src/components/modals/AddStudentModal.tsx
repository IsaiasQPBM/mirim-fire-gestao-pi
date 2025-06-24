
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Student {
  id: string;
  name: string;
  registrationNumber: string;
  email: string;
  isEnrolled: boolean;
}

interface AddStudentModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  classId: string;
  className: string;
}

// Mock data for available students
const mockStudents: Student[] = [
  { id: '1', name: 'João Silva Santos', registrationNumber: 'PM2024001', email: 'joao@email.com', isEnrolled: false },
  { id: '2', name: 'Maria Oliveira Costa', registrationNumber: 'PM2024002', email: 'maria@email.com', isEnrolled: false },
  { id: '3', name: 'Pedro Santos Lima', registrationNumber: 'PM2024003', email: 'pedro@email.com', isEnrolled: true },
  { id: '4', name: 'Ana Carolina Souza', registrationNumber: 'PM2024004', email: 'ana@email.com', isEnrolled: false },
  { id: '5', name: 'Lucas Ferreira Reis', registrationNumber: 'PM2024005', email: 'lucas@email.com', isEnrolled: false },
];

export const AddStudentModal: React.FC<AddStudentModalProps> = ({
  isOpen,
  onOpenChange,
  classId,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const { toast } = useToast();

  const filteredStudents = mockStudents.filter(student => 
    !student.isEnrolled && (
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleStudentToggle = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    }
  };

  const handleEnrollStudents = () => {
    if (selectedStudents.length === 0) {
      toast({
        title: "Seleção obrigatória",
        description: "Selecione pelo menos um aluno para matricular.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Alunos matriculados",
      description: `${selectedStudents.length} aluno(s) matriculado(s) na turma ${className}.`,
    });

    setSelectedStudents([]);
    setSearchTerm('');
    onOpenChange(false);
  };

  const handleCancel = () => {
    setSelectedStudents([]);
    setSearchTerm('');
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserPlus className="h-5 w-5 mr-2 text-cbmepi-orange" />
            Adicionar Alunos à Turma {className}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Buscar Alunos</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Busque por nome, matrícula ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Alunos Disponíveis ({filteredStudents.length})</Label>
            <ScrollArea className="h-64 border rounded-md p-4">
              {filteredStudents.length > 0 ? (
                <div className="space-y-3">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                      <Checkbox
                        checked={selectedStudents.includes(student.id)}
                        onCheckedChange={(checked) => handleStudentToggle(student.id, checked as boolean)}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{student.name}</p>
                        <p className="text-xs text-gray-500">Matrícula: {student.registrationNumber}</p>
                        <p className="text-xs text-gray-500">Email: {student.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <UserPlus className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    {searchTerm ? 'Nenhum aluno encontrado com esses critérios.' : 'Nenhum aluno disponível para matrícula.'}
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>

          {selectedStudents.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                {selectedStudents.length} aluno(s) selecionado(s) para matrícula
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button 
              onClick={handleEnrollStudents}
              className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
              disabled={selectedStudents.length === 0}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Matricular Alunos ({selectedStudents.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
