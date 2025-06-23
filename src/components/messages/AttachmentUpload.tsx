
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Paperclip } from 'lucide-react';

export const AttachmentUpload: React.FC = () => {
  return (
    <div className="space-y-2">
      <Label>Anexos</Label>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <Paperclip className="h-8 w-8 mx-auto text-gray-400 mb-2" />
        <p className="text-gray-500">Clique para adicionar anexos ou arraste arquivos aqui</p>
        <Button variant="outline" className="mt-2">
          Selecionar Arquivos
        </Button>
      </div>
    </div>
  );
};
