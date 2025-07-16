
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Save, Edit, Type, Image, File, Menu, Phone, Settings, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cmsService } from '@/services/api';
import type { Database } from '@/integrations/supabase/types';

type CMSContent = Database['public']['Tables']['cms_content']['Row'];

interface CMSEditorProps {
  onSave?: (updatedContent: CMSContent[]) => void;
}

const CMSEditor: React.FC<CMSEditorProps> = ({ onSave }) => {
  const [content, setContent] = useState<CMSContent[]>([]);
  const [editingContent, setEditingContent] = useState<CMSContent[]>([]);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await cmsService.getAllContent();
      setContent(data);
      setEditingContent(data);
    } catch (error) {
      console.error('Erro ao carregar conteúdo CMS:', error);
      setError('Erro ao carregar conteúdo. Tente novamente.');
      toast({
        title: "Erro",
        description: "Não foi possível carregar o conteúdo CMS.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <Type className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'document': return <File className="h-4 w-4" />;
      case 'menu': return <Menu className="h-4 w-4" />;
      case 'contact': return <Phone className="h-4 w-4" />;
      case 'logo': return <Settings className="h-4 w-4" />;
      default: return <Type className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'text': return 'bg-blue-100 text-blue-800';
      case 'image': return 'bg-green-100 text-green-800';
      case 'document': return 'bg-purple-100 text-purple-800';
      case 'menu': return 'bg-orange-100 text-orange-800';
      case 'contact': return 'bg-pink-100 text-pink-800';
      case 'logo': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleEdit = (contentId: string) => {
    setIsEditing(contentId);
  };

  const handleSave = async (contentId: string, newValue: string) => {
    try {
      setSaving(true);
      
      const contentItem = editingContent.find(item => item.id === contentId);
      if (!contentItem) return;

      const updated = await cmsService.updateContent(contentId, {
        content_value: newValue,
        updated_at: new Date().toISOString()
      });

      const updatedContent = editingContent.map(item => 
        item.id === contentId ? updated : item
      );
      
      setEditingContent(updatedContent);
      setContent(updatedContent);
      setIsEditing(null);
      
      onSave?.(updatedContent);
      
      toast({
        title: "Conteúdo atualizado",
        description: "As alterações foram salvas com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao salvar conteúdo:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar as alterações.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingContent(content);
    setIsEditing(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-cbmepi-orange" />
        <span className="ml-2">Carregando conteúdo...</span>
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
            <Settings className="h-5 w-5" />
            Editor de Conteúdo CMS
          </CardTitle>
          <CardDescription>
            Gerencie todo o conteúdo editável do sistema. Clique em "Editar" para modificar qualquer texto, imagem ou configuração.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {editingContent.map((item) => (
              <Card key={item.id} className="border border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={getTypeColor(item.content_type)}>
                        {getTypeIcon(item.content_type)}
                        <span className="ml-1 capitalize">{item.content_type}</span>
                      </Badge>
                      <div>
                        <h4 className="font-medium">{item.label}</h4>
                        {item.description && (
                          <p className="text-sm text-gray-500">{item.description}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item.id)}
                      disabled={isEditing === item.id || saving}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditing === item.id ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`content-${item.id}`}>Conteúdo</Label>
                        {item.content_type === 'text' || item.content_type === 'contact' ? (
                          <Textarea
                            id={`content-${item.id}`}
                            value={item.content_value}
                            onChange={(e) => {
                              const updated = editingContent.map(contentItem => 
                                contentItem.id === item.id 
                                  ? { ...contentItem, content_value: e.target.value }
                                  : contentItem
                              );
                              setEditingContent(updated);
                            }}
                            rows={3}
                            placeholder="Digite o conteúdo..."
                          />
                        ) : (
                          <Input
                            id={`content-${item.id}`}
                            value={item.content_value}
                            onChange={(e) => {
                              const updated = editingContent.map(contentItem => 
                                contentItem.id === item.id 
                                  ? { ...contentItem, content_value: e.target.value }
                                  : contentItem
                              );
                              setEditingContent(updated);
                            }}
                            placeholder="Digite o valor..."
                          />
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSave(item.id, item.content_value)}
                          disabled={saving}
                          size="sm"
                        >
                          {saving ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-1" />
                          ) : (
                            <Save className="h-4 w-4 mr-1" />
                          )}
                          Salvar
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancel}
                          disabled={saving}
                          size="sm"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Chave:</div>
                      <code className="text-xs bg-gray-100 p-2 rounded block">{item.content_key}</code>
                      <div className="text-sm font-medium mt-3">Valor:</div>
                      <div className="text-sm bg-gray-50 p-3 rounded border">
                        {item.content_value}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        Última atualização: {new Date(item.updated_at).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CMSEditor;
