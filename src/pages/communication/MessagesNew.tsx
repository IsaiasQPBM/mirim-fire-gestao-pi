
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { MessageForm } from '@/components/messages/MessageForm';
import { MessageFormData } from '@/components/messages/types';
import { communicationService, userService } from '@/services/api';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MessagesNew: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<MessageFormData>({
    recipients: [],
    recipientType: 'individual',
    subject: '',
    content: '',
    priority: 'normal',
    messageType: 'general',
  });

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');
    const storedUserId = localStorage.getItem('userId');

    if (!storedUserRole || !storedUserName || !storedUserId) {
      navigate('/login');
      return;
    }

    setUserRole(storedUserRole);
    setUserName(storedUserName);
    setUserId(storedUserId);

    // Load users for recipient selection
    loadUsers();
  }, [navigate]);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      setError(null);
      
      const data = await userService.getAll();
      setUsers(data || []);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      setError('Erro ao carregar lista de usuários. Tente novamente.');
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de usuários.",
        variant: "destructive"
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRecipientToggle = (recipientId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        recipients: [...prev.recipients, recipientId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        recipients: prev.recipients.filter(id => id !== recipientId)
      }));
    }
  };

  const handleSend = async () => {
    if (!formData.subject.trim() || !formData.content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o assunto e o conteúdo da mensagem.",
        variant: "destructive",
      });
      return;
    }

    if (formData.recipients.length === 0) {
      toast({
        title: "Destinatários obrigatórios",
        description: "Selecione pelo menos um destinatário.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Send message to each recipient
      const sendPromises = formData.recipients.map(recipientId => 
        communicationService.sendMessage({
          sender_id: userId,
          recipient_id: recipientId,
          title: formData.subject,
          content: formData.content,
          message_type: 'message',
          priority: formData.priority === 'normal' ? 'normal' : 
                   formData.priority === 'high' ? 'high' : 
                   formData.priority === 'urgent' ? 'urgent' : 'low',
        })
      );

      await Promise.all(sendPromises);

      toast({
        title: "Mensagem enviada",
        description: `Mensagem enviada para ${formData.recipients.length} destinatário(s).`,
      });

      // Reset form
      setFormData({
        recipients: [],
        recipientType: 'individual',
        subject: '',
        content: '',
        priority: 'normal',
        messageType: 'general',
      });

      navigate('/communication/messages');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setError('Erro ao enviar mensagem. Tente novamente.');
      toast({
        title: "Erro",
        description: "Não foi possível enviar a mensagem.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/communication/messages');
  };

  if (!userRole) return null;

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {loadingUsers ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cbmepi-orange" />
            <span className="ml-2 text-gray-600">Carregando usuários...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadUsers} variant="outline">
              Tentar Novamente
            </Button>
          </div>
        ) : (
          <MessageForm
            formData={formData}
            onInputChange={handleInputChange}
            onRecipientToggle={handleRecipientToggle}
            onSend={handleSend}
            onCancel={handleCancel}
            loading={loading}
            users={users}
          />
        )}
      </div>
    </div>
  );
};

export default MessagesNew;
