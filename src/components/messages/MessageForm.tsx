
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, X, Loader2 } from 'lucide-react';
import { MessageFormData } from './types';
import { RecipientSelector } from './RecipientSelector';
import { AttachmentUpload } from './AttachmentUpload';

interface MessageFormProps {
  formData: MessageFormData;
  onInputChange: (field: string, value: string | string[]) => void;
  onRecipientToggle: (recipientId: string, checked: boolean) => void;
  onSend: () => void;
  onCancel: () => void;
  loading?: boolean;
  users?: any[];
  classes?: any[];
  loadingUsers?: boolean;
  loadingClasses?: boolean;
}

export const MessageForm: React.FC<MessageFormProps> = ({
  formData,
  onInputChange,
  onRecipientToggle,
  onSend,
  onCancel,
  loading = false,
  users = [],
  classes = [],
  loadingUsers = false,
  loadingClasses = false
}) => {
  return (
    <Card className="border border-gray-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Send className="h-5 w-5 mr-2 text-cbmepi-red" />
          Compor Nova Mensagem
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Message Type and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="messageType">Tipo de Mensagem</Label>
            <Select 
              value={formData.messageType} 
              onValueChange={(value) => onInputChange('messageType', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">Geral</SelectItem>
                <SelectItem value="academic">Acadêmico</SelectItem>
                <SelectItem value="behavioral">Comportamental</SelectItem>
                <SelectItem value="administrative">Administrativo</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority">Prioridade</Label>
            <Select 
              value={formData.priority} 
              onValueChange={(value) => onInputChange('priority', value)}
            >
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

        <RecipientSelector 
          formData={formData}
          onInputChange={onInputChange}
          onRecipientToggle={onRecipientToggle}
          users={users}
          classes={classes}
          loadingUsers={loadingUsers}
          loadingClasses={loadingClasses}
        />

        {/* Subject */}
        <div className="space-y-2">
          <Label htmlFor="subject">Assunto</Label>
          <Input
            id="subject"
            value={formData.subject}
            onChange={(e) => onInputChange('subject', e.target.value)}
            placeholder="Assunto da mensagem"
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content">Conteúdo</Label>
          <Textarea
            id="content"
            value={formData.content}
            onChange={(e) => onInputChange('content', e.target.value)}
            placeholder="Digite o conteúdo da mensagem aqui..."
            rows={8}
          />
        </div>

        <AttachmentUpload />

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button 
            onClick={onSend} 
            className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Enviar Mensagem
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
