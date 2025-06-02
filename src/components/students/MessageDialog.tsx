
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { X, Send, MessageSquare, Paperclip } from 'lucide-react';

interface MessageDialogProps {
  studentName: string;
  onClose: () => void;
  onSend: (subject: string, message: string) => void;
}

const MessageDialog: React.FC<MessageDialogProps> = ({ studentName, onClose, onSend }) => {
  const { toast } = useToast();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o assunto e a mensagem antes de enviar.",
        variant: "destructive",
      });
      return;
    }

    onSend(subject, message);
    toast({
      title: "Mensagem enviada",
      description: `Sua mensagem foi enviada para ${studentName}.`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <MessageSquare className="mr-2" size={20} />
            Nova Mensagem
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={16} />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">
              <strong>Para:</strong> {studentName}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Assunto</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Digite o assunto da mensagem"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea
              id="message"
              rows={8}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Digite sua mensagem aqui..."
            />
          </div>

          <div className="flex items-center gap-2 pt-2 border-t">
            <Button variant="outline" size="sm" className="gap-1">
              <Paperclip size={14} />
              Anexar arquivo
            </Button>
            <span className="text-xs text-gray-500">
              Funcionalidade de anexos será implementada em breve
            </span>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSend} className="bg-cbmepi-orange hover:bg-cbmepi-orange/90">
            <Send className="mr-2" size={16} />
            Enviar Mensagem
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default MessageDialog;
