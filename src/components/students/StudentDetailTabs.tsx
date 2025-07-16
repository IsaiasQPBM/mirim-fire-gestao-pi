
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { User, BookOpen, Clipboard, MessageSquare, FileText, Plus } from 'lucide-react';
import { Student } from '@/data/studentTypes';
import StudentInfo from './StudentInfo';
import StudentAcademic from './StudentAcademic';
import PedagogicalObservations from './PedagogicalObservations';
import DocumentsList from './DocumentsList';
import StudentCommunications from './StudentCommunications';

interface StudentDetailTabsProps {
  student: Student;
  userRole: string;
  formatDate: (dateString: string) => string;
  onAddObservation: () => void;
  editMode?: boolean;
  EditFormComponent?: React.ReactNode;
}

const StudentDetailTabs: React.FC<StudentDetailTabsProps> = ({
  student,
  userRole,
  formatDate,
  onAddObservation,
  editMode = false,
  EditFormComponent
}) => {
  return (
    <Tabs defaultValue="info" className="mt-8">
      <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-6">
        <TabsTrigger value="info">
          <User size={16} className="mr-2 hidden md:inline" />
          Informações
        </TabsTrigger>
        <TabsTrigger value="academic">
          <BookOpen size={16} className="mr-2 hidden md:inline" />
          Acadêmico
        </TabsTrigger>
        <TabsTrigger value="observations">
          <Clipboard size={16} className="mr-2 hidden md:inline" />
          Observações
        </TabsTrigger>
        <TabsTrigger value="documents">
          <FileText size={16} className="mr-2 hidden md:inline" />
          Documentos
        </TabsTrigger>
        <TabsTrigger value="communications">
          <MessageSquare size={16} className="mr-2 hidden md:inline" />
          Comunicações
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="info">
        {editMode && EditFormComponent ? EditFormComponent : <StudentInfo student={student} formatDate={formatDate} />}
      </TabsContent>
      
      <TabsContent value="academic">
        <StudentAcademic studentId={student.id} formatDate={formatDate} />
      </TabsContent>
      
      <TabsContent value="observations">
        <div className="space-y-4">
          {['admin', 'instructor'].includes(userRole) && (
            <div className="flex justify-end">
              <Button 
                onClick={onAddObservation}
                className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
              >
                <Plus size={16} className="mr-1" />
                Nova Observação
              </Button>
            </div>
          )}
          <PedagogicalObservations studentId={student.id} />
        </div>
      </TabsContent>
      
      <TabsContent value="documents">
        <DocumentsList student={student} userRole={userRole} />
      </TabsContent>
      
      <TabsContent value="communications">
        <StudentCommunications 
          studentId={student.id} 
          studentName={student.fullName} 
          userRole={userRole}
        />
      </TabsContent>
    </Tabs>
  );
};

export default StudentDetailTabs;
