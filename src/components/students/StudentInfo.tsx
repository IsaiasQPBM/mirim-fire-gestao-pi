
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, MapPin, Users, AlertCircle, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Student } from '@/data/studentTypes';

interface StudentInfoProps {
  student: Student;
  formatDate: (dateString: string) => string;
}

const StudentInfo: React.FC<StudentInfoProps> = ({ student, formatDate }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <User size={18} className="mr-2 text-cbmepi-orange" />
              Dados Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Nome Completo</p>
              <p>{student.fullName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p>{student.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Status</p>
              <p>{student.status}</p>
            </div>
          </CardContent>
        </Card>
        
      </div>
      
    </div>
  );
};

export default StudentInfo;
