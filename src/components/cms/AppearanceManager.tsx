
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Palette, Upload, Save, Eye, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  });

  const { toast } = useToast();

  const handleSave = () => {
    // Aqui você salvaria no banco de dados via API
    console.log('Configurações de aparência atualizadas:', settings);
    toast({
      title: "Aparência atualizada",
      description: "As configurações de aparência foram salvas com sucesso.",
    });
  };

  const colorPresets = [
    { name: 'CBMEPI Oficial', primary: '#F5A623', secondary: '#B71C1C' },
    { name: 'Azul Corporativo', primary: '#2563EB', secondary: '#1E40AF' },
    { name: 'Verde Natureza', primary: '#059669', secondary: '#047857' },
    { name: 'Roxo Moderno', primary: '#7C3AED', secondary: '#5B21B6' }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Configurações de Aparência
          </CardTitle>
          <CardDescription>
            Configure cores, logos e elementos visuais do sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="colors" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="colors">Cores</TabsTrigger>
              <TabsTrigger value="logos">Logos</TabsTrigger>
              <TabsTrigger value="fonts">Fontes</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Paleta de Cores</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  <div>
                    <Label htmlFor="primary">Cor Primária</Label>
                    <div className="flex gap-2">
                      <Input
                        id="primary"
                        type="color"
                        value={settings.colors.primary}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          colors: { ...prev.colors, primary: e.target.value }
                        }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={settings.colors.primary}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          colors: { ...prev.colors, primary: e.target.value }
                        }))}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="secondary">Cor Secundária</Label>
                    <div className="flex gap-2">
                      <Input
                        id="secondary"
                        type="color"
                        value={settings.colors.secondary}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          colors: { ...prev.colors, secondary: e.target.value }
                        }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={settings.colors.secondary}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          colors: { ...prev.colors, secondary: e.target.value }
                        }))}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="accent">Cor de Destaque</Label>
                    <div className="flex gap-2">
                      <Input
                        id="accent"
                        type="color"
                        value={settings.colors.accent}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          colors: { ...prev.colors, accent: e.target.value }
                        }))}
                        className="w-16 h-10"
                      />
                      <Input
                        value={settings.colors.accent}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          colors: { ...prev.colors, accent: e.target.value }
                        }))}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Paletas Pré-definidas</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {colorPresets.map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        className="h-auto p-3 flex flex-col items-start"
                        onClick={() => setSettings(prev => ({
                          ...prev,
                          colors: {
                            ...prev.colors,
                            primary: preset.primary,
                            secondary: preset.secondary
                          }
                        }))}
                      >
                        <div className="flex gap-1 mb-2">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: preset.primary }}
                          />
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: preset.secondary }}
                          />
                        </div>
                        <span className="text-xs">{preset.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="logos" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Gerenciamento de Logos</h3>
                
                <div className="grid gap-6">
                  <div>
                    <Label>Logo Principal</Label>
                    <div className="mt-2 p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <img 
                          src={settings.logos.main} 
                          alt="Logo principal" 
                          className="h-16 w-auto object-contain"
                        />
                        <div className="flex-1">
                          <Input
                            value={settings.logos.main}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              logos: { ...prev.logos, main: e.target.value }
                            }))}
                            placeholder="URL da imagem"
                          />
                        </div>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Favicon</Label>
                    <div className="mt-2 p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 bg-gray-100 rounded border flex items-center justify-center">
                          <img 
                            src={settings.logos.favicon} 
                            alt="Favicon" 
                            className="w-6 h-6 object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <Input
                            value={settings.logos.favicon}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              logos: { ...prev.logos, favicon: e.target.value }
                            }))}
                            placeholder="URL do favicon"
                          />
                        </div>
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fonts" className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-4">Configurações de Fonte</h3>
                
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
                      placeholder="Inter, Arial, sans-serif"
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
                      placeholder="Inter, Arial, sans-serif"
                    />
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Prévia das Fontes</h4>
                  <div className="space-y-2">
                    <h1 style={{ fontFamily: settings.fonts.heading }} className="text-2xl font-bold">
                      Título Principal (H1)
                    </h1>
                    <p style={{ fontFamily: settings.fonts.body }}>
                      Este é um exemplo de texto do corpo usando a fonte selecionada. Lorem ipsum dolor sit amet.
                    </p>
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
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline">
          <Eye className="h-4 w-4 mr-2" />
          Visualizar Alterações
        </Button>
        <Button onClick={handleSave} className="bg-cbmepi-orange hover:bg-cbmepi-orange/90">
          <Save className="h-4 w-4 mr-2" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default AppearanceManager;
