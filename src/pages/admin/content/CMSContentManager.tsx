import React, { useEffect, useState } from 'react';
import { cmsContentService } from '@/services/cms';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Edit2, Trash2, X } from 'lucide-react';

const initialForm = {
  section: '',
  title: '',
  subtitle: '',
  content: '',
  image_url: '',
  order_index: 0,
  is_active: true,
};

export default function CMSContentManager() {
  const [contents, setContents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<any>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContents = () => {
    setLoading(true);
    cmsContentService.getAll().then(setContents).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const openModal = (content?: any) => {
    if (content) {
      setForm({ ...content });
      setEditingId(content.id);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox' && e.target instanceof HTMLInputElement && name === 'is_active') {
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
      if (!form.section || !form.title) {
        setError('Seção e título são obrigatórios.');
        setSaving(false);
        return;
      }
      if (editingId) {
        await cmsContentService.update(editingId, form);
      } else {
        await cmsContentService.create(form);
      }
      closeModal();
      fetchContents();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja deletar este conteúdo?')) return;
    await cmsContentService.remove(id);
    fetchContents();
  };

  return (
    <Card className="shadow-lg border border-gray-200 max-w-4xl mx-auto mt-6">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl font-bold text-cbmepi-orange">Conteúdos Editáveis</CardTitle>
        <button
          onClick={() => openModal()}
          className="flex items-center gap-2 px-4 py-2 rounded bg-cbmepi-orange text-white font-semibold shadow hover:bg-orange-600 transition"
        >
          <Plus size={18} /> Novo conteúdo
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
                  <th className="px-4 py-2 text-left">Seção</th>
                  <th className="px-4 py-2 text-left">Título</th>
                  <th className="px-4 py-2 text-center">Ativo</th>
                  <th className="px-4 py-2 text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {contents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-400">Nenhum conteúdo cadastrado.</td>
                  </tr>
                ) : (
                  contents.map((content, idx) => (
                    <tr
                      key={content.id}
                      className={
                        idx % 2 === 0
                          ? 'bg-white hover:bg-gray-50 transition'
                          : 'bg-gray-50 hover:bg-gray-100 transition'
                      }
                    >
                      <td className="px-4 py-2 font-medium">{content.section}</td>
                      <td className="px-4 py-2">{content.title}</td>
                      <td className="px-4 py-2 text-center">
                        {content.is_active ? (
                          <span className="inline-block px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-semibold">Ativo</span>
                        ) : (
                          <span className="inline-block px-2 py-1 rounded bg-red-100 text-red-700 text-xs font-semibold">Inativo</span>
                        )}
                      </td>
                      <td className="px-4 py-2 text-center flex gap-2 justify-center">
                        <button
                          onClick={() => openModal(content)}
                          className="p-2 rounded bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                          title="Editar"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(content.id)}
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
              {editingId ? 'Editar' : 'Novo'} Conteúdo
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Seção*</label>
                <input
                  name="section"
                  value={form.section}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cbmepi-orange"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Título*</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cbmepi-orange"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Subtítulo</label>
                <input
                  name="subtitle"
                  value={form.subtitle}
                  onChange={handleChange}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cbmepi-orange"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Conteúdo</label>
                <textarea
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  rows={4}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cbmepi-orange"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Imagem (URL)</label>
                <input
                  name="image_url"
                  value={form.image_url}
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
                    name="is_active"
                    type="checkbox"
                    checked={form.is_active}
                    onChange={handleChange}
                    className="accent-cbmepi-orange"
                  />
                  <span className="text-sm">Ativo</span>
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