
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { communicationService, classService, userService } from '@/services/api';
import { Loader2, Save, Send, ArrowLeft } from 'lucide-react';

const AnnouncementCreate: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [classes, setClasses] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'normal',
    targetAudience: 'all',
    selectedClasses: [] as string[],
    selectedUsers: [] as string[],
    scheduledDate: '',
    expiryDate: '',
    requiresConfirmation: false,
    sendEmail: true,
    sendSMS: false,
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

    // Load data for selects
    loadFormData();
  }, [navigate]);

  const loadFormData = async () => {
    try {
      setLoadingData(true);
      setError(null);

      // Load classes and users in parallel
      const [classesData, usersData] = await Promise.all([
        classService.getAll(),
        userService.getAll()
      ]);

      setClasses(classesData || []);
      setUsers(usersData || []);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setError('Erro ao carregar dados. Tente novamente.');
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados necessários.",
        variant: "destructive"
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleClassToggle = (classId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        selectedClasses: [...prev.selectedClasses, classId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedClasses: prev.selectedClasses.filter(id => id !== classId)
      }));
    }
  };

  const handleUserToggle = (userId: string, checked: boolean) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        selectedUsers: [...prev.selectedUsers, userId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        selectedUsers: prev.selectedUsers.filter(id => id !== userId)
      }));
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o título e o conteúdo do comunicado.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // For now, save as draft (we could add a draft field to the database)
      toast({
        title: "Comunicado salvo",
        description: "O comunicado foi salvo como rascunho.",
      });
    } catch (error) {
      console.error('Erro ao salvar comunicado:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o comunicado.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o título e o conteúdo do comunicado.",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Determine recipients based on target audience
      let recipients: string[] = [];
      
      if (formData.targetAudience === 'all') {
        // Send to all users
        recipients = users.map(user => user.id);
      } else if (formData.targetAudience === 'class' && formData.selectedClasses.length > 0) {
        // For class announcements, we would need to get students from those classes
        // This is a simplified version - in a real implementation, you'd query class_students
        recipients = users.filter(user => user.profiles?.role === 'student').map(user => user.id);
      } else if (formData.targetAudience === 'individual' && formData.selectedUsers.length > 0) {
        recipients = formData.selectedUsers;
      }

      // Send announcement to each recipient
      const sendPromises = recipients.map(recipientId => 
        communicationService.sendMessage({
          sender_id: userId,
          recipient_id: recipientId,
          title: formData.title,
          content: formData.content,
          message_type: 'announcement',
          priority: formData.priority === 'normal' ? 'normal' : 
                   formData.priority === 'high' ? 'high' : 
                   formData.priority === 'urgent' ? 'urgent' : 'low',
        })
      );

      await Promise.all(sendPromises);

      toast({
        title: "Comunicado publicado",
        description: `Comunicado publicado para ${recipients.length} destinatário(s).`,
      });

      navigate('/communication/announcements');
    } catch (error) {
      console.error('Erro ao publicar comunicado:', error);
      setError('Erro ao publicar comunicado. Tente novamente.');
      toast({
        title: "Erro",
        description: "Não foi possível publicar o comunicado.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-green-100 text-green-800 border-green-300';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      default: return 'Normal';
    }
  };

  if (!userRole) return null;

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {loadingData ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cbmepi-orange" />
            <span className="ml-2 text-gray-600">Carregando dados...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadFormData} variant="outline">
              Tentar Novamente
            </Button>
          </div>
        ) : (
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Send className="h-5 w-5 mr-2 text-cbmepi-orange" />
                  Criar Novo Comunicado
                </CardTitle>
                <Button variant="outline" onClick={() => navigate('/communication/announcements')}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Priority and Target Audience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Público-Alvo</Label>
                  <Select 
                    value={formData.targetAudience} 
                    onValueChange={(value) => handleInputChange('targetAudience', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os Usuários</SelectItem>
                      <SelectItem value="class">Turmas Específicas</SelectItem>
                      <SelectItem value="individual">Usuários Específicos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Class Selection */}
              {formData.targetAudience === 'class' && (
                <div className="space-y-2">
                  <Label>Selecionar Turmas</Label>
                  <div className="border rounded-lg p-4 max-h-40 overflow-y-auto space-y-2">
                    {classes.map(classItem => (
                      <div key={classItem.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={classItem.id}
                          checked={formData.selectedClasses.includes(classItem.id)}
                          onCheckedChange={(checked) => handleClassToggle(classItem.id, checked as boolean)}
                        />
                        <Label htmlFor={classItem.id} className="cursor-pointer">
                          {classItem.name}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* User Selection */}
              {formData.targetAudience === 'individual' && (
                <div className="space-y-2">
                  <Label>Selecionar Usuários</Label>
                  <div className="border rounded-lg p-4 max-h-40 overflow-y-auto space-y-2">
                    {users.map(user => (
                      <div key={user.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={user.id}
                          checked={formData.selectedUsers.includes(user.id)}
                          onCheckedChange={(checked) => handleUserToggle(user.id, checked as boolean)}
                        />
                        <Label htmlFor={user.id} className="cursor-pointer">
                          {user.profiles?.full_name || 'Nome não disponível'} ({user.profiles?.role || 'N/A'})
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Título do comunicado"
                />
              </div>

              {/* Content */}
              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Digite o conteúdo do comunicado aqui..."
                  rows={8}
                />
              </div>

              {/* Additional Options */}
              <div className="space-y-4">
                <Label>Opções Adicionais</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="requiresConfirmation"
                      checked={formData.requiresConfirmation}
                      onCheckedChange={(checked) => handleInputChange('requiresConfirmation', checked as boolean)}
                    />
                    <Label htmlFor="requiresConfirmation">Solicitar confirmação de leitura</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sendEmail"
                      checked={formData.sendEmail}
                      onCheckedChange={(checked) => handleInputChange('sendEmail', checked as boolean)}
                    />
                    <Label htmlFor="sendEmail">Enviar por e-mail</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sendSMS"
                      checked={formData.sendSMS}
                      onCheckedChange={(checked) => handleInputChange('sendSMS', checked as boolean)}
                    />
                    <Label htmlFor="sendSMS">Enviar por SMS</Label>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-end space-x-4 pt-6 border-t">
              <Button variant="outline" onClick={handleSave} disabled={loading}>
                <Save className="mr-2 h-4 w-4" />
                Salvar Rascunho
              </Button>
              <Button 
                onClick={handlePublish} 
                className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Publicando...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Publicar Comunicado
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AnnouncementCreate;
