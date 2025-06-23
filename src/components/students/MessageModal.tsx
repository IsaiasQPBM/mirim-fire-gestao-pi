
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Send, X, Paperclip } from 'lucide-react';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentId: string;
}

const MessageModal: React.FC<MessageModalProps> = ({ 
  isOpen, 
  onClose, 
  studentName, 
  studentId 
}) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('normal');
  const [messageType, setMessageType] = useState('general');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o assunto e a mensagem para enviar.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    // Simular envio da mensagem
    setTimeout(() => {
      toast({
        title: "Mensagem enviada",
        description: `Sua mensagem foi enviada para ${studentName}.`,
      });
      
      // Reset form
      setSubject('');
      setMessage('');
      setPriority('normal');
      setMessageType('general');
      setIsSending(false);
      onClose();
    }, 1500);
  };

  const handleClose = () => {
    if (subject.trim() || message.trim()) {
      if (confirm("Deseja realmente cancelar? O conteúdo da mensagem será perdido.")) {
        setSubject('');
        setMessage('');
        setPriority('normal');
        setMessageType('general');
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Mensagem</DialogTitle>
          <DialogDescription>
            Enviar mensagem para: <span className="font-medium">{studentName}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="messageType">Tipo</Label>
              <Select value={messageType} onValueChange={setMessageType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Geral</SelectItem>
                  <SelectItem value="academic">Acadêmico</SelectItem>
                  <SelectItem value="behavioral">Comportamental</SelectItem>
                  <SelectItem value="administrative">Administrativo</SelectItem>
                  <SelectItem value="health">Saúde</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Assunto</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Assunto da mensagem"
              disabled={isSending}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem aqui..."
              rows={6}
              disabled={isSending}
            />
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <Button variant="outline" size="sm" disabled={isSending}>
            <Paperclip size={16} className="mr-1" />
            Anexar
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} disabled={isSending}>
              <X size={16} className="mr-1" />
              Cancelar
            </Button>
            <Button 
              onClick={handleSend} 
              disabled={isSending}
              className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
            >
              <Send size={16} className="mr-1" />
              {isSending ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MessageModal;
