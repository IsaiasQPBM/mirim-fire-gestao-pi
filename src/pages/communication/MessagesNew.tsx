
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { Send, Users, User, Paperclip, X } from 'lucide-react';

const MessagesNew: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [formData, setFormData] = useState({
    recipients: [] as string[],
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

    // Here you would send the message to your backend
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

    navigate('/communications/messages');
  };

  // Mock data for recipients
  const mockUsers = [
    { id: 'user-1', name: 'João Silva', role: 'student' },
    { id: 'user-2', name: 'Maria Santos', role: 'student' },
    { id: 'user-3', name: 'Pedro Oliveira', role: 'instructor' },
    { id: 'user-4', name: 'Ana Costa', role: 'student' },
  ];

  const mockClasses = [
    { id: 'class-1', name: 'Turma A - Manhã' },
    { id: 'class-2', name: 'Turma B - Tarde' },
    { id: 'class-3', name: 'Turma C - Noite' },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header 
        title="Nova Mensagem" 
        userRole={userRole} 
        userName={userName} 
      />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
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
                    onValueChange={(value) => handleInputChange('messageType', value)}
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
                    onValueChange={(value) => handleInputChange('priority', value)}
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

              {/* Recipient Type */}
              <div className="space-y-2">
                <Label>Tipo de Destinatário</Label>
                <Select 
                  value={formData.recipientType} 
                  onValueChange={(value) => handleInputChange('recipientType', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="class">Turma Completa</SelectItem>
                    <SelectItem value="all">Todos os Usuários</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Recipients Selection */}
              {formData.recipientType === 'individual' && (
                <div className="space-y-2">
                  <Label>Destinatários</Label>
                  <div className="border rounded-lg p-4 max-h-40 overflow-y-auto space-y-2">
                    {mockUsers.map(user => (
                      <div key={user.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={user.id}
                          checked={formData.recipients.includes(user.id)}
                          onCheckedChange={(checked) => handleRecipientToggle(user.id, checked as boolean)}
                        />
                        <Label htmlFor={user.id} className="flex items-center space-x-2 cursor-pointer">
                          <User className="h-4 w-4" />
                          <span>{user.name}</span>
                          <span className="text-xs text-gray-500">({user.role})</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.recipientType === 'class' && (
                <div className="space-y-2">
                  <Label>Selecionar Turma</Label>
                  <div className="border rounded-lg p-4 space-y-2">
                    {mockClasses.map(classItem => (
                      <div key={classItem.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={classItem.id}
                          checked={formData.recipients.includes(classItem.id)}
                          onCheckedChange={(checked) => handleRecipientToggle(classItem.id, checked as boolean)}
                        />
                        <Label htmlFor={classItem.id} className="flex items-center space-x-2 cursor-pointer">
                          <Users className="h-4 w-4" />
                          <span>{classItem.name}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.recipientType === 'all' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span className="text-blue-800 font-medium">
                      Mensagem será enviada para todos os usuários do sistema
                    </span>
                  </div>
                </div>
              )}

              {/* Subject */}
              <div className="space-y-2">
                <Label htmlFor="subject">Assunto</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Assunto da mensagem"
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Digite o conteúdo da mensagem aqui..."
                  rows={8}
                />
              </div>

              {/* Attachments */}
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

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button variant="outline" onClick={() => navigate('/communications/messages')}>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button onClick={handleSend} className="bg-cbmepi-orange hover:bg-cbmepi-orange/90">
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Mensagem
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MessagesNew;
