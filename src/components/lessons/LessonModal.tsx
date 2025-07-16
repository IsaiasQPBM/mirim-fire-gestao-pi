
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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Save, Plus, BookOpen } from 'lucide-react';

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lesson: any) => void;
  mode: 'create' | 'edit';
  lessonData?: any;
}

const LessonModal: React.FC<LessonModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave,
  mode,
  lessonData 
}) => {
  const [formData, setFormData] = useState({
    title: lessonData?.title || '',
    description: lessonData?.description || '',
    content: lessonData?.content || '',
    classId: lessonData?.classId || '',
    disciplineId: lessonData?.disciplineId || '',
    lessonDate: lessonData?.lessonDate || '',
    startTime: lessonData?.startTime || '08:00',
    endTime: lessonData?.endTime || '10:00',
    resources: lessonData?.resources?.join(', ') || '',
    status: lessonData?.status || 'planned',
  });

  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    if (!formData.title.trim() || !formData.lessonDate || !formData.classId) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha título, data e turma para continuar.",
        variant: "destructive",
      });
      return;
    }

    const lessonToSave = {
      ...formData,
      id: lessonData?.id || `lesson-${Date.now()}`,
      resources: formData.resources.split(',').map(r => r.trim()).filter(r => r),
      instructorId: 'current-user-id', // Would come from auth
    };

    onSave(lessonToSave);
    
    toast({
      title: mode === 'create' ? "Aula criada" : "Aula atualizada",
      description: `A aula foi ${mode === 'create' ? 'criada' : 'atualizada'} com sucesso.`,
    });
    
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            {mode === 'create' ? 'Nova Aula' : 'Editar Aula'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' ? 'Criar uma nova aula no planejamento' : 'Editar informações da aula'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título da Aula *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ex: Introdução aos Primeiros Socorros"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planejada</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="completed">Concluída</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="classId">Turma *</Label>
              <Select value={formData.classId} onValueChange={(value) => handleInputChange('classId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma turma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class-1">Turma A - Manhã</SelectItem>
                  <SelectItem value="class-2">Turma B - Tarde</SelectItem>
                  <SelectItem value="class-3">Turma C - Noite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="disciplineId">Disciplina</Label>
              <Select value={formData.disciplineId} onValueChange={(value) => handleInputChange('disciplineId', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma disciplina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="disc-1">Primeiros Socorros</SelectItem>
                  <SelectItem value="disc-2">Prevenção de Incêndios</SelectItem>
                  <SelectItem value="disc-3">Educação Ambiental</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lessonDate">Data da Aula *</Label>
              <Input
                id="lessonDate"
                type="date"
                value={formData.lessonDate}
                onChange={(e) => handleInputChange('lessonDate', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startTime">Hora Início</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endTime">Hora Fim</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Breve descrição da aula"
              rows={2}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Conteúdo da Aula</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Detalhe o conteúdo que será abordado na aula"
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="resources">Recursos Necessários</Label>
            <Input
              id="resources"
              value={formData.resources}
              onChange={(e) => handleInputChange('resources', e.target.value)}
              placeholder="Ex: Projetor, Boneco de treino, Materiais de primeiros socorros"
            />
            <p className="text-xs text-gray-500">Separe os recursos por vírgula</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} className="bg-cbmepi-orange hover:bg-cbmepi-orange/90">
            <Save className="mr-2 h-4 w-4" />
            {mode === 'create' ? 'Criar Aula' : 'Salvar Alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LessonModal;
