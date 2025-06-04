
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockClasses, mockDisciplines } from '@/data/mockCurriculumData';
import { Lesson } from '@/services/lessonsService';

interface LessonPlanningFormProps {
  formData: Partial<Lesson>;
  setFormData: (data: Partial<Lesson>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  loading?: boolean;
}

const LessonPlanningForm: React.FC<LessonPlanningFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  loading = false
}) => {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle>Criar Novo Plano de Aula</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <Label htmlFor="title">Título da Aula</Label>
            <Input 
              id="title" 
              placeholder="Ex: Introdução à Prevenção de Incêndios"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="class_id">Turma</Label>
              <Select
                value={formData.class_id}
                onValueChange={(value) => setFormData({ ...formData, class_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma turma" />
                </SelectTrigger>
                <SelectContent>
                  {mockClasses.map(classItem => (
                    <SelectItem key={classItem.id} value={classItem.id}>
                      {classItem.name}
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
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma disciplina" />
                </SelectTrigger>
                <SelectContent>
                  {mockDisciplines.map(discipline => (
                    <SelectItem key={discipline.id} value={discipline.id}>
                      {discipline.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <Label htmlFor="lesson_date">Data</Label>
              <Input 
                id="lesson_date" 
                type="date"
                value={formData.lesson_date || ''}
                onChange={(e) => setFormData({ ...formData, lesson_date: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="start_time">Hora de Início</Label>
              <Input 
                id="start_time" 
                type="time"
                value={formData.start_time || ''}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="end_time">Hora de Término</Label>
              <Input 
                id="end_time" 
                type="time"
                value={formData.end_time || ''}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Descrição da Aula</Label>
            <Textarea
              id="description"
              placeholder="Descreva o conteúdo e objetivos da aula"
              className="min-h-24 resize-y"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="content">Conteúdo Programático</Label>
            <Textarea
              id="content"
              placeholder="Detalhe os tópicos que serão abordados na aula"
              className="min-h-32 resize-y"
              value={formData.content || ''}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="resources">Recursos Necessários</Label>
            <Textarea
              id="resources"
              placeholder="Liste os materiais e recursos necessários para a aula (um por linha)"
              className="min-h-24 resize-y"
              value={formData.resources?.join('\n') || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                resources: e.target.value.split('\n').filter(r => r.trim()) 
              })}
            />
          </div>
          
          <div className="pt-4 flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salvar Planejamento'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LessonPlanningForm;
