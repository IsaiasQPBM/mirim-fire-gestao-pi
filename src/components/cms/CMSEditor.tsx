
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Save, Edit, Type, Image, File, Menu, Phone, Settings } from 'lucide-react';
import { CMSContent } from '@/data/cmsTypes';
import { useToast } from '@/hooks/use-toast';

interface CMSEditorProps {
  content: CMSContent[];
  onSave: (updatedContent: CMSContent[]) => void;
}

const CMSEditor: React.FC<CMSEditorProps> = ({ content, onSave }) => {
  const [editingContent, setEditingContent] = useState<CMSContent[]>(content);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const { toast } = useToast();

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

  const handleSave = (contentId: string, newValue: string) => {
    const updated = editingContent.map(item => 
      item.id === contentId 
        ? { ...item, value: newValue, updatedAt: new Date().toISOString() }
        : item
    );
    setEditingContent(updated);
    setIsEditing(null);
    onSave(updated);
    
    toast({
      title: "Conteúdo atualizado",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const handleCancel = () => {
    setEditingContent(content);
    setIsEditing(null);
  };

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
                      <Badge className={getTypeColor(item.type)}>
                        {getTypeIcon(item.type)}
                        <span className="ml-1 capitalize">{item.type}</span>
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
                      disabled={isEditing === item.id}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditing === item.id ? (
                    <CMSContentEditor
                      content={item}
                      onSave={(newValue) => handleSave(item.id, newValue)}
                      onCancel={handleCancel}
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded border">
                      <p className="text-sm font-mono break-all">{item.value}</p>
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

interface CMSContentEditorProps {
  content: CMSContent;
  onSave: (value: string) => void;
  onCancel: () => void;
}

const CMSContentEditor: React.FC<CMSContentEditorProps> = ({ content, onSave, onCancel }) => {
  const [value, setValue] = useState(content.value);

  const handleSave = () => {
    onSave(value);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`edit-${content.id}`}>{content.label}</Label>
        {content.type === 'text' && content.value.length > 100 ? (
          <Textarea
            id={`edit-${content.id}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mt-1"
            rows={4}
          />
        ) : (
          <Input
            id={`edit-${content.id}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="mt-1"
          />
        )}
      </div>
      
      <div className="flex gap-2">
        <Button onClick={handleSave} size="sm" className="bg-cbmepi-orange hover:bg-cbmepi-orange/90">
          <Save className="h-4 w-4 mr-1" />
          Salvar
        </Button>
        <Button onClick={onCancel} variant="outline" size="sm">
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default CMSEditor;
