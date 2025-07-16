
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Bell, Shield, Palette, Database, Mail, Globe, Loader2 } from 'lucide-react';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      weeklyReport: true,
    },
    appearance: {
      theme: 'light',
      language: 'pt-BR',
      timezone: 'America/Fortaleza',
    },
    security: {
      twoFactor: false,
      sessionTimeout: '30',
      passwordStrength: 'medium',
    },
    system: {
      autoBackup: true,
      dataRetention: '365',
      maintenanceMode: false,
    }
  });

  useEffect(() => {
    const storedUserRole = localStorage.getItem('userRole');
    const storedUserName = localStorage.getItem('userName');

    if (!storedUserRole || !storedUserName) {
      navigate('/login');
      return;
    }

    setUserRole(storedUserRole);
    setUserName(storedUserName);

    // Load user settings
    loadUserSettings();
  }, [navigate]);

  const loadUserSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      // For now, we'll use default settings since we don't have the settings tables yet
      // In a real implementation, this would be:
      // const userSettings = await settingsService.getUserSettings(userId);
      // setSettings(userSettings);

      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      setError('Erro ao carregar configurações. Tente novamente.');
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (category: string, setting: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [setting]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // For now, we'll just simulate saving
      // In a real implementation, this would be:
      // await settingsService.updateUserSettings(userId, settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Configurações salvas",
        description: "Suas configurações foram atualizadas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as configurações.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const isAdmin = userRole === 'admin';

  if (!userRole) return null;

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-cbmepi-orange" />
            <span className="ml-2 text-gray-600">Carregando configurações...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadUserSettings} variant="outline">
              Tentar Novamente
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center mb-6">
              <SettingsIcon className="h-6 w-6 text-cbmepi-red mr-2" />
              <h1 className="text-2xl font-bold text-cbmepi-black">Configurações</h1>
            </div>
            
            <Tabs defaultValue="notifications" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
                <TabsTrigger value="notifications">Notificações</TabsTrigger>
                <TabsTrigger value="appearance">Aparência</TabsTrigger>
                <TabsTrigger value="security">Segurança</TabsTrigger>
                {isAdmin && <TabsTrigger value="system">Sistema</TabsTrigger>}
              </TabsList>
              
              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="h-5 w-5 mr-2 text-cbmepi-red" />
                      Configurações de Notificação
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Notificações por Email</Label>
                        <p className="text-sm text-gray-500">Receber notificações por email</p>
                      </div>
                      <Switch
                        checked={settings.notifications.email}
                        onCheckedChange={(checked) => handleSettingChange('notifications', 'email', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Notificações Push</Label>
                        <p className="text-sm text-gray-500">Receber notificações push no navegador</p>
                      </div>
                      <Switch
                        checked={settings.notifications.push}
                        onCheckedChange={(checked) => handleSettingChange('notifications', 'push', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Notificações SMS</Label>
                        <p className="text-sm text-gray-500">Receber notificações por SMS</p>
                      </div>
                      <Switch
                        checked={settings.notifications.sms}
                        onCheckedChange={(checked) => handleSettingChange('notifications', 'sms', checked)}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Relatório Semanal</Label>
                        <p className="text-sm text-gray-500">Receber relatório semanal por email</p>
                      </div>
                      <Switch
                        checked={settings.notifications.weeklyReport}
                        onCheckedChange={(checked) => handleSettingChange('notifications', 'weeklyReport', checked)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Appearance Tab */}
              <TabsContent value="appearance">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Palette className="h-5 w-5 mr-2 text-cbmepi-red" />
                      Configurações de Aparência
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="theme">Tema</Label>
                      <Select 
                        value={settings.appearance.theme} 
                        onValueChange={(value) => handleSettingChange('appearance', 'theme', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="light">Claro</SelectItem>
                          <SelectItem value="dark">Escuro</SelectItem>
                          <SelectItem value="auto">Automático</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="language">Idioma</Label>
                      <Select 
                        value={settings.appearance.language} 
                        onValueChange={(value) => handleSettingChange('appearance', 'language', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                          <SelectItem value="en-US">English (US)</SelectItem>
                          <SelectItem value="es-ES">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Fuso Horário</Label>
                      <Select 
                        value={settings.appearance.timezone} 
                        onValueChange={(value) => handleSettingChange('appearance', 'timezone', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/Fortaleza">Brasília (UTC-3)</SelectItem>
                          <SelectItem value="America/Manaus">Manaus (UTC-4)</SelectItem>
                          <SelectItem value="America/Belem">Belém (UTC-3)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* Security Tab */}
              <TabsContent value="security">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-cbmepi-red" />
                      Configurações de Segurança
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Autenticação em Dois Fatores</Label>
                        <p className="text-sm text-gray-500">Adicionar uma camada extra de segurança</p>
                      </div>
                      <Switch
                        checked={settings.security.twoFactor}
                        onCheckedChange={(checked) => handleSettingChange('security', 'twoFactor', checked)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout">Tempo de Sessão (minutos)</Label>
                      <Select 
                        value={settings.security.sessionTimeout} 
                        onValueChange={(value) => handleSettingChange('security', 'sessionTimeout', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="15">15 minutos</SelectItem>
                          <SelectItem value="30">30 minutos</SelectItem>
                          <SelectItem value="60">1 hora</SelectItem>
                          <SelectItem value="120">2 horas</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="passwordStrength">Força da Senha</Label>
                      <Select 
                        value={settings.security.passwordStrength} 
                        onValueChange={(value) => handleSettingChange('security', 'passwordStrength', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              {/* System Tab (Admin only) */}
              {isAdmin && (
                <TabsContent value="system">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Database className="h-5 w-5 mr-2 text-cbmepi-red" />
                        Configurações do Sistema
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Backup Automático</Label>
                          <p className="text-sm text-gray-500">Realizar backup automático dos dados</p>
                        </div>
                        <Switch
                          checked={settings.system.autoBackup}
                          onCheckedChange={(checked) => handleSettingChange('system', 'autoBackup', checked)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="dataRetention">Retenção de Dados (dias)</Label>
                        <Input
                          id="dataRetention"
                          type="number"
                          value={settings.system.dataRetention}
                          onChange={(e) => handleSettingChange('system', 'dataRetention', e.target.value)}
                          min="30"
                          max="3650"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-base">Modo de Manutenção</Label>
                          <p className="text-sm text-gray-500">Ativar modo de manutenção do sistema</p>
                        </div>
                        <Switch
                          checked={settings.system.maintenanceMode}
                          onCheckedChange={(checked) => handleSettingChange('system', 'maintenanceMode', checked)}
                        />
                      </div>
                      
                      <div className="pt-4 border-t">
                        <Button 
                          variant="destructive" 
                          className="mr-4"
                          onClick={() => {
                            toast({
                              title: "Backup iniciado",
                              description: "O backup do sistema foi iniciado.",
                            });
                          }}
                        >
                          <Database className="mr-2 h-4 w-4" />
                          Executar Backup
                        </Button>
                        
                        <Button 
                          variant="outline"
                          onClick={() => {
                            toast({
                              title: "Cache limpo",
                              description: "O cache do sistema foi limpo com sucesso.",
                            });
                          }}
                        >
                          Limpar Cache
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}
            </Tabs>
            
            {/* Save Button */}
            <div className="flex justify-end mt-6">
              <Button 
                onClick={handleSave}
                disabled={saving}
                className="bg-cbmepi-orange hover:bg-cbmepi-orange/90"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Salvar Configurações
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;
