
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { lessonsService, Lesson } from '@/services/lessonsService';
import { mockClasses, mockDisciplines } from '@/data/mockCurriculumData';

interface LessonDialogProps {
  lesson?: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLessonUpdated?: () => void;
  mode: 'edit' | 'view';
}

const LessonDialog: React.FC<LessonDialogProps> = ({ 
  lesson, 
  open, 
  onOpenChange, 
  onLessonUpdated,
  mode 
}) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Lesson>>(lesson || {});
  const { toast } = useToast();

  const isReadOnly = mode === 'view';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    setLoading(true);

    try {
      if (lesson?.id) {
        await lessonsService.updateLesson(lesson.id, formData);
        toast({
          title: 'Aula atualizada',
          description: 'O plano de aula foi atualizado com sucesso!',
        });
      }
      onOpenChange(false);
      onLessonUpdated?.();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar aula',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isReadOnly ? 'Detalhes da Aula' : 'Editar Plano de Aula'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Título da Aula</Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              readOnly={isReadOnly}
              required={!isReadOnly}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="class_id">Turma</Label>
              <Select
                value={formData.class_id}
                onValueChange={(value) => setFormData({ ...formData, class_id: value })}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma turma" />
                </SelectTrigger>
                <SelectContent>
                  {mockClasses.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="discipline_id">Disciplina</Label>
              <Select
                value={formData.discipline_id}
                onValueChange={(value) => setFormData({ ...formData, discipline_id: value })}
                disabled={isReadOnly}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma disciplina" />
                </SelectTrigger>
                <SelectContent>
                  {mockDisciplines.map((discipline) => (
                    <SelectItem key={discipline.id} value={discipline.id}>
                      {discipline.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="lesson_date">Data</Label>
              <Input
                id="lesson_date"
                type="date"
                value={formData.lesson_date || ''}
                onChange={(e) => setFormData({ ...formData, lesson_date: e.target.value })}
                readOnly={isReadOnly}
                required={!isReadOnly}
              />
            </div>
            <div>
              <Label htmlFor="start_time">Hora Início</Label>
              <Input
                id="start_time"
                type="time"
                value={formData.start_time || ''}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                readOnly={isReadOnly}
                required={!isReadOnly}
              />
            </div>
            <div>
              <Label htmlFor="end_time">Hora Fim</Label>
              <Input
                id="end_time"
                type="time"
                value={formData.end_time || ''}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                readOnly={isReadOnly}
                required={!isReadOnly}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição da Aula</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              readOnly={isReadOnly}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="content">Conteúdo Programático</Label>
            <Textarea
              id="content"
              value={formData.content || ''}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              readOnly={isReadOnly}
              rows={4}
            />
          </div>

          <div>
            <Label htmlFor="resources">Recursos Necessários</Label>
            <Textarea
              id="resources"
              value={formData.resources?.join('\n') || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                resources: e.target.value.split('\n').filter(r => r.trim()) 
              })}
              readOnly={isReadOnly}
              rows={3}
              placeholder="Digite um recurso por linha"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {isReadOnly ? 'Fechar' : 'Cancelar'}
            </Button>
            {!isReadOnly && (
              <Button type="submit" disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LessonDialog;
