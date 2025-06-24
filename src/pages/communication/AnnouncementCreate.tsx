
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Megaphone, Save, X } from 'lucide-react';

const AnnouncementCreate: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'normal',
    targetAudience: 'all',
    expirationDate: '',
    isPinned: false,
    sendNotification: true
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o título e o conteúdo do comunicado.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Comunicado criado",
      description: "O comunicado foi publicado com sucesso.",
    });

    navigate('/communication/announcements');
  };

  const handleCancel = () => {
    navigate('/communication/announcements');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header 
        title="Novo Comunicado" 
        userRole={userRole} 
        userName={userName} 
      />
      
      <main className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Megaphone className="h-5 w-5 mr-2 text-cbmepi-orange" />
                Criar Novo Comunicado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Digite o título do comunicado"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="targetAudience">Público-alvo</Label>
                  <Select value={formData.targetAudience} onValueChange={(value) => handleInputChange('targetAudience', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o público" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="students">Alunos</SelectItem>
                      <SelectItem value="instructors">Instrutores</SelectItem>
                      <SelectItem value="guardians">Responsáveis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expirationDate">Data de Expiração</Label>
                  <Input
                    id="expirationDate"
                    type="date"
                    value={formData.expirationDate}
                    onChange={(e) => handleInputChange('expirationDate', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange('content', e.target.value)}
                  placeholder="Digite o conteúdo do comunicado"
                  className="min-h-[200px]"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isPinned" 
                    checked={formData.isPinned}
                    onCheckedChange={(checked) => handleInputChange('isPinned', checked as boolean)}
                  />
                  <Label htmlFor="isPinned">Fixar comunicado no topo</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="sendNotification" 
                    checked={formData.sendNotification}
                    onCheckedChange={(checked) => handleInputChange('sendNotification', checked as boolean)}
                  />
                  <Label htmlFor="sendNotification">Enviar notificação para destinatários</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t">
                <Button 
                  variant="outline" 
                  onClick={handleCancel}
                  className="flex items-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSubmit}
                  className="bg-cbmepi-orange hover:bg-cbmepi-orange/90 text-white flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Publicar Comunicado
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AnnouncementCreate;
