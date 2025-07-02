
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, GripVertical, Menu } from 'lucide-react';
import { CMSMenuItem } from '@/data/cmsTypes';
import { mockCMSMenuItems } from '@/data/mockCMSData';
import { useToast } from '@/hooks/use-toast';

const MenuManager: React.FC = () => {
  const [menuItems, setMenuItems] = useState<CMSMenuItem[]>(mockCMSMenuItems);
  const [editingItem, setEditingItem] = useState<CMSMenuItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleSave = (item: CMSMenuItem) => {
    if (editingItem) {
      setMenuItems(prev => prev.map(i => i.id === item.id ? item : i));
      toast({
        title: "Item atualizado",
        description: "O item do menu foi atualizado com sucesso.",
      });
    } else {
      const newItem = { ...item, id: Date.now().toString() };
      setMenuItems(prev => [...prev, newItem]);
      toast({
        title: "Item criado",
        description: "O novo item do menu foi criado com sucesso.",
      });
    }
    setEditingItem(null);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    setMenuItems(prev => prev.filter(i => i.id !== id));
    toast({
      title: "Item removido",
      description: "O item do menu foi removido com sucesso.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Menu className="h-5 w-5" />
              Gerenciamento de Menus
            </CardTitle>
            <CardDescription>
              Configure os itens de menu e navegação do sistema.
            </CardDescription>
          </div>
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Item
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {(isCreating || editingItem) && (
          <MenuItemForm
            item={editingItem}
            onSave={handleSave}
            onCancel={() => {
              setEditingItem(null);
              setIsCreating(false);
            }}
          />
        )}

        <div className="space-y-3">
          {menuItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
              <GripVertical className="h-4 w-4 text-gray-400" />
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">{item.label}</span>
                  <Badge variant={item.isActive ? "default" : "secondary"}>
                    {item.isActive ? "Ativo" : "Inativo"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">{item.url}</p>
                <div className="flex gap-1 mt-1">
                  {item.roles.map(role => (
                    <Badge key={role} variant="outline" className="text-xs">
                      {role}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingItem(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

interface MenuItemFormProps {
  item: CMSMenuItem | null;
  onSave: (item: CMSMenuItem) => void;
  onCancel: () => void;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({ item, onSave, onCancel }) => {
  const [formData, setFormData] = useState<CMSMenuItem>(
    item || {
      id: '',
      label: '',
      url: '',
      icon: '',
      order: 0,
      isActive: true,
      roles: ['admin']
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-lg">
          {item ? 'Editar Item do Menu' : 'Novo Item do Menu'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="label">Rótulo</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="icon">Ícone</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                placeholder="home, users, settings..."
              />
            </div>
            <div>
              <Label htmlFor="order">Ordem</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="isActive">Item ativo</Label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="bg-cbmepi-orange hover:bg-cbmepi-orange/90">
              Salvar
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default MenuManager;
