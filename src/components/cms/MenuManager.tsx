
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Menu, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { menuService, menuItemService } from '@/services/api';
import type { Database } from '@/integrations/supabase/types';

type CMSMenu = Database['public']['Tables']['cms_menus']['Row'];
type CMSMenuItem = Database['public']['Tables']['cms_menu_items']['Row'];

const MenuManager: React.FC = () => {
  const [menus, setMenus] = useState<CMSMenu[]>([]);
  const [menuItems, setMenuItems] = useState<CMSMenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingMenu, setEditingMenu] = useState<CMSMenu | null>(null);
  const [editingItem, setEditingItem] = useState<CMSMenuItem | null>(null);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const menusData = await menuService.getAll();
      setMenus(menusData);
      
      // Carregar todos os itens de menu
      const allItems: CMSMenuItem[] = [];
      for (const menu of menusData) {
        const items = await menuItemService.getByMenu(menu.id);
        allItems.push(...items);
      }
      setMenuItems(allItems);
    } catch (error) {
      console.error('Erro ao carregar menus:', error);
      setError('Erro ao carregar menus. Tente novamente.');
      toast({
        title: "Erro",
        description: "Não foi possível carregar os menus.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMenu = async (menuData: Omit<CMSMenu, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setSaving(true);
      
      const newMenu = await menuService.create({
        ...menuData,
        is_active: menuData.is_active ?? true
      });
      
      setMenus(prev => [...prev, newMenu]);
      setShowMenuForm(false);
      setEditingMenu(null);
      
      toast({
        title: "Menu criado",
        description: "Menu criado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao criar menu:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o menu.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateMenu = async (id: string, updates: Partial<CMSMenu>) => {
    try {
      setSaving(true);
      
      const updatedMenu = await menuService.update(id, updates);
      setMenus(prev => prev.map(menu => menu.id === id ? updatedMenu : menu));
      setEditingMenu(null);
      
      toast({
        title: "Menu atualizado",
        description: "Menu atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar menu:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o menu.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMenu = async (id: string) => {
    try {
      setSaving(true);
      
      await menuService.delete(id);
      setMenus(prev => prev.filter(menu => menu.id !== id));
      setMenuItems(prev => prev.filter(item => item.menu_id !== id));
      
      toast({
        title: "Menu excluído",
        description: "Menu excluído com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao excluir menu:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o menu.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateMenuItem = async (itemData: Omit<CMSMenuItem, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setSaving(true);
      
      const newItem = await menuItemService.create({
        ...itemData,
        is_active: itemData.is_active ?? true,
        target: itemData.target ?? '_self',
        parent_id: itemData.parent_id ?? null
      });
      
      setMenuItems(prev => [...prev, newItem]);
      setShowItemForm(false);
      setEditingItem(null);
      
      toast({
        title: "Item criado",
        description: "Item de menu criado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao criar item:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o item.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateMenuItem = async (id: string, updates: Partial<CMSMenuItem>) => {
    try {
      setSaving(true);
      
      const updatedItem = await menuItemService.update(id, updates);
      setMenuItems(prev => prev.map(item => item.id === id ? updatedItem : item));
      setEditingItem(null);
      
      toast({
        title: "Item atualizado",
        description: "Item de menu atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar item:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o item.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMenuItem = async (id: string) => {
    try {
      setSaving(true);
      
      await menuItemService.delete(id);
      setMenuItems(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Item excluído",
        description: "Item de menu excluído com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao excluir item:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o item.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getMenuItems = (menuId: string) => {
    return menuItems.filter(item => item.menu_id === menuId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-cbmepi-orange" />
        <span className="ml-2">Carregando menus...</span>
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
            <Menu className="h-5 w-5" />
            Gerenciador de Menus
          </CardTitle>
          <CardDescription>
            Gerencie os menus do sistema e seus itens. Crie menus para diferentes localizações e organize os itens de navegação.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Lista de Menus */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Menus</h3>
                <Button
                  onClick={() => setShowMenuForm(true)}
                  disabled={saving}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Novo Menu
                </Button>
              </div>

              <div className="grid gap-4">
                {menus.map((menu) => (
                  <Card key={menu.id} className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant={menu.is_active ? "default" : "outline"}>
                            {menu.location}
                          </Badge>
                          <div>
                            <h4 className="font-medium">{menu.name}</h4>
                            <p className="text-sm text-gray-500">
                              {getMenuItems(menu.id).length} itens
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingMenu(menu)}
                            disabled={saving}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowItemForm(true)}
                            disabled={saving}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Adicionar Item
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteMenu(menu.id)}
                            disabled={saving}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {getMenuItems(menu.id).map((item) => (
                          <div key={item.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <div className="flex items-center gap-3">
                              <span className="text-sm font-medium">{item.title}</span>
                              {item.url && (
                                <span className="text-xs text-gray-500">{item.url}</span>
                              )}
                              <Badge variant={item.is_active ? "default" : "outline"} className="text-xs">
                                {item.target}
                              </Badge>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingItem(item)}
                                disabled={saving}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteMenuItem(item.id)}
                                disabled={saving}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        {getMenuItems(menu.id).length === 0 && (
                          <p className="text-sm text-gray-500 text-center py-4">
                            Nenhum item neste menu
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Menu */}
      {(showMenuForm || editingMenu) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingMenu ? 'Editar Menu' : 'Novo Menu'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MenuForm
              menu={editingMenu}
              onSubmit={editingMenu ? handleUpdateMenu : handleCreateMenu}
              onCancel={() => {
                setShowMenuForm(false);
                setEditingMenu(null);
              }}
              saving={saving}
            />
          </CardContent>
        </Card>
      )}

      {/* Formulário de Item de Menu */}
      {(showItemForm || editingItem) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingItem ? 'Editar Item' : 'Novo Item de Menu'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MenuItemForm
              item={editingItem}
              menus={menus}
              onSubmit={editingItem ? handleUpdateMenuItem : handleCreateMenuItem}
              onCancel={() => {
                setShowItemForm(false);
                setEditingItem(null);
              }}
              saving={saving}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Componente de formulário de menu
interface MenuFormProps {
  menu?: CMSMenu | null;
  onSubmit: ((id: string, data: Partial<CMSMenu>) => Promise<void>) | ((data: Omit<CMSMenu, 'id' | 'created_at' | 'updated_at'>) => Promise<void>);
  onCancel: () => void;
  saving: boolean;
}

const MenuForm: React.FC<MenuFormProps> = ({ menu, onSubmit, onCancel, saving }) => {
  const [formData, setFormData] = useState({
    name: menu?.name || '',
    location: menu?.location || 'header',
    is_active: menu?.is_active ?? true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (menu) {
      await (onSubmit as (id: string, data: Partial<CMSMenu>) => Promise<void>)(menu.id, formData);
    } else {
      await (onSubmit as (data: Omit<CMSMenu, 'id' | 'created_at' | 'updated_at'>) => Promise<void>)(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Nome do Menu</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="location">Localização</Label>
        <Select
          value={formData.location}
          onValueChange={(value) => setFormData(prev => ({ ...prev, location: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="header">Cabeçalho</SelectItem>
            <SelectItem value="sidebar">Barra Lateral</SelectItem>
            <SelectItem value="footer">Rodapé</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
        />
        <Label htmlFor="is_active">Menu ativo</Label>
      </div>
      
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
          {menu ? 'Atualizar' : 'Criar'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

// Componente de formulário de item de menu
interface MenuItemFormProps {
  item?: CMSMenuItem | null;
  menus: CMSMenu[];
  onSubmit: ((id: string, data: Partial<CMSMenuItem>) => Promise<void>) | ((data: Omit<CMSMenuItem, 'id' | 'created_at' | 'updated_at'>) => Promise<void>);
  onCancel: () => void;
  saving: boolean;
}

const MenuItemForm: React.FC<MenuItemFormProps> = ({ item, menus, onSubmit, onCancel, saving }) => {
  const [formData, setFormData] = useState({
    menu_id: item?.menu_id || menus[0]?.id || '',
    title: item?.title || '',
    url: item?.url || '',
    icon: item?.icon || '',
    order_index: item?.order_index || 0,
    is_active: item?.is_active ?? true,
    target: item?.target || '_self',
    parent_id: item?.parent_id ?? null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (item) {
      await (onSubmit as (id: string, data: Partial<CMSMenuItem>) => Promise<void>)(item.id, formData);
    } else {
      await (onSubmit as (data: Omit<CMSMenuItem, 'id' | 'created_at' | 'updated_at'>) => Promise<void>)(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="menu_id">Menu</Label>
        <Select
          value={formData.menu_id}
          onValueChange={(value) => setFormData(prev => ({ ...prev, menu_id: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {menus.map((menu) => (
              <SelectItem key={menu.id} value={menu.id}>
                {menu.name} ({menu.location})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>
      
      <div>
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          value={formData.url}
          onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
          placeholder="/pagina"
        />
      </div>
      
      <div>
        <Label htmlFor="icon">Ícone</Label>
        <Input
          id="icon"
          value={formData.icon}
          onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
          placeholder="home"
        />
      </div>
      
      <div>
        <Label htmlFor="order_index">Ordem</Label>
        <Input
          id="order_index"
          type="number"
          value={formData.order_index}
          onChange={(e) => setFormData(prev => ({ ...prev, order_index: parseInt(e.target.value) || 0 }))}
        />
      </div>
      
      <div>
        <Label htmlFor="target">Alvo</Label>
        <Select
          value={formData.target}
          onValueChange={(value) => setFormData(prev => ({ ...prev, target: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="_self">Mesma janela</SelectItem>
            <SelectItem value="_blank">Nova janela</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
        />
        <Label htmlFor="is_active">Item ativo</Label>
      </div>
      
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
          {item ? 'Atualizar' : 'Criar'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default MenuManager;
