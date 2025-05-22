
import React, { useState, useRef } from 'react';
import { 
  Upload, 
  X, 
  FileText, 
  File, 
  FilePlus, 
  Trash
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { StudentDocument } from '@/data/studentTypes';
import { Label } from '@/components/ui/label';

interface DocumentUploadProps {
  documents: StudentDocument[];
  onUpload: (docs: StudentDocument[]) => void;
  onRemove: (id: string) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ 
  documents, 
  onUpload, 
  onRemove 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [documentName, setDocumentName] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [documentNotes, setDocumentNotes] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    setCurrentFile(file);
    setDocumentName(file.name);
    setShowDialog(true);
  };

  const handleDialogCancel = () => {
    setShowDialog(false);
    setCurrentFile(null);
    setDocumentName('');
    setDocumentType('');
    setDocumentNotes('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDialogConfirm = () => {
    if (currentFile && documentName) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newDocument: StudentDocument = {
          id: uuidv4(),
          name: documentName,
          type: documentType || 'other',
          uploadDate: new Date().toISOString(),
          filePath: reader.result as string,
          notes: documentNotes || undefined
        };
        
        onUpload([newDocument]);
        handleDialogCancel();
      };
      reader.readAsDataURL(currentFile);
    }
  };

  const getDocumentTypeLabel = (type: string) => {
    switch(type) {
      case 'identification': return 'Documento de Identificação';
      case 'medical': return 'Documento Médico';
      case 'registration': return 'Documento de Matrícula';
      case 'academic': return 'Documento Acadêmico';
      case 'financial': return 'Documento Financeiro';
      default: return 'Outro';
    }
  };

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch(extension) {
      case 'pdf':
        return <FileText className="text-red-500" />;
      case 'doc':
      case 'docx':
        return <FileText className="text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FileText className="text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <File className="text-purple-500" />;
      default:
        return <File className="text-gray-500" />;
    }
  };

  return (
    <>
      <div className="space-y-4">
        {/* Document upload area */}
        <div 
          className={`
            border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer
            transition-all duration-200
            ${dragActive ? 'border-cbmepi-orange bg-orange-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload size={36} className="text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 text-center">
            <span className="font-medium">Clique para fazer upload</span> ou arraste arquivos aqui
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Suporta: PDF, DOC, XLS, JPG, PNG
          </p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleChange}
          className="hidden"
        />
        
        {/* List of uploaded documents */}
        {documents.length > 0 && (
          <div className="mt-6 border rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b">
              <h3 className="text-sm font-medium">Documentos Anexados</h3>
            </div>
            <ul className="divide-y">
              {documents.map((doc) => (
                <li key={doc.id} className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {getFileIcon(doc.name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{doc.name}</p>
                      <p className="text-xs text-gray-500">
                        {getDocumentTypeLabel(doc.type)}
                        {doc.notes && ` - ${doc.notes}`}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(doc.id);
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash size={16} />
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <Button 
          type="button" 
          variant="outline"
          className="w-full mt-2 border-dashed"
          onClick={() => fileInputRef.current?.click()}
        >
          <FilePlus size={16} className="mr-2" />
          Adicionar mais documentos
        </Button>
      </div>
      
      {/* Dialog for document details */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Documento</DialogTitle>
            <DialogDescription>
              Adicione informações sobre o documento que está sendo anexado.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="documentName">Nome do documento*</Label>
              <Input
                id="documentName"
                value={documentName}
                onChange={(e) => setDocumentName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="documentType">Tipo de documento</Label>
              <select
                id="documentType"
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Selecione um tipo</option>
                <option value="identification">Documento de Identificação</option>
                <option value="medical">Documento Médico</option>
                <option value="registration">Documento de Matrícula</option>
                <option value="academic">Documento Acadêmico</option>
                <option value="financial">Documento Financeiro</option>
                <option value="other">Outro</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="documentNotes">Observações</Label>
              <Input
                id="documentNotes"
                value={documentNotes}
                onChange={(e) => setDocumentNotes(e.target.value)}
                placeholder="Observações sobre o documento (opcional)"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleDialogCancel}>
              Cancelar
            </Button>
            <Button 
              onClick={handleDialogConfirm}
              disabled={!documentName}
              className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
            >
              Adicionar Documento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentUpload;
