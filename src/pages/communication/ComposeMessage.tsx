
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { toast } from '@/hooks/use-toast';
import { MessageSquare, Send, Users, User, Megaphone } from 'lucide-react';
import { communicationsService, Communication } from '@/services/communicationsService';
import { mockClasses } from '@/data/mockCurriculumData';
import { supabase } from '@/integrations/supabase/client';

const ComposeMessage: React.FC = () => {
  const navigate = useNavigate();
  
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  
  const [formData, setFormData] = useState<Partial<Communication>>({
    title: '',
    content: '',
    message_type: 'individual',
    priority: 'normal',
    recipient_id: '',
    class_id: ''
  });
  
  useEffect(() => {
    // Check if user is logged in
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

    if (!storedUserRole || !storedUserName) {
      navigate('/');
      return;
    }

    setUserRole(storedUserRole);
    setUserName(storedUserName);
    
    fetchUsers();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role')
        .order('full_name');

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar usuários',
        description: error.message,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await communicationsService.sendMessage(formData as Communication);
      
      toast({
        title: 'Mensagem enviada',
        description: 'Sua mensagem foi enviada com sucesso!',
      });
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        message_type: 'individual',
        priority: 'normal',
        recipient_id: '',
        class_id: ''
      });
      
      // Redirect to messages inbox
      navigate('/communication/messages');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar mensagem',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'individual':
        return <User className="h-4 w-4" />;
      case 'group':
        return <Users className="h-4 w-4" />;
      case 'announcement':
        return <Megaphone className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-500';
      case 'normal':
        return 'bg-blue-500';
      case 'high':
        return 'bg-yellow-500';
      case 'urgent':
        return 'bg-red-500';
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center mb-6">
            <MessageSquare className="h-6 w-6 text-cbmepi-red mr-2" />
            <h1 className="text-2xl font-bold text-cbmepi-black">Nova Mensagem</h1>
          </div>
          
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5" />
                <span>Compor Mensagem</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="message_type">Tipo de Mensagem</Label>
                    <Select
                      value={formData.message_type}
                      onValueChange={(value) => setFormData({ ...formData, message_type: value as Communication['message_type'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4" />
                            <span>Individual</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="group">
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <span>Grupo/Turma</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="announcement">
                          <div className="flex items-center space-x-2">
                            <Megaphone className="h-4 w-4" />
                            <span>Anúncio Geral</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData({ ...formData, priority: value as Communication['priority'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-gray-500 text-xs">Baixa</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="normal">
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-blue-500 text-xs">Normal</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="high">
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-yellow-500 text-xs">Alta</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="urgent">
                          <div className="flex items-center space-x-2">
                            <Badge className="bg-red-500 text-xs">Urgente</Badge>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {formData.message_type === 'individual' && (
                  <div>
                    <Label htmlFor="recipient_id">Destinatário</Label>
                    <Select
                      value={formData.recipient_id}
                      onValueChange={(value) => setFormData({ ...formData, recipient_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um usuário" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map(user => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center space-x-2">
                              <span>{user.full_name}</span>
                              <Badge variant="outline" className="text-xs">
                                {user.role === 'admin' ? 'Admin' :
                                 user.role === 'instructor' ? 'Instrutor' : 'Aluno'}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {formData.message_type === 'group' && (
                  <div>
                    <Label htmlFor="class_id">Turma</Label>
                    <Select
                      value={formData.class_id}
                      onValueChange={(value) => setFormData({ ...formData, class_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma turma" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockClasses.map(cls => (
                          <SelectItem key={cls.id} value={cls.id}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <div>
                  <Label htmlFor="title">Assunto</Label>
                  <Input
                    id="title"
                    placeholder="Digite o assunto da mensagem"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Mensagem</Label>
                  <Textarea
                    id="content"
                    placeholder="Digite sua mensagem aqui..."
                    className="min-h-32 resize-y"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                  />
                </div>
                
                <div className="flex justify-between items-center pt-4">
                  <div className="flex items-center space-x-2">
                    {getMessageTypeIcon(formData.message_type || 'individual')}
                    <span className="text-sm text-gray-600">
                      {formData.message_type === 'individual' ? 'Mensagem Individual' :
                       formData.message_type === 'group' ? 'Mensagem para Turma' : 'Anúncio Geral'}
                    </span>
                    <Badge className={getPriorityColor(formData.priority || 'normal')}>
                      {formData.priority === 'low' ? 'Baixa' :
                       formData.priority === 'normal' ? 'Normal' :
                       formData.priority === 'high' ? 'Alta' : 'Urgente'}
                    </Badge>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => navigate('/communication/messages')}
                      disabled={loading}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white"
                      disabled={loading}
                    >
                      {loading ? (
                        <>Enviando...</>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Enviar Mensagem
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ComposeMessage;
