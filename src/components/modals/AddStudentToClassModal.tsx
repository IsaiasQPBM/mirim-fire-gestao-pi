
import React, { useState, useEffect } from 'react';
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
import { supabase } from '@/lib/supabase';

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
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const fetchStudents = async () => {
      setLoading(true);
      // Busca todos os alunos ativos
      const { data: allStudents, error } = await supabase
        .from('students')
        .select('id, registration_number, status, user_id, profiles:profiles(full_name)')
        .eq('status', 'active');
      if (error) {
        setStudents([]);
        setLoading(false);
        return;
      }
      // Busca IDs dos alunos já matriculados na turma
      const { data: enrolled, error: errorEnrolled } = await supabase
        .from('class_students')
        .select('student_id')
        .eq('class_id', classId);
      const enrolledIds = (enrolled || []).map((e: any) => e.student_id);
      // Filtra alunos que não estão na turma
      const available = (allStudents || [])
        .filter((student: any) => !enrolledIds.includes(student.id))
        .map((student: any) => ({
          id: student.id,
          name: student.profiles?.full_name || '',
          registrationNumber: student.registration_number,
          status: student.status,
          enrolledClasses: [], // não usado aqui
        }));
      setStudents(available);
      setLoading(false);
    };
    fetchStudents();
  }, [isOpen, classId]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.registrationNumber.includes(searchTerm);
    return matchesSearch && student.status === 'active';
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
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                <p>Carregando alunos...</p>
              </div>
            ) : filteredStudents.length === 0 ? (
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
