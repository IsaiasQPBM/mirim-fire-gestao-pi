
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Palette, Upload, Save, Eye, Settings, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { appearanceSettingsService } from '@/services/api';
import type { Database } from '@/integrations/supabase/types';

type AppearanceSetting = Database['public']['Tables']['appearance_settings']['Row'];

interface AppearanceSettings {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  logos: {
    main: string;
    favicon: string;
    watermark: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  layout: {
    headerHeight: string;
    sidebarWidth: string;
    borderRadius: string;
  };
}

const AppearanceManager: React.FC = () => {
  const [settings, setSettings] = useState<AppearanceSettings>({
    colors: {
      primary: '',
      secondary: '',
      accent: '',
      background: '',
      text: ''
    },
    logos: {
      main: '',
      favicon: '',
      watermark: ''
    },
    fonts: {
      heading: '',
      body: ''
    },
    layout: {
      headerHeight: '',
      sidebarWidth: '',
      borderRadius: ''
    }
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await appearanceSettingsService.getAll();
      
      // Organizar configurações por categoria
      const newSettings: AppearanceSettings = {
        colors: {
          primary: '#F5A623',
          secondary: '#B71C1C',
          accent: '#2563EB',
          background: '#FFFFFF',
          text: '#1F2937'
        },
        logos: {
          main: '/lovable-uploads/ea2da570-3d73-4c06-9dd2-2251355190c7.png',
          favicon: '/favicon.ico',
          watermark: ''
        },
        fonts: {
          heading: 'Inter',
          body: 'Inter'
        },
        layout: {
          headerHeight: '64px',
          sidebarWidth: '256px',
          borderRadius: '8px'
        }
      };

      // Mapear dados do banco para o estado local
      data.forEach(setting => {
        const [category, key] = setting.setting_key.split('.');
        if (category && key && newSettings[category as keyof AppearanceSettings]) {
          (newSettings[category as keyof AppearanceSettings] as any)[key] = setting.setting_value;
        }
      });

      setSettings(newSettings);
    } catch (error) {
      console.error('Erro ao carregar configurações de aparência:', error);
      setError('Erro ao carregar configurações. Tente novamente.');
      toast({
        title: "Erro",
        description: "Não foi possível carregar as configurações de aparência.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Preparar dados para salvar
      const settingsToSave: Array<{
        setting_key: string;
        setting_value: string;
        category: string;
      }> = [];

      // Cores
      Object.entries(settings.colors).forEach(([key, value]) => {
        settingsToSave.push({
          setting_key: `colors.${key}`,
          setting_value: value,
          category: 'colors'
        });
      });

      // Logos
      Object.entries(settings.logos).forEach(([key, value]) => {
        settingsToSave.push({
          setting_key: `logos.${key}`,
          setting_value: value,
          category: 'logos'
        });
      });

      // Fontes
      Object.entries(settings.fonts).forEach(([key, value]) => {
        settingsToSave.push({
          setting_key: `fonts.${key}`,
          setting_value: value,
          category: 'fonts'
        });
      });

      // Layout
      Object.entries(settings.layout).forEach(([key, value]) => {
        settingsToSave.push({
          setting_key: `layout.${key}`,
          setting_value: value,
          category: 'layout'
        });
      });

      // Salvar cada configuração
      for (const setting of settingsToSave) {
        try {
          await appearanceSettingsService.updateByKey(setting.setting_key, setting.setting_value);
        } catch (error) {
          // Se não existir, criar
          await appearanceSettingsService.create({
            setting_key: setting.setting_key,
            setting_value: setting.setting_value,
            category: setting.category
          });
        }
      }

      toast({
        title: "Aparência atualizada",
        description: "As configurações de aparência foram salvas com sucesso.",
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

  const colorPresets = [
    { name: 'CBMEPI Oficial', primary: '#F5A623', secondary: '#B71C1C' },
    { name: 'Azul Corporativo', primary: '#2563EB', secondary: '#1E40AF' },
    { name: 'Verde Natureza', primary: '#059669', secondary: '#047857' },
    { name: 'Roxo Moderno', primary: '#7C3AED', secondary: '#5B21B6' }
  ];

  const applyColorPreset = (preset: typeof colorPresets[0]) => {
    setSettings(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        primary: preset.primary,
        secondary: preset.secondary
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-cbmepi-orange" />
        <span className="ml-2">Carregando configurações...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <span className="ml-2 text-red-500">{error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Gerenciador de Aparência
          </CardTitle>
          <CardDescription>
            Personalize a aparência do sistema. Configure cores, logos, fontes e layout para criar uma experiência visual única.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="colors" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="colors">Cores</TabsTrigger>
              <TabsTrigger value="logos">Logos</TabsTrigger>
              <TabsTrigger value="fonts">Fontes</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Configurações de Cores</h3>
                
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="primary-color">Cor Primária</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary-color"
                        value={settings.colors.primary}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          colors: { ...prev.colors, primary: e.target.value }
                        }))}
                        placeholder="#F5A623"
                      />
                      <div 
                        className="w-12 h-10 rounded border"
                        style={{ backgroundColor: settings.colors.primary }}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="secondary-color">Cor Secundária</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondary-color"
                        value={settings.colors.secondary}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          colors: { ...prev.colors, secondary: e.target.value }
                        }))}
                        placeholder="#B71C1C"
                      />
                      <div 
                        className="w-12 h-10 rounded border"
                        style={{ backgroundColor: settings.colors.secondary }}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="accent-color">Cor de Destaque</Label>
                    <div className="flex gap-2">
                      <Input
                        id="accent-color"
                        value={settings.colors.accent}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          colors: { ...prev.colors, accent: e.target.value }
                        }))}
                        placeholder="#2563EB"
                      />
                      <div 
                        className="w-12 h-10 rounded border"
                        style={{ backgroundColor: settings.colors.accent }}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="background-color">Cor de Fundo</Label>
                    <div className="flex gap-2">
                      <Input
                        id="background-color"
                        value={settings.colors.background}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          colors: { ...prev.colors, background: e.target.value }
                        }))}
                        placeholder="#FFFFFF"
                      />
                      <div 
                        className="w-12 h-10 rounded border"
                        style={{ backgroundColor: settings.colors.background }}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="text-color">Cor do Texto</Label>
                    <div className="flex gap-2">
                      <Input
                        id="text-color"
                        value={settings.colors.text}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          colors: { ...prev.colors, text: e.target.value }
                        }))}
                        placeholder="#1F2937"
                      />
                      <div 
                        className="w-12 h-10 rounded border"
                        style={{ backgroundColor: settings.colors.text }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-md font-medium mb-3">Presets de Cores</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {colorPresets.map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        onClick={() => applyColorPreset(preset)}
                        className="justify-start"
                      >
                        <div className="flex gap-2 items-center">
                          <div className="flex gap-1">
                            <div 
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: preset.primary }}
                            />
                            <div 
                              className="w-4 h-4 rounded"
                              style={{ backgroundColor: preset.secondary }}
                            />
                          </div>
                          {preset.name}
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="logos" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Configurações de Logos</h3>
                
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="main-logo">Logo Principal</Label>
                    <div className="flex gap-2">
                      <Input
                        id="main-logo"
                        value={settings.logos.main}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          logos: { ...prev.logos, main: e.target.value }
                        }))}
                        placeholder="/path/to/logo.png"
                      />
                      <Button variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    {settings.logos.main && (
                      <div className="mt-2">
                        <img 
                          src={settings.logos.main} 
                          alt="Logo Principal" 
                          className="h-12 object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="favicon">Favicon</Label>
                    <div className="flex gap-2">
                      <Input
                        id="favicon"
                        value={settings.logos.favicon}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          logos: { ...prev.logos, favicon: e.target.value }
                        }))}
                        placeholder="/favicon.ico"
                      />
                      <Button variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    {settings.logos.favicon && (
                      <div className="mt-2">
                        <img 
                          src={settings.logos.favicon} 
                          alt="Favicon" 
                          className="h-8 w-8 object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="watermark">Marca d'água</Label>
                    <div className="flex gap-2">
                      <Input
                        id="watermark"
                        value={settings.logos.watermark}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          logos: { ...prev.logos, watermark: e.target.value }
                        }))}
                        placeholder="/path/to/watermark.png"
                      />
                      <Button variant="outline" size="icon">
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                    {settings.logos.watermark && (
                      <div className="mt-2">
                        <img 
                          src={settings.logos.watermark} 
                          alt="Marca d'água" 
                          className="h-16 object-contain opacity-50"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fonts" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Configurações de Fontes</h3>
                
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="heading-font">Fonte dos Títulos</Label>
                    <Input
                      id="heading-font"
                      value={settings.fonts.heading}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        fonts: { ...prev.fonts, heading: e.target.value }
                      }))}
                      placeholder="Inter"
                    />
                  </div>

                  <div>
                    <Label htmlFor="body-font">Fonte do Corpo</Label>
                    <Input
                      id="body-font"
                      value={settings.fonts.body}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        fonts: { ...prev.fonts, body: e.target.value }
                      }))}
                      placeholder="Inter"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="layout" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Configurações de Layout</h3>
                
                <div className="grid gap-4">
                  <div>
                    <Label htmlFor="header-height">Altura do Cabeçalho</Label>
                    <Input
                      id="header-height"
                      value={settings.layout.headerHeight}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        layout: { ...prev.layout, headerHeight: e.target.value }
                      }))}
                      placeholder="64px"
                    />
                  </div>

                  <div>
                    <Label htmlFor="sidebar-width">Largura da Barra Lateral</Label>
                    <Input
                      id="sidebar-width"
                      value={settings.layout.sidebarWidth}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        layout: { ...prev.layout, sidebarWidth: e.target.value }
                      }))}
                      placeholder="256px"
                    />
                  </div>

                  <div>
                    <Label htmlFor="border-radius">Raio da Borda</Label>
                    <Input
                      id="border-radius"
                      value={settings.layout.borderRadius}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        layout: { ...prev.layout, borderRadius: e.target.value }
                      }))}
                      placeholder="8px"
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-2 mt-6">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Save className="h-4 w-4 mr-1" />}
              Salvar Configurações
            </Button>
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-1" />
              Visualizar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearanceManager;
