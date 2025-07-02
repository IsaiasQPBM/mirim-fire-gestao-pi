
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, MapPin, Clock } from 'lucide-react';
import { Class } from '@/data/curriculumTypes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ClassHeaderProps {
  classData: Class;
  isAdmin: boolean;
  onEdit: () => void;
}

const ClassHeader: React.FC<ClassHeaderProps> = ({ classData, isAdmin, onEdit }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Em andamento</Badge>;
      case 'upcoming':
        return <Badge className="bg-blue-500">Programada</Badge>;
      case 'concluded':
        return <Badge className="bg-gray-500">Concluída</Badge>;
      default:
        return <Badge>Desconhecido</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center">
          <Users className="h-6 w-6 text-cbmepi-red mr-2" />
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-cbmepi-black">{classData.name}</h1>
            <p className="text-gray-600 text-sm md:text-base font-medium">{classData.courseName}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {getStatusBadge(classData.status)}
          
          {isAdmin && (
            <Button 
              onClick={onEdit}
              variant="outline" 
              size="sm"
              className="border-cbmepi-orange text-cbmepi-orange hover:bg-cbmepi-orange hover:text-white"
            >
              Editar Turma
            </Button>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Período</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-3 pt-0">
            <Calendar className="h-5 w-5 text-cbmepi-orange" />
            <div>
              <p className="text-sm">{new Date(classData.startDate).toLocaleDateString('pt-BR')} a</p>
              <p className="text-sm">{new Date(classData.endDate).toLocaleDateString('pt-BR')}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Horários</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-3 pt-0">
            <Clock className="h-5 w-5 text-cbmepi-orange" />
            <p className="text-sm">{classData.timeSchedule}</p>
          </CardContent>
        </Card>
        
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Local</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center space-x-3 pt-0">
            <MapPin className="h-5 w-5 text-cbmepi-orange" />
            <p className="text-sm">{classData.location}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClassHeader;
