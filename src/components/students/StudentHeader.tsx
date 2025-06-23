
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, MessageSquare, GraduationCap } from 'lucide-react';
import { Student } from '@/data/studentTypes';

interface StudentHeaderProps {
  student: Student;
  userRole: string;
  getInitials: (name: string) => string;
  getStatusLabel: (status: string) => string;
  getStatusColor: (status: string) => string;
  onEdit: () => void;
  onSendMessage: () => void;
}

const StudentHeader: React.FC<StudentHeaderProps> = ({
  student,
  userRole,
  getInitials,
  getStatusLabel,
  getStatusColor,
  onEdit,
  onSendMessage
}) => {
  return (
    <div className="bg-gradient-to-r from-cbmepi-orange to-cbmepi-red h-32 relative">
      {['admin', 'instructor'].includes(userRole) && (
        <div className="absolute top-4 right-4 flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white hover:bg-gray-100"
            onClick={onEdit}
          >
            <Edit size={16} className="mr-1" />
            Editar
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-white hover:bg-gray-100"
            onClick={onSendMessage}
          >
            <MessageSquare size={16} className="mr-1" />
            Mensagem
          </Button>
        </div>
      )}
      
      <div className="absolute -bottom-16 left-6 w-32 h-32 rounded-full bg-cbmepi-orange text-white flex items-center justify-center text-4xl font-bold border-4 border-white">
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
    </div>
  );
};

export default StudentHeader;
