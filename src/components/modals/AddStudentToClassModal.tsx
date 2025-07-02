
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Search, User, UserPlus } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  registrationNumber: string;
  status: 'active' | 'inactive';
  enrolledClasses: string[];
}

interface AddStudentToClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  classId: string;
  className: string;
}

const AddStudentToClassModal: React.FC<AddStudentToClassModalProps> = ({
  isOpen,
  onClose,
  classId,
  className
}) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  
  // Mock data - in a real app, this would come from an API
  const mockStudents: Student[] = [
    {
      id: 'std-1',
      name: 'Ana Clara Silva',
      registrationNumber: '2024001',
      status: 'active',
      enrolledClasses: ['class2']
    },
    {
      id: 'std-2',
      name: 'Bruno Santos',
      registrationNumber: '2024002',
      status: 'active',
      enrolledClasses: []
    },
    {
      id: 'std-3',
      name: 'Carla Oliveira',
      registrationNumber: '2024003',
      status: 'active',
      enrolledClasses: ['class3']
    },
    {
      id: 'std-4',
      name: 'Diego Ferreira',
      registrationNumber: '2024004',
      status: 'inactive',
      enrolledClasses: []
    },
    {
      id: 'std-5',
      name: 'Eduarda Costa',
      registrationNumber: '2024005',
      status: 'active',
      enrolledClasses: ['class1', 'class2']
    },
    {
      id: 'std-6',
      name: 'Felipe Rodrigues',
      registrationNumber: '2024006',
      status: 'active',
      enrolledClasses: []
    },
    {
      id: 'std-7',
      name: 'Gabriela Lima',
      registrationNumber: '2024007',
      status: 'active',
      enrolledClasses: ['class3']
    },
    {
      id: 'std-8',
      name: 'Henrique Alves',
      registrationNumber: '2024008',
      status: 'active',
      enrolledClasses: []
    }
  ];

  const filteredStudents = mockStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.registrationNumber.includes(searchTerm);
    const isNotInClass = !student.enrolledClasses.includes(classId);
    return matchesSearch && isNotInClass && student.status === 'active';
  });

  const handleStudentToggle = (studentId: string, checked: boolean) => {
    if (checked) {
      setSelectedStudents(prev => [...prev, studentId]);
    } else {
      setSelectedStudents(prev => prev.filter(id => id !== studentId));
    }
  };

  const handleAddStudents = () => {
    if (selectedStudents.length === 0) {
      toast({
        title: "Nenhum aluno selecionado",
        description: "Selecione pelo menos um aluno para adicionar à turma.",
        variant: "destructive",
      });
      return;
    }

    // Simulate API call
    toast({
      title: "Alunos adicionados",
      description: `${selectedStudents.length} aluno(s) foram adicionados à turma ${className}.`,
    });

    // Reset form and close modal
    setSelectedStudents([]);
    setSearchTerm('');
    onClose();
  };

  const handleClose = () => {
    setSelectedStudents([]);
    setSearchTerm('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-cbmepi-orange" />
            Adicionar Alunos à Turma
          </DialogTitle>
          <DialogDescription>
            Selecione os alunos que deseja adicionar à turma "{className}"
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Pesquisar por nome ou matrícula..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Selected count */}
          {selectedStudents.length > 0 && (
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-cbmepi-orange/10 text-cbmepi-orange border-cbmepi-orange">
                {selectedStudents.length} aluno(s) selecionado(s)
              </Badge>
            </div>
          )}

          {/* Students list */}
          <ScrollArea className="h-[400px] border rounded-lg p-4">
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum aluno encontrado</p>
                <p className="text-sm">
                  {searchTerm ? 'Tente ajustar sua pesquisa' : 'Todos os alunos já estão na turma ou inativos'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <Checkbox
                      id={`student-${student.id}`}
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={(checked) => handleStudentToggle(student.id, checked as boolean)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`student-${student.id}`} className="font-medium cursor-pointer">
                          {student.name}
                        </Label>
                        <Badge variant="outline" className="text-xs">
                          {student.registrationNumber}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {student.enrolledClasses.length > 0 
                          ? `Matriculado em ${student.enrolledClasses.length} turma(s)`
                          : 'Nenhuma turma atual'
                        }
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleAddStudents}
            disabled={selectedStudents.length === 0}
            className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Adicionar {selectedStudents.length > 0 ? `(${selectedStudents.length})` : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentToClassModal;
