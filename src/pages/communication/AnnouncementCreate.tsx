
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Header from '@/components/Header';
import { useToast } from '@/hooks/use-toast';
import { ChevronLeft, Send, Save, Users, Calendar, AlertCircle } from 'lucide-react';

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
    selectedClasses: [] as string[],
    selectedUsers: [] as string[],
    scheduledDate: '',
    expiryDate: '',
    requiresConfirmation: false,
    sendEmail: true,
    sendSMS: false,
  });

  const mockClasses = [
    { id: '1', name: 'Turma A - Bombeiro Civil' },
    { id: '2', name: 'Turma B - Primeiros Socorros' },
    { id: '3', name: 'Turma C - Prevenção de Incêndio' },
  ];

  const mockUsers = [
    { id: '1', name: 'João Silva', role: 'instructor' },
    { id: '2', name: 'Maria Santos', role: 'student' },
    { id: '3', name: 'Pedro Oliveira', role: 'student' },
  ];

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

    if (!storedUserRole || !storedUserName) {
      navigate('/login');
      return;
    }

    setUserRole(storedUserRole);
    setUserName(storedUserName);
  }, [navigate]);

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

  const handleSave = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o título e o conteúdo do comunicado.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Comunicado salvo",
      description: "O comunicado foi salvo como rascunho.",
    });
  };

  const handlePublish = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha o título e o conteúdo do comunicado.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Comunicado publicado",
      description: "O comunicado foi publicado com sucesso.",
    });

    navigate('/communication/announcements');
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header 
        title="Novo Comunicado" 
        userRole={userRole} 
        userName={userName} 
      />
      
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/communication/announcements">Comunicados</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Novo Comunicado</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <Button
            variant="ghost"
            onClick={() => navigate('/communication/announcements')}
            className="mb-6"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Voltar para Comunicados
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-cbmepi-orange" />
                    Informações do Comunicado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Digite o título do comunicado"
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="content">Conteúdo *</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => handleInputChange('content', e.target.value)}
                      placeholder="Digite o conteúdo do comunicado"
                      rows={8}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="priority">Prioridade</Label>
                      <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="targetAudience">Público Alvo</Label>
                      <Select value={formData.targetAudience} onValueChange={(value) => handleInputChange('targetAudience', value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="students">Alunos</SelectItem>
                          <SelectItem value="instructors">Instrutores</SelectItem>
                          <SelectItem value="specific">Específico</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="scheduledDate">Data de Publicação</Label>
                      <Input
                        id="scheduledDate"
                        type="datetime-local"
                        value={formData.scheduledDate}
                        onChange={(e) => handleInputChange('scheduledDate', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="expiryDate">Data de Expiração</Label>
                      <Input
                        id="expiryDate"
                        type="datetime-local"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recipient Selection */}
              {formData.targetAudience === 'specific' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-cbmepi-orange" />
                      Seleção de Destinatários
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Turmas</Label>
                      <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                        {mockClasses.map((cls) => (
                          <div key={cls.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`class-${cls.id}`}
                              checked={formData.selectedClasses.includes(cls.id)}
                              onCheckedChange={(checked) => handleClassToggle(cls.id, checked as boolean)}
                            />
                            <Label htmlFor={`class-${cls.id}`} className="text-sm">
                              {cls.name}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label>Usuários Específicos</Label>
                      <div className="mt-2 space-y-2 max-h-40 overflow-y-auto">
                        {mockUsers.map((user) => (
                          <div key={user.id} className="flex items-center space-x-2">
                            <Checkbox
                              id={`user-${user.id}`}
                              checked={formData.selectedUsers.includes(user.id)}
                              onCheckedChange={(checked) => handleUserToggle(user.id, checked as boolean)}
                            />
                            <Label htmlFor={`user-${user.id}`} className="text-sm">
                              {user.name} ({user.role === 'instructor' ? 'Instrutor' : 'Aluno'})
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Prévia</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Badge className={getPriorityColor(formData.priority)}>
                      {getPriorityLabel(formData.priority)}
                    </Badge>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg text-cbmepi-black">
                      {formData.title || 'Título do comunicado'}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {formData.content || 'Conteúdo do comunicado aparecerá aqui...'}
                    </p>
                  </div>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>Público: {formData.targetAudience === 'all' ? 'Todos' : 
                      formData.targetAudience === 'students' ? 'Alunos' : 
                      formData.targetAudience === 'instructors' ? 'Instrutores' : 'Específico'}</p>
                    {formData.scheduledDate && (
                      <p>Publicação: {new Date(formData.scheduledDate).toLocaleDateString('pt-BR')}</p>
                    )}
                    {formData.expiryDate && (
                      <p>Expira: {new Date(formData.expiryDate).toLocaleDateString('pt-BR')}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Configurações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="requiresConfirmation"
                      checked={formData.requiresConfirmation}
                      onCheckedChange={(checked) => handleInputChange('requiresConfirmation', checked as boolean)}
                    />
                    <Label htmlFor="requiresConfirmation" className="text-sm">
                      Requer confirmação de leitura
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sendEmail"
                      checked={formData.sendEmail}
                      onCheckedChange={(checked) => handleInputChange('sendEmail', checked as boolean)}
                    />
                    <Label htmlFor="sendEmail" className="text-sm">
                      Enviar por email
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sendSMS"
                      checked={formData.sendSMS}
                      onCheckedChange={(checked) => handleInputChange('sendSMS', checked as boolean)}
                    />
                    <Label htmlFor="sendSMS" className="text-sm">
                      Enviar por SMS
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-3">
                <Button
                  onClick={handlePublish}
                  className="w-full bg-cbmepi-orange hover:bg-cbmepi-orange/90"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Publicar Comunicado
                </Button>
                
                <Button
                  onClick={handleSave}
                  variant="outline"
                  className="w-full"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Rascunho
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AnnouncementCreate;
