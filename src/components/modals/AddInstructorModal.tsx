
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Instructor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  isAssigned: boolean;
}

interface AddInstructorModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  classId: string;
  className: string;
}

// Mock data for available instructors
// const mockInstructors: Instructor[] = [
//   { id: '1', name: 'Capitão José Silva', email: 'jose.silva@cbmepi.org', specialization: 'Combate a Incêndio', isAssigned: false },
//   { id: '2', name: 'Tenente Maria Santos', email: 'maria.santos@cbmepi.org', specialization: 'Primeiros Socorros', isAssigned: false },
//   { id: '3', name: 'Sargento Pedro Lima', email: 'pedro.lima@cbmepi.org', specialization: 'Resgate', isAssigned: true },
//   { id: '4', name: 'Cabo Ana Costa', email: 'ana.costa@cbmepi.org', specialization: 'Prevenção', isAssigned: false },
//   { id: '5', name: 'Soldado Lucas Reis', email: 'lucas.reis@cbmepi.org', specialization: 'Salvamento Aquático', isAssigned: false },
// ];

export const AddInstructorModal: React.FC<AddInstructorModalProps> = ({
  isOpen,
  onOpenChange,
  classId,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInstructors, setSelectedInstructors] = useState<string[]>([]);
  const { toast } = useToast();

  // TODO: Integrar com Supabase
  const filteredInstructors: Instructor[] = [];

  const handleInstructorToggle = (instructorId: string, checked: boolean) => {
    if (checked) {
      setSelectedInstructors(prev => [...prev, instructorId]);
    } else {
      setSelectedInstructors(prev => prev.filter(id => id !== instructorId));
    }
  };

  const handleAssignInstructors = () => {
    if (selectedInstructors.length === 0) {
      toast({
        title: "Seleção obrigatória",
        description: "Selecione pelo menos um instrutor para designar.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Instrutores designados",
      description: `${selectedInstructors.length} instrutor(es) designado(s) para a turma ${className}.`,
    });

    setSelectedInstructors([]);
    setSearchTerm('');
    onOpenChange(false);
  };

  const handleCancel = () => {
    setSelectedInstructors([]);
    setSearchTerm('');
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <UserCheck className="h-5 w-5 mr-2 text-cbmepi-orange" />
            Adicionar Instrutores à Turma {className}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Buscar Instrutores</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Busque por nome, email ou especialização..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Instrutores Disponíveis ({filteredInstructors.length})</Label>
            <ScrollArea className="h-64 border rounded-md p-4">
              {filteredInstructors.length > 0 ? (
                <div className="space-y-3">
                  {filteredInstructors.map((instructor) => (
                    <div key={instructor.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                      <Checkbox
                        checked={selectedInstructors.includes(instructor.id)}
                        onCheckedChange={(checked) => handleInstructorToggle(instructor.id, checked as boolean)}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{instructor.name}</p>
                        <p className="text-xs text-gray-500">Email: {instructor.email}</p>
                        <p className="text-xs text-gray-500">Especialização: {instructor.specialization}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <UserCheck className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500">
                    {searchTerm ? 'Nenhum instrutor encontrado com esses critérios.' : 'Nenhum instrutor disponível para designação.'}
                  </p>
                </div>
              )}
            </ScrollArea>
          </div>

          {selectedInstructors.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                {selectedInstructors.length} instrutor(es) selecionado(s) para designação
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button 
              onClick={handleAssignInstructors}
              className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
              disabled={selectedInstructors.length === 0}
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Designar Instrutores ({selectedInstructors.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
