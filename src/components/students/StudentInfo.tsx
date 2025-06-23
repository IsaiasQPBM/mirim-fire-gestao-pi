
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
              <p className="text-sm font-medium text-gray-500">Matrícula</p>
              <p>{student.registrationNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Data de Nascimento</p>
              <p>{formatDate(student.birthDate)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Data de Matrícula</p>
              <p>{formatDate(student.enrollmentDate)}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Phone size={18} className="mr-2 text-cbmepi-orange" />
              Contato
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p>{student.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Telefone</p>
              <p>{student.phone}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <MapPin size={18} className="mr-2 text-cbmepi-orange" />
              Endereço
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Logradouro</p>
              <p>{student.address.street}, {student.address.number}
                {student.address.complement && `, ${student.address.complement}`}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Bairro</p>
              <p>{student.address.neighborhood}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Cidade/Estado</p>
              <p>{student.address.city}/{student.address.state}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">CEP</p>
              <p>{student.address.zipCode}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Users size={18} className="mr-2 text-cbmepi-orange" />
              Responsáveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {student.guardians.map(guardian => (
              <div key={guardian.id} className="mb-4 pb-4 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{guardian.name}</p>
                  {guardian.isEmergencyContact && (
                    <Badge variant="outline" className="text-xs">
                      <AlertCircle size={12} className="mr-1 text-red-500" />
                      Emergência
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500">{guardian.relationship}</p>
                <div className="mt-2 flex flex-col text-sm">
                  <div className="flex items-center gap-1">
                    <Phone size={14} className="text-gray-400" />
                    <span>{guardian.phone}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail size={14} className="text-gray-400" />
                    <span>{guardian.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
      
      {student.notes && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <User size={18} className="mr-2 text-cbmepi-orange" />
              Anotações Administrativas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{student.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentInfo;
