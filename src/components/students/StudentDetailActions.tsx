
import React from 'react';
import { CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, Edit } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StudentDetailActionsProps {
  userRole: string;
  onBackToList: () => void;
  onPrintProfile: () => void;
  onEditStudent: () => void;
}

const StudentDetailActions: React.FC<StudentDetailActionsProps> = ({
  userRole,
  onBackToList,
  onPrintProfile,
  onEditStudent
}) => {
  return (
    <CardFooter className="border-t bg-gray-50 py-4">
      <div className="flex justify-between items-center w-full">
        <Button 
          variant="outline"
          size="sm"
          onClick={onBackToList}
        >
          <Users size={16} className="mr-1" />
          Voltar para Lista
        </Button>
        
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onPrintProfile}
                >
                  <FileText size={16} className="mr-1" />
                  Exportar PDF
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Exportar boletim individual como PDF</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          {['admin', 'instructor'].includes(userRole) && (
            <Button
              size="sm"
              className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
              onClick={onEditStudent}
            >
              <Edit size={16} className="mr-1" />
              Editar Aluno
            </Button>
          )}
        </div>
      </div>
    </CardFooter>
  );
};

export default StudentDetailActions;
