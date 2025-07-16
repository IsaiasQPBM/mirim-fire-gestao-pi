
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare, 
  User, 
  Calendar, 
  Send,
  Search,
  Plus,
  Mail,
  Paperclip,
  Check,
  X
} from 'lucide-react';
import { getCommunicationsByStudentId } from '@/data/studentTypes';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface StudentCommunicationsProps {
  studentId: string;
  studentName: string;
  userRole: string;
}

const StudentCommunications: React.FC<StudentCommunicationsProps> = ({ 
  studentId, 
  studentName, 
  userRole 
}) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [newMessageSubject, setNewMessageSubject] = useState('');
  const [newMessageBody, setNewMessageBody] = useState('');
  
  const communications = getCommunicationsByStudentId(studentId);
  
  // Filter by search query
  const filteredCommunications = communications.filter(comm => 
    searchQuery === '' ||
    comm.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    comm.message.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch (e) {
      return 'Data inválida';
    }
  };
  
  const handleSendMessage = () => {
    // Validation
    if (!newMessageSubject.trim() || !newMessageBody.trim()) {
      toast({
        title: "Campos incompletos",
        description: "Preencha o assunto e a mensagem para enviar.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Mensagem enviada",
      description: `Sua mensagem foi enviada para ${studentName}.`,
      variant: "default",
    });
    
    // Reset form
    setNewMessageSubject('');
    setNewMessageBody('');
    setIsComposing(false);
  };
  
  const cancelMessage = () => {
    if (newMessageSubject.trim() || newMessageBody.trim()) {
      // Ask for confirmation if there's content
      if (confirm("Deseja realmente cancelar a mensagem? O conteúdo será perdido.")) {
        setNewMessageSubject('');
        setNewMessageBody('');
        setIsComposing(false);
      }
    } else {
      setIsComposing(false);
    }
  };
  
  const handleNewMessage = () => {
    setIsComposing(true);
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center">
            <MessageSquare size={18} className="mr-2 text-cbmepi-orange" />
            Comunicações
          </CardTitle>
          {['admin', 'instructor'].includes(userRole) && !isComposing && (
            <Button 
              size="sm" 
              className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
              onClick={handleNewMessage}
            >
              <Plus size={16} className="mr-1" />
              Nova Mensagem
            </Button>
          )}
        </div>
        <CardDescription>
          Histórico de comunicações com o aluno
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {isComposing ? (
          <div className="space-y-4 border rounded-md p-4 bg-gray-50">
            <h3 className="font-medium">Nova Mensagem</h3>
            
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Para: {studentName}</p>
              
              <div className="space-y-2">
                <Input 
                  placeholder="Assunto"
                  value={newMessageSubject}
                  onChange={(e) => setNewMessageSubject(e.target.value)}
                  className="bg-white"
                />
                
                <textarea
                  placeholder="Digite sua mensagem aqui..."
                  rows={6}
                  className="w-full p-3 border rounded-md bg-white"
                  value={newMessageBody}
                  onChange={(e) => setNewMessageBody(e.target.value)}
                />
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <Button variant="outline" size="sm" className="gap-1">
                  <Paperclip size={14} />
                  Anexo
                </Button>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={cancelMessage} className="gap-1">
                    <X size={14} />
                    Cancelar
                  </Button>
                  <Button 
                    size="sm" 
                    className="gap-1 bg-cbmepi-orange hover:bg-cbmepi-orange/90"
                    onClick={handleSendMessage}
                  >
                    <Send size={14} />
                    Enviar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input 
                placeholder="Buscar nas mensagens..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10" 
              />
            </div>
            
            <div className="space-y-4 mt-4">
              {filteredCommunications.length === 0 ? (
                <div className="text-center py-6 bg-gray-50 rounded-md">
                  <p className="text-gray-500">Nenhuma mensagem encontrada.</p>
                </div>
              ) : (
                filteredCommunications.map(comm => (
                  <div 
                    key={comm.id} 
                    className={cn(
                      "rounded-lg p-4 hover:shadow-sm transition-shadow border",
                      comm.senderId === studentId 
                        ? "bg-blue-50 border-blue-100" 
                        : "bg-white border-gray-200"
                    )}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center",
                          comm.senderId === studentId 
                            ? "bg-blue-100 text-blue-600" 
                            : "bg-gray-100 text-gray-600"
                        )}>
                          <User size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{comm.senderName}</p>
                            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded capitalize">
                              {comm.senderRole}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">Para: {comm.recipientName}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar size={12} className="mr-1" />
                        {formatDate(comm.date)}
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <p className="font-medium">{comm.subject}</p>
                      <p className="mt-2 text-gray-700 whitespace-pre-line">{comm.message}</p>
                    </div>
                    
                    {comm.senderId !== studentId && (
                      <div className="mt-4 pt-2 border-t border-gray-100 flex justify-end">
                        <div className="flex items-center text-xs text-gray-500 gap-1">
                          {comm.isRead ? (
                            <>
                              <Check size={14} className="text-green-500" />
                              Lida
                            </>
                          ) : (
                            <>
                              <Mail size={14} />
                              Não lida
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </CardContent>
      
      {!isComposing && (
        <CardFooter className="border-t pt-4 flex justify-between">
          <p className="text-sm text-gray-500">
            Total de mensagens: {filteredCommunications.length}
          </p>
          
          {filteredCommunications.length > 0 && (
            <Button variant="outline" size="sm" className="gap-1">
              <Mail className="h-4 w-4" />
              Marcar todas como lidas
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export default StudentCommunications;
