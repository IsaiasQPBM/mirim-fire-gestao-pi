
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, BookOpen } from 'lucide-react';

interface LessonCardProps {
  lesson: any;
  onEdit: (lesson: any) => void;
  onView: (lesson: any) => void;
}

const LessonCard: React.FC<LessonCardProps> = ({ lesson, onEdit, onView }) => {
  const getLessonStatusBadge = (status: string) => {
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

  return (
    <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg mb-1">{lesson.title}</CardTitle>
            <div className="text-sm text-gray-500">{lesson.disciplines?.name}</div>
          </div>
          {getLessonStatusBadge(lesson.status)}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{lesson.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            <span>{new Date(lesson.lesson_date).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            <span>{lesson.start_time} - {lesson.end_time}</span>
          </div>
          <div className="flex items-center text-sm">
            <BookOpen className="h-4 w-4 mr-2 text-gray-500" />
            <span>{lesson.classes?.name}</span>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          {lesson.status === 'planned' ? (
            <Button
              variant="outline"
              size="sm"
              className="text-cbmepi-orange border-cbmepi-orange hover:bg-cbmepi-orange hover:text-white"
              onClick={() => onEdit(lesson)}
            >
              Editar Plano
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(lesson)}
            >
              Ver Detalhes
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonCard;
