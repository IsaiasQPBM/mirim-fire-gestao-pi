
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { BookOpen, Clock, MapPin, User, Users, FileText, Edit } from 'lucide-react';

interface LessonDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  lesson: {
    id: string;
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    instructorName: string;
    disciplineName: string;
    className: string;
    location: string;
    status: string;
    objectives: string[];
    materials: string[];
    attendance: number;
    totalStudents: number;
  } | null;
  onEdit?: () => void;
}

export const LessonDetailModal: React.FC<LessonDetailModalProps> = ({
  isOpen,
  onOpenChange,
  lesson,
  onEdit
}) => {
  if (!lesson) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'planned':
        return <Badge className="bg-blue-500">Planejada</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Concluída</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-500">Cancelada</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="flex items-center text-xl">
                <BookOpen className="h-6 w-6 mr-2 text-cbmepi-orange" />
                {lesson.title}
              </DialogTitle>
              <p className="text-gray-600 mt-1">{lesson.disciplineName} - {lesson.className}</p>
            </div>
            {getStatusBadge(lesson.status)}
          </div>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-cbmepi-orange" />
                <div>
                  <p className="font-medium">Data e Horário</p>
                  <p className="text-sm text-gray-600">{formatDate(lesson.date)}</p>
                  <p className="text-sm text-gray-600">{lesson.startTime} - {lesson.endTime}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-cbmepi-orange" />
                <div>
                  <p className="font-medium">Local</p>
                  <p className="text-sm text-gray-600">{lesson.location}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-cbmepi-orange" />
                <div>
                  <p className="font-medium">Instrutor</p>
                  <p className="text-sm text-gray-600">{lesson.instructorName}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-cbmepi-orange" />
                <div>
                  <p className="font-medium">Presença</p>
                  <p className="text-sm text-gray-600">
                    {lesson.attendance} de {lesson.totalStudents} alunos
                    {lesson.status === 'completed' && (
                      <span className="ml-2 text-green-600">
                        ({Math.round((lesson.attendance / lesson.totalStudents) * 100)}%)
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-medium mb-2">Descrição</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{lesson.description}</p>
          </div>

          {/* Objectives */}
          {lesson.objectives.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Objetivos da Aula</h3>
              <ul className="list-disc list-inside space-y-1">
                {lesson.objectives.map((objective, index) => (
                  <li key={index} className="text-sm text-gray-600">{objective}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Materials */}
          {lesson.materials.length > 0 && (
            <div>
              <h3 className="font-medium mb-2">Materiais Necessários</h3>
              <ul className="list-disc list-inside space-y-1">
                {lesson.materials.map((material, index) => (
                  <li key={index} className="text-sm text-gray-600">{material}</li>
                ))}
              </ul>
            </div>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
            {onEdit && (
              <Button 
                onClick={onEdit}
                className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar Aula
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
