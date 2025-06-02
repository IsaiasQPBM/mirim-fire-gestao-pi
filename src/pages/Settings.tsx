
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Shield, 
  Database,
  Save,
  RefreshCw
} from 'lucide-react';

const Settings: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  // User preferences state
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    reports: true,
    messages: true,
  });

  const [systemSettings, setSystemSettings] = useState({
    darkMode: false,
    autoSave: true,
    showHelp: true,
  });

  const [profileData, setProfileData] = useState({
    full_name: profile?.full_name || '',
    email: profile?.email || '',
  });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      const { error } = await updateProfile({
        full_name: profileData.full_name,
      });

      if (!error) {
        toast({
          title: 'Perfil atualizado',
          description: 'Suas informações foram salvas com sucesso.',
        });
      }
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveNotifications = () => {
    localStorage.setItem('userNotifications', JSON.stringify(notifications));
    toast({
      title: 'Notificações atualizadas',
      description: 'Suas preferências de notificação foram salvas.',
    });
  };

  const handleSaveSystem = () => {
    localStorage.setItem('systemSettings', JSON.stringify(systemSettings));
    toast({
      title: 'Configurações do sistema',
      description: 'Suas preferências foram salvas.',
    });
  };

  React.useEffect(() => {
    // Load saved preferences
    const savedNotifications = localStorage.getItem('userNotifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }

    const savedSystem = localStorage.getItem('systemSettings');
    if (savedSystem) {
      setSystemSettings(JSON.parse(savedSystem));
    }
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center space-x-2 mb-6">
        <SettingsIcon className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Configurações</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Perfil do Usuário</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <Input
                id="fullName"
                value={profileData.full_name}
                onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                placeholder="Digite seu nome completo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500">O email não pode ser alterado</p>
            </div>

            <div className="space-y-2">
              <Label>Função</Label>
              <Input
                value={profile?.role === 'admin' ? 'Administrador' : 
                       profile?.role === 'instructor' ? 'Instrutor' : 'Estudante'}
                disabled
                className="bg-gray-50 capitalize"
              />
            </div>

            <Button onClick={handleSaveProfile} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar Perfil
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Notificações</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações por Email</Label>
                <p className="text-sm text-gray-500">Receber emails sobre atividades importantes</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Notificações Push</Label>
                <p className="text-sm text-gray-500">Notificações instantâneas no navegador</p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Relatórios</Label>
                <p className="text-sm text-gray-500">Notificações sobre novos relatórios</p>
              </div>
              <Switch
                checked={notifications.reports}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, reports: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mensagens</Label>
                <p className="text-sm text-gray-500">Notificações de novas mensagens</p>
              </div>
              <Switch
                checked={notifications.messages}
                onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, messages: checked }))}
              />
            </div>

            <Button onClick={handleSaveNotifications} variant="outline" className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Salvar Notificações
            </Button>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <SettingsIcon className="h-5 w-5" />
              <span>Sistema</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Modo Escuro</Label>
                <p className="text-sm text-gray-500">Ativar tema escuro da interface</p>
              </div>
              <Switch
                checked={systemSettings.darkMode}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, darkMode: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Salvamento Automático</Label>
                <p className="text-sm text-gray-500">Salvar automaticamente as alterações</p>
              </div>
              <Switch
                checked={systemSettings.autoSave}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, autoSave: checked }))}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Mostrar Ajuda</Label>
                <p className="text-sm text-gray-500">Exibir dicas e ajuda na interface</p>
              </div>
              <Switch
                checked={systemSettings.showHelp}
                onCheckedChange={(checked) => setSystemSettings(prev => ({ ...prev, showHelp: checked }))}
              />
            </div>

            <Button onClick={handleSaveSystem} variant="outline" className="w-full">
              <Save className="mr-2 h-4 w-4" />
              Salvar Sistema
            </Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        {profile?.role === 'admin' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Segurança (Admin)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status da Base de Dados</Label>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Conectado ao Supabase</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Backup Automático</Label>
                <p className="text-sm text-gray-500">Dados são automaticamente sincronizados</p>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Logs de Acesso</Label>
                <p className="text-sm text-gray-500">Últimos acessos são registrados no sistema</p>
              </div>

              <Button variant="outline" className="w-full">
                <Database className="mr-2 h-4 w-4" />
                Ver Logs do Sistema
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Settings;
