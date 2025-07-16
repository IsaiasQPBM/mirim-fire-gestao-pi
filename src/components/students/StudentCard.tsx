
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Calendar, GraduationCap, Eye, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface StudentCardProps {
  student: any;
  onView?: () => void;
  onEdit?: (e: React.MouseEvent) => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ student, onView, onEdit }) => {
  const statusBadgeColor = {
    active: 'bg-green-500 text-white',
    inactive: 'bg-red-500 text-white',
    on_leave: 'bg-orange-500 text-white'
  };
  
  const statusLabel = {
    active: 'Ativo',
    inactive: 'Inativo',
    on_leave: 'Em licença'
  };

  const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') {
      return '??';
    }
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'dd/MM/yyyy', { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };

  const name = student.profiles?.full_name || 'Nome não disponível';
  const registration = student.registration_number || 'N/A';
  const status = student.status || 'active';
  const enrollmentDate = student.enrollment_date || student.created_at || '';
  const classCount = Array.isArray(student.class_ids) ? student.class_ids.length : 0;

  return (
    <Card className="rounded-xl bg-white shadow-sm p-5 border border-gray-200 hover:shadow-md transition-all duration-200 ease-in-out cursor-pointer">
      <CardContent className="p-0">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center text-xl font-bold border-4 border-white shadow-lg">
            {getInitials(name)}
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-700 text-lg">{name}</h3>
            <p className="text-sm text-gray-600">Matrícula: {registration}</p>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <Badge className={cn(statusBadgeColor[status], 'rounded-full px-3 py-1 text-xs font-semibold')}>
            {statusLabel[status] || status}
          </Badge>
          <div className="flex items-center text-xs text-gray-500">
            <Calendar size={14} className="mr-1" />
            {enrollmentDate ? formatDate(enrollmentDate) : 'Data não informada'}
          </div>
        </div>
        <div className="pt-3 border-t border-gray-200 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <GraduationCap size={16} className="text-orange-500" />
            <span className="font-medium text-gray-700">Turmas:</span>
            <span className="text-gray-600">{classCount}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onView}
            className="flex-1 bg-orange-500 text-white font-semibold rounded-lg px-3 py-2 text-sm hover:bg-orange-600 transition-all duration-200 ease-in-out flex items-center justify-center gap-2"
          >
            <Eye size={14} />
            Ver
          </button>
          <button
            onClick={onEdit}
            className="border-orange-400 text-orange-500 hover:bg-orange-50 rounded-lg px-3 py-2 text-sm transition-all duration-200 ease-in-out flex items-center justify-center gap-2"
          >
            <Edit size={14} />
            Editar
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCard;
