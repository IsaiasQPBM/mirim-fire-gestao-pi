
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { MessageForm } from '@/components/messages/MessageForm';
import { MessageFormData } from '@/components/messages/types';

const MessagesNew: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
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

    if (!storedUserRole || !storedUserName) {
      navigate('/');
      return;
    }

    setUserRole(storedUserRole);
    setUserName(storedUserName);
  }, [navigate]);

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

  const handleSend = () => {
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

    toast({
      title: "Mensagem enviada",
      description: `Mensagem enviada para ${formData.recipients.length} destinatário(s).`,
    });

    setFormData({
      recipients: [],
      recipientType: 'individual',
      subject: '',
      content: '',
      priority: 'normal',
      messageType: 'general',
    });

    navigate('/communication/messages');
  };

  const handleCancel = () => {
    navigate('/communication/messages');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header 
        title="Nova Mensagem" 
        userRole={userRole} 
        userName={userName} 
      />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <MessageForm
            formData={formData}
            onInputChange={handleInputChange}
            onRecipientToggle={handleRecipientToggle}
            onSend={handleSend}
            onCancel={handleCancel}
          />
        </div>
      </main>
    </div>
  );
};

export default MessagesNew;
