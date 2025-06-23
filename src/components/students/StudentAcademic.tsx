
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, BarChart, CheckCircle, Clock } from 'lucide-react';
import { getAcademicRecordByStudentId } from '@/data/studentTypes';
import TimelineComponent from './Timeline';
import AttendanceChart from './AttendanceChart';
import PerformanceChart from './PerformanceChart';

interface StudentAcademicProps {
  studentId: string;
  formatDate: (dateString: string) => string;
}

const StudentAcademic: React.FC<StudentAcademicProps> = ({ studentId, formatDate }) => {
  const academicRecord = getAcademicRecordByStudentId(studentId);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <GraduationCap size={18} className="mr-2 text-cbmepi-orange" />
              Histórico Acadêmico
            </CardTitle>
            <CardDescription>
              Cursos e disciplinas do aluno
            </CardDescription>
          </CardHeader>
          <CardContent>
            {academicRecord ? (
              <div>
                <div className="mb-4 pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{academicRecord.courseName}</h3>
                    <Badge 
                      className={
                        academicRecord.status === 'in_progress' 
                          ? 'bg-blue-100 text-blue-800 border-blue-300' 
                          : academicRecord.status === 'completed'
                          ? 'bg-green-100 text-green-800 border-green-300'
                          : 'bg-red-100 text-red-800 border-red-300'
                      }
                    >
                      {academicRecord.status === 'in_progress' 
                        ? 'Em andamento' 
                        : academicRecord.status === 'completed'
                        ? 'Concluído'
                        : 'Desistente'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    Início: {formatDate(academicRecord.startDate)}
                    {academicRecord.endDate && ` • Término: ${formatDate(academicRecord.endDate)}`}
                  </p>
                </div>
                
                <div className="space-y-4 mt-4">
                  <h4 className="font-medium text-sm text-gray-600">Disciplinas:</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left pb-2 font-medium text-sm text-gray-600">Disciplina</th>
                          <th className="text-left pb-2 font-medium text-sm text-gray-600">Status</th>
                          <th className="text-left pb-2 font-medium text-sm text-gray-600">Nota</th>
                          <th className="text-left pb-2 font-medium text-sm text-gray-600">Instrutor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {academicRecord.disciplines.map(discipline => (
                          <tr key={discipline.id} className="border-b border-gray-100 last:border-0">
                            <td className="py-3">{discipline.name}</td>
                            <td className="py-3">
                              <Badge 
                                className={
                                  discipline.status === 'in_progress' 
                                    ? 'bg-blue-100 text-blue-800 border-blue-300' 
                                    : discipline.status === 'completed'
                                    ? 'bg-green-100 text-green-800 border-green-300'
                                    : 'bg-gray-100 text-gray-600 border-gray-300'
                                }
                                variant="outline"
                              >
                                {discipline.status === 'in_progress' 
                                  ? 'Em andamento' 
                                  : discipline.status === 'completed'
                                  ? 'Concluído'
                                  : 'Não iniciado'}
                              </Badge>
                            </td>
                            <td className="py-3">{discipline.grade || '-'}</td>
                            <td className="py-3">{discipline.instructorName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500">
                Nenhum registro acadêmico encontrado para este aluno.
              </p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <BarChart size={18} className="mr-2 text-cbmepi-orange" />
              Desempenho Acadêmico
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <PerformanceChart studentId={studentId} />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <CheckCircle size={18} className="mr-2 text-cbmepi-orange" />
              Frequência
            </CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <AttendanceChart studentId={studentId} />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center">
            <Clock size={18} className="mr-2 text-cbmepi-orange" />
            Linha do Tempo
          </CardTitle>
          <CardDescription>
            Histórico de atividades, avaliações e marcos importantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TimelineComponent studentId={studentId} />
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAcademic;
