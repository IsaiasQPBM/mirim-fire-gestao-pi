
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Users, User, BookOpen, PenLine } from 'lucide-react';
import { Class, Lesson } from '@/data/curriculumTypes';

interface ClassTabsProps {
  classData: Class;
  lessons: Lesson[];
  isAdmin: boolean;
  isInstructor: boolean;
  onAddStudent: () => void;
  onAddInstructor: () => void;
  onNewLesson: () => void;
  onEditLesson: (lessonId: string) => void;
  onViewProfile: (studentId: string) => void;
}

const ClassTabs: React.FC<ClassTabsProps> = ({
  classData,
  lessons,
  isAdmin,
  isInstructor,
  onAddStudent,
  onAddInstructor,
  onNewLesson,
  onEditLesson,
  onViewProfile
}) => {
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
    <Tabs defaultValue="students" className="space-y-6">
      <TabsList className="bg-white border border-gray-200 grid grid-cols-3 w-full md:w-auto">
        <TabsTrigger value="students" className="text-xs md:text-sm">
          Alunos ({classData.studentIds.length})
        </TabsTrigger>
        <TabsTrigger value="instructors" className="text-xs md:text-sm">
          Instrutores ({classData.instructorIds.length})
        </TabsTrigger>
        <TabsTrigger value="lessons" className="text-xs md:text-sm">
          Aulas ({lessons.length})
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="students" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold text-cbmepi-black">Alunos Matriculados</h2>
          
          {isAdmin && (
            <Button 
              className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
              onClick={onAddStudent}
              size="sm"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Aluno
            </Button>
          )}
        </div>
        
        {classData.studentIds.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 text-center">
            <Users className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum aluno matriculado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Esta turma ainda não possui alunos matriculados.
            </p>
            {isAdmin && (
              <div className="mt-6">
                <Button 
                  className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                  onClick={onAddStudent}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Matricular Primeiro Aluno
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Aluno</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classData.studentIds.map((studentId) => (
                      <TableRow key={studentId}>
                        <TableCell className="font-medium">{studentId}</TableCell>
                        <TableCell>Nome do Aluno (Simulado)</TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => onViewProfile(studentId)}
                          >
                            Ver Perfil
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </TabsContent>
      
      <TabsContent value="instructors" className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-cbmepi-black">Instrutores da Turma</h2>
          
          {isAdmin && (
            <Button 
              className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
              onClick={onAddInstructor}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Adicionar Instrutor
            </Button>
          )}
        </div>
        
        {classData.instructorIds.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhum instrutor designado</h3>
            <p className="mt-1 text-sm text-gray-500">
              Esta turma ainda não possui instrutores designados.
            </p>
            {isAdmin && (
              <div className="mt-6">
                <Button 
                  className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                  onClick={onAddInstructor}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Designar Primeiro Instrutor
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Instrutor</TableHead>
                    {isAdmin && <TableHead className="text-right">Ações</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {classData.instructorIds.map((instructorId) => (
                    <TableRow key={instructorId}>
                      <TableCell className="font-medium">{instructorId}</TableCell>
                      <TableCell>Nome do Instrutor (Simulado)</TableCell>
                      {isAdmin && (
                        <TableCell className="text-right">
                          <Button variant="outline" size="sm">
                            Ver Perfil
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </TabsContent>
      
      <TabsContent value="lessons" className="space-y-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-cbmepi-black">Aulas Programadas</h2>
          
          {isInstructor && (
            <Button 
              className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
              onClick={onNewLesson}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Nova Aula
            </Button>
          )}
        </div>
        
        {lessons.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Nenhuma aula programada</h3>
            <p className="mt-1 text-sm text-gray-500">
              Esta turma ainda não possui aulas programadas.
            </p>
            {isInstructor && (
              <div className="mt-6">
                <Button 
                  className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                  onClick={onNewLesson}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Programar Primeira Aula
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {lessons.map((lesson) => (
              <Card key={lesson.id} className="border border-gray-200 shadow-sm">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{lesson.title}</CardTitle>
                      <CardDescription>{new Date(lesson.date).toLocaleDateString('pt-BR')} | {lesson.startTime} - {lesson.endTime}</CardDescription>
                    </div>
                    {getLessonStatusBadge(lesson.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{lesson.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Instrutor:</p>
                      <p>{lesson.instructorId}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Disciplina:</p>
                      <p>{lesson.disciplineId}</p>
                    </div>
                  </div>
                  
                  {lesson.resources.length > 0 && (
                    <div className="mt-4">
                      <p className="text-gray-500 text-sm mb-1">Recursos:</p>
                      <ul className="list-disc list-inside text-sm text-gray-600">
                        {lesson.resources.map((resource, index) => (
                          <li key={index}>{resource}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {isInstructor && (
                    <div className="flex justify-end mt-4 space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-cbmepi-orange border-cbmepi-orange hover:bg-cbmepi-orange hover:text-white"
                        onClick={() => onEditLesson(lesson.id)}
                      >
                        <PenLine className="mr-2 h-4 w-4" />
                        Editar Aula
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default ClassTabs;
