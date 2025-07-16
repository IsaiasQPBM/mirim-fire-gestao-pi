
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Upload,
  Download,
  Plus,
  Trash2,
  Calendar,
  FileSearch,
  File,
  FilePlus
} from 'lucide-react';
import { Student, StudentDocument } from '@/data/studentTypes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

interface DocumentsListProps {
  student: Student;
  userRole: string;
}

const DocumentsList: React.FC<DocumentsListProps> = ({ student, userRole }) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [documentNotes, setDocumentNotes] = useState('');
  
  const documents = student.documents;
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };
  
  const handleUploadDocument = () => {
    toast({
      title: "Função em desenvolvimento",
      description: "O upload de documentos estará disponível em breve.",
      variant: "default",
    });
    setIsUploading(false);
    setDocumentName('');
    setDocumentType('');
    setDocumentNotes('');
  };
  
  const handleDownload = (document: StudentDocument) => {
    toast({
      title: "Download iniciado",
      description: `Baixando ${document.name}...`,
      variant: "default",
    });
  };
  
  const handleDeleteDocument = (documentId: string) => {
    toast({
      title: "Função em desenvolvimento",
      description: "A exclusão de documentos estará disponível em breve.",
      variant: "default",
    });
  };
  
  const getDocumentIcon = (type: string) => {
    switch(type) {
      case 'identification':
        return <FileSearch className="h-5 w-5 text-blue-500" />;
      case 'medical':
        return <FileText className="h-5 w-5 text-red-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };
  
  const canManageDocuments = () => {
    return ['admin', 'instructor'].includes(userRole);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center">
            <FileText size={18} className="mr-2 text-cbmepi-orange" />
            Documentos
          </CardTitle>
          {canManageDocuments() && !isUploading && (
            <Button 
              size="sm" 
              className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
              onClick={() => setIsUploading(true)}
            >
              <Plus size={16} className="mr-1" />
              Adicionar Documento
            </Button>
          )}
        </div>
        <CardDescription>
          Documentos e arquivos do aluno
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isUploading ? (
          <div className="space-y-4 border rounded-md p-4 bg-gray-50">
            <h3 className="font-medium">Adicionar novo documento</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Nome do documento
                </label>
                <Input 
                  placeholder="Ex: Carteira de Identidade"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                  className="bg-white"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Tipo do documento
                </label>
                <Input 
                  placeholder="Ex: identification, medical, etc."
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="bg-white"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Observações (opcional)
                </label>
                <textarea
                  placeholder="Adicione observações sobre o documento..."
                  rows={3}
                  className="w-full p-3 border rounded-md bg-white"
                  value={documentNotes}
                  onChange={(e) => setDocumentNotes(e.target.value)}
                />
              </div>
              
              <div className="pt-2">
                <Button 
                  variant="outline" 
                  className="w-full h-20 border-dashed flex flex-col items-center justify-center gap-2"
                >
                  <Upload size={20} />
                  <span>Clique para selecionar ou solte o arquivo aqui</span>
                </Button>
              </div>
              
              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsUploading(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleUploadDocument}
                  className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
                >
                  <FilePlus size={16} className="mr-1" />
                  Salvar Documento
                </Button>
              </div>
            </div>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-md">
            <p className="text-gray-500">Nenhum documento disponível.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map(doc => (
              <div 
                key={doc.id} 
                className="flex items-center justify-between p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getDocumentIcon(doc.type)}
                  <div>
                    <p className="font-medium">{doc.name}</p>
                    <div className="flex items-center text-xs text-gray-500 gap-1 mt-1">
                      <Calendar size={12} />
                      {formatDate(doc.uploadDate)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownload(doc)}
                  >
                    <Download size={14} />
                  </Button>
                  
                  {canManageDocuments() && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteDocument(doc.id)}
                    >
                      <Trash2 size={14} className="text-red-500" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      {!isUploading && documents.length > 0 && (
        <CardFooter className="border-t pt-4 flex justify-between">
          <p className="text-sm text-gray-500">
            Total de documentos: {documents.length}
          </p>
        </CardFooter>
      )}
    </Card>
  );
};

export default DocumentsList;
