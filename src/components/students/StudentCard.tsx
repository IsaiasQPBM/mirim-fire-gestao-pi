
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Student } from '@/data/studentTypes';
import { cn } from '@/lib/utils';
import { Calendar, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface StudentCardProps {
  student: Student;
}

const StudentCard: React.FC<StudentCardProps> = ({ student }) => {
  const statusBadgeColor = {
    active: 'bg-green-100 text-green-800 border-green-300',
    inactive: 'bg-red-100 text-red-800 border-red-300',
    on_leave: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  };
  
  const statusLabel = {
    active: 'Ativo',
    inactive: 'Inativo',
    on_leave: 'Em licença'
  };
  
  const getInitials = (name: string) => {
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

  return (
    <Link to={`/students/${student.id}`}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
        <div className="bg-gradient-to-r from-cbmepi-orange to-cbmepi-red h-12" />
        <CardContent className="pt-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-cbmepi-orange text-white flex items-center justify-center text-xl font-bold border-2 border-cbmepi-red -mt-12">
              {student.profileImage ? (
                <img 
                  src={student.profileImage} 
                  alt={student.fullName} 
                  className="w-full h-full object-cover rounded-full" 
                />
              ) : (
                getInitials(student.fullName)
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-cbmepi-black">{student.fullName}</h3>
              <p className="text-sm text-gray-600">Matrícula: {student.registrationNumber}</p>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <Badge className={cn(statusBadgeColor[student.status], 'capitalize')}>
              {statusLabel[student.status]}
            </Badge>
            
            <div className="flex items-center text-xs text-gray-500">
              <Calendar size={14} className="mr-1" />
              {formatDate(student.enrollmentDate)}
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm">
              <GraduationCap size={16} className="text-cbmepi-orange" />
              <span className="font-medium">Turmas:</span>
              <span className="text-gray-600">{student.classIds.length || 'Nenhuma'}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default StudentCard;
