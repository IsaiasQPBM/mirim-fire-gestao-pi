import React, { useEffect, useState } from 'react';
import { cmsContactService } from '@/services/cms';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const initialForm = {
  type: '',
  label: '',
  value: '',
  icon: '',
  is_visible: true,
  order_index: 0,
};

export default function CMSContactManager() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<any>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = () => {
    setLoading(true);
    cmsContactService.getAll().then(setContacts).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const openModal = (contact?: any) => {
    if (contact) {
      setForm({ ...contact });
      setEditingId(contact.id);
    } else {
      setForm(initialForm);
      setEditingId(null);
    }
    setModalOpen(true);
    setError(null);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(initialForm);
    setEditingId(null);
    setError(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement && name === 'is_visible') {
      setForm(f => ({ ...f, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (!form.type || !form.value) {
        setError('Tipo e valor são obrigatórios.');
        setSaving(false);
        return;
      }
      if (editingId) {
        await cmsContactService.update(editingId, form);
      } else {
        await cmsContactService.create(form);
      }
      closeModal();
      fetchContacts();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja deletar este contato?')) return;
    await cmsContactService.remove(id);
    fetchContacts();
  };

  return (
    <Card className="shadow-lg border border-gray-200 max-w-4xl mx-auto mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold text-cbmepi-orange">Contatos Institucionais</CardTitle>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 rounded bg-cbmepi-orange text-white font-semibold shadow hover:bg-orange-600 transition"
        >
          <Plus size={18} /> Novo contato
        </button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="py-8 text-center text-gray-500">Carregando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border rounded-lg overflow-hidden text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-4 py-2 text-left">Tipo</th>
                  <th className="px-4 py-2 text-left">Valor</th>
                  <th className="px-4 py-2 text-center">Visível</th>
                  <th className="px-4 py-2 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {contacts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-400">Nenhum contato cadastrado.</td>
                  </tr>
                ) : (
                  contacts.map((contact, idx) => (
                    <tr
                      key={contact.id}
                      className={
                        idx % 2 === 0
                          ? 'bg-white hover:bg-gray-50 transition'
                          : 'bg-gray-50 hover:bg-gray-100 transition'
                      }
                    >
                      <td className="px-4 py-2 font-medium">{contact.type}</td>
                      <td className="px-4 py-2">{contact.value}</td>
                      <td className="px-4 py-2 text-center">
                        {contact.is_visible ? (
                          <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">Sim</span>
                        ) : (
                          <span className="inline-block px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold">Não</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-center flex gap-2 justify-center">
                        <button
                          onClick={() => openModal(contact)}
                          className="p-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(contact.id)}
                          className="p-2 rounded bg-red-100 text-red-700 hover:bg-red-200 transition"
                          title="Deletar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 animate-fade-in">
          <form
            onSubmit={handleSave}
            className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md relative animate-scale-in"
          >
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              title="Fechar"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold mb-4 text-cbmepi-orange">
              {editingId ? 'Editar' : 'Novo'} Contato
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Tipo*</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cbmepi-orange"
                >
                  <option value="">Selecione</option>
                  <option value="email">E-mail</option>
                  <option value="telefone">Telefone</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="endereco">Endereço</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="outro">Outro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Rótulo</label>
                <input
                  name="label"
                  value={form.label}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cbmepi-orange"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Valor*</label>
                <input
                  name="value"
                  value={form.value}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cbmepi-orange"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ícone</label>
                <input
                  name="icon"
                  value={form.icon}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cbmepi-orange"
                />
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1">Ordem</label>
                  <input
                    name="order_index"
                    type="number"
                    value={form.order_index}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cbmepi-orange"
                  />
                </div>
                <div className="flex items-center gap-2 mt-6">
                  <input
                    name="is_visible"
                    type="checkbox"
                    checked={form.is_visible}
                    onChange={handleChange}
                    className="accent-cbmepi-orange"
                  />
                  <span className="text-sm">Visível</span>
                </div>
              </div>
              {error && <div className="text-red-600 text-sm font-medium mt-2">{error}</div>}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 rounded bg-cbmepi-orange text-white font-semibold shadow hover:bg-orange-600 transition"
                >
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </Card>
  );
} 