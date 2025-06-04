
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { Send, ArrowLeft } from 'lucide-react';
import { communicationsService, Communication } from '@/services/communicationsService';
import { profilesService } from '@/services/profilesService';
import { mockClasses } from '@/data/mockCurriculumData';

const ComposeMessage: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [profiles, setProfiles] = useState<any[]>([]);
  const [formData, setFormData] = useState<Partial<Communication>>({
    title: '',
    content: '',
    message_type: 'individual',
    priority: 'normal',
    recipient_id: '',
    class_id: '',
  });

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (!userRole) {
      navigate('/');
      return;
    }
    fetchProfiles();
  }, [navigate]);

  const fetchProfiles = async () => {
    try {
      const { data } = await profilesService.getAll();
      if (data) {
        setProfiles(data.filter(profile => profile.role !== 'admin'));
      }
    } catch (error) {
      console.error('Error fetching profiles:', error);
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

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      message_type: 'individual',
      priority: 'normal',
      recipient_id: '',
      class_id: '',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/communication/messages')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <h1 className="text-2xl font-bold text-cbmepi-black">Nova Mensagem</h1>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="flex items-center text-cbmepi-black">
                <Send className="mr-2 h-5 w-5 text-cbmepi-orange" />
                Compor Mensagem
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="message_type">Tipo de Mensagem</Label>
                    <Select
                      value={formData.message_type}
                      onValueChange={(value) => setFormData({ 
                        ...formData, 
                        message_type: value as Communication['message_type'],
                        recipient_id: value === 'group' || value === 'announcement' ? '' : formData.recipient_id,
                        class_id: value === 'individual' ? '' : formData.class_id
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="group">Grupo/Turma</SelectItem>
                        <SelectItem value="announcement">Comunicado Geral</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority">Prioridade</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData({ 
                        ...formData, 
                        priority: value as Communication['priority'] 
                      })}
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

                {formData.message_type === 'individual' && (
                  <div>
                    <Label htmlFor="recipient_id">Destinatário</Label>
                    <Select
                      value={formData.recipient_id}
                      onValueChange={(value) => setFormData({ ...formData, recipient_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o destinatário" />
                      </SelectTrigger>
                      <SelectContent>
                        {profiles.map((profile) => (
                          <SelectItem key={profile.id} value={profile.id}>
                            {profile.full_name} - {profile.role === 'instructor' ? 'Instrutor' : 'Aluno'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {(formData.message_type === 'group') && (
                  <div>
                    <Label htmlFor="class_id">Turma</Label>
                    <Select
                      value={formData.class_id}
                      onValueChange={(value) => setFormData({ ...formData, class_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a turma" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockClasses.map((cls) => (
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
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Digite o assunto da mensagem"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="content">Mensagem</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Digite sua mensagem aqui..."
                    rows={8}
                    className="resize-y"
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    disabled={loading}
                  >
                    Limpar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Mensagem
                      </>
                    )}
                  </Button>
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
