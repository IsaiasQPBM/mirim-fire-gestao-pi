
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, MessageSquare, GraduationCap } from 'lucide-react';
import { Student } from '@/data/studentTypes';

interface StudentDetailHeaderProps {
  student: Student;
  userRole: string;
  getInitials: (name: string) => string;
  getStatusLabel: (status: string) => string;
  getStatusColor: (status: string) => string;
  onEdit: () => void;
  onSendMessage: () => void;
}

const StudentDetailHeader: React.FC<StudentDetailHeaderProps> = ({
  student,
  userRole,
  getInitials,
  getStatusLabel,
  getStatusColor,
  onEdit,
  onSendMessage
}) => {
  return (
    <Card className="overflow-hidden border-t-4 border-t-cbmepi-orange shadow-md">
      <div className="relative">
        <div className="h-24 bg-gradient-to-r from-cbmepi-orange to-cbmepi-red"></div>
        <div className="absolute -bottom-6 left-6">
          <div className="w-20 h-20 rounded-full bg-cbmepi-orange text-white flex items-center justify-center font-bold text-xl border-4 border-white shadow-lg">
            {getInitials(student.fullName)}
          </div>
        </div>
      </div>
      
      <CardContent className="pt-12 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-cbmepi-black">{student.fullName}</h2>
            <div className="flex items-center gap-1 text-gray-600 mt-1">
              <GraduationCap size={16} />
              {/* Remover exibição de matrícula e turmas, manter apenas nome e status */}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge className={getStatusColor(student.status)}>
              {getStatusLabel(student.status)}
            </Badge>
            {/* Remover exibição de matrícula e turmas, manter apenas nome e status */}
            {['admin', 'instructor'].includes(userRole) && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onSendMessage}
                >
                  <MessageSquare size={16} className="mr-1" />
                  Mensagem
                </Button>
                <Button
                  size="sm"
                  className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
                  onClick={onEdit}
                >
                  <Edit size={16} className="mr-1" />
                  Editar
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentDetailHeader;
