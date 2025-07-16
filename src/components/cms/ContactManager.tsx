import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Phone, Mail, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { contactService } from '@/services/api';
import type { Database } from '@/integrations/supabase/types';

type CMSContact = Database['public']['Tables']['cms_contacts']['Row'];

const ContactManager: React.FC = () => {
  const [contacts, setContacts] = useState<CMSContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingContact, setEditingContact] = useState<CMSContact | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await contactService.getAll();
      setContacts(data);
    } catch (error) {
      console.error('Erro ao carregar contatos:', error);
      setError('Erro ao carregar contatos. Tente novamente.');
      toast({
        title: "Erro",
        description: "Não foi possível carregar os contatos.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContact = async (contactData: Omit<CMSContact, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      setSaving(true);
      
      const newContact = await contactService.create({
        ...contactData,
        is_primary: contactData.is_primary ?? false,
        is_active: contactData.is_active ?? true
      });
      
      setContacts(prev => [...prev, newContact]);
      setShowForm(false);
      setEditingContact(null);
      
      toast({
        title: "Contato criado",
        description: "Contato criado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao criar contato:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o contato.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateContact = async (id: string, updates: Partial<CMSContact>) => {
    try {
      setSaving(true);
      
      const updatedContact = await contactService.update(id, updates);
      setContacts(prev => prev.map(contact => contact.id === id ? updatedContact : contact));
      setEditingContact(null);
      
      toast({
        title: "Contato atualizado",
        description: "Contato atualizado com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao atualizar contato:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o contato.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteContact = async (id: string) => {
    try {
      setSaving(true);
      
      await contactService.delete(id);
      setContacts(prev => prev.filter(contact => contact.id !== id));
      
      toast({
        title: "Contato excluído",
        description: "Contato excluído com sucesso.",
      });
    } catch (error) {
      console.error('Erro ao excluir contato:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir o contato.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'phone': return <Phone className="h-4 w-4" />;
      case 'address': return <MapPin className="h-4 w-4" />;
      case 'social': return <Phone className="h-4 w-4" />;
      default: return <Phone className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-100 text-blue-800';
      case 'phone': return 'bg-green-100 text-green-800';
      case 'address': return 'bg-purple-100 text-purple-800';
      case 'social': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'email': return 'Email';
      case 'phone': return 'Telefone';
      case 'address': return 'Endereço';
      case 'social': return 'Rede Social';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-cbmepi-orange" />
        <span className="ml-2">Carregando contatos...</span>
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
            <Phone className="h-5 w-5" />
            Gerenciador de Contatos
          </CardTitle>
          <CardDescription>
            Gerencie os contatos do sistema. Adicione emails, telefones, endereços e redes sociais para diferentes propósitos.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Lista de Contatos */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium">Contatos</h3>
                <Button
                  onClick={() => setShowForm(true)}
                  disabled={saving}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Novo Contato
                </Button>
              </div>

              <div className="grid gap-4">
                {contacts.map((contact) => (
                  <Card key={contact.id} className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge className={getTypeColor(contact.contact_type)}>
                            {getTypeIcon(contact.contact_type)}
                            <span className="ml-1">{getTypeLabel(contact.contact_type)}</span>
                          </Badge>
                          {contact.is_primary && (
                            <Badge variant="default" className="bg-cbmepi-orange">
                              Principal
                            </Badge>
                          )}
                          {!contact.is_active && (
                            <Badge variant="outline">Inativo</Badge>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingContact(contact)}
                            disabled={saving}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteContact(contact.id)}
                            disabled={saving}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div>
                          <span className="text-sm font-medium">Rótulo:</span>
                          <p className="text-sm">{contact.label}</p>
                        </div>
                        <div>
                          <span className="text-sm font-medium">Valor:</span>
                          <p className="text-sm">{contact.contact_value}</p>
                        </div>
                        <div className="text-xs text-gray-500">
                          Criado em: {new Date(contact.created_at).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {contacts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Phone className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>Nenhum contato cadastrado</p>
                    <p className="text-sm">Clique em "Novo Contato" para adicionar o primeiro contato</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Formulário de Contato */}
      {(showForm || editingContact) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingContact ? 'Editar Contato' : 'Novo Contato'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm
              contact={editingContact}
              onSubmit={editingContact ? handleUpdateContact : handleCreateContact}
              onCancel={() => {
                setShowForm(false);
                setEditingContact(null);
              }}
              saving={saving}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Componente de formulário de contato
interface ContactFormProps {
  contact?: CMSContact | null;
  onSubmit: ((id: string, data: Partial<CMSContact>) => Promise<void>) | ((data: Omit<CMSContact, 'id' | 'created_at' | 'updated_at'>) => Promise<void>);
  onCancel: () => void;
  saving: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({ contact, onSubmit, onCancel, saving }) => {
  const [formData, setFormData] = useState({
    contact_type: contact?.contact_type || 'email',
    contact_value: contact?.contact_value || '',
    label: contact?.label || '',
    is_primary: contact?.is_primary ?? false,
    is_active: contact?.is_active ?? true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contact) {
      await (onSubmit as (id: string, data: Partial<CMSContact>) => Promise<void>)(contact.id, formData);
    } else {
      await (onSubmit as (data: Omit<CMSContact, 'id' | 'created_at' | 'updated_at'>) => Promise<void>)(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="contact_type">Tipo de Contato</Label>
        <Select
          value={formData.contact_type}
          onValueChange={(value) => setFormData(prev => ({ ...prev, contact_type: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="phone">Telefone</SelectItem>
            <SelectItem value="address">Endereço</SelectItem>
            <SelectItem value="social">Rede Social</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="label">Rótulo</Label>
        <Input
          id="label"
          value={formData.label}
          onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
          placeholder="Ex: Email Principal, Telefone de Emergência"
          required
        />
      </div>
      
      <div>
        <Label htmlFor="contact_value">Valor</Label>
        <Input
          id="contact_value"
          value={formData.contact_value}
          onChange={(e) => setFormData(prev => ({ ...prev, contact_value: e.target.value }))}
          placeholder={
            formData.contact_type === 'email' ? 'contato@exemplo.com' :
            formData.contact_type === 'phone' ? '(86) 99999-9999' :
            formData.contact_type === 'address' ? 'Rua Exemplo, 123 - Bairro' :
            'https://exemplo.com'
          }
          required
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="is_primary"
          checked={formData.is_primary}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_primary: checked }))}
        />
        <Label htmlFor="is_primary">Contato principal</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
        />
        <Label htmlFor="is_active">Contato ativo</Label>
      </div>
      
      <div className="flex gap-2">
        <Button type="submit" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
          {contact ? 'Atualizar' : 'Criar'}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default ContactManager;
