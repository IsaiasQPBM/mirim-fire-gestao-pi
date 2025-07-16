
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, User, CheckCircle, AlertCircle } from 'lucide-react';
import { communicationService } from '@/services/api';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const MessagesInbox: React.FC = () => {
  const [userId, setUserId] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUserRole = localStorage.getItem('userRole');
    if (!storedUserId || !storedUserRole) {
      setError('Usuário não autenticado.');
      setLoading(false);
      return;
    }
    setUserId(storedUserId);
    setUserRole(storedUserRole);
    loadMessages(storedUserId);
  }, []);

  const loadMessages = async (uid: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await communicationService.getMessages(uid);
      // Filtrar apenas mensagens (não notificações/avisos)
      const messagesData = data?.filter((msg: any) => msg.message_type === 'message') || [];
      setMessages(messagesData);
    } catch (e) {
      setError('Erro ao carregar mensagens. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    } catch {
      return 'Data inválida';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-cbmepi-orange" />
        <span className="ml-2 text-gray-600">Carregando mensagens...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => loadMessages(userId)} className="px-4 py-2 bg-orange-500 text-white rounded">Tentar Novamente</button>
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto text-center py-12">
          <Mail className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Nenhuma mensagem encontrada</h2>
          <p className="text-gray-500">Sua caixa de entrada está vazia.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-cbmepi-black mb-6">Caixa de Entrada</h1>
        <div className="space-y-4">
          {messages.map(msg => (
            <Card key={msg.id} className={`transition-all ${!msg.is_read ? 'border-l-4 border-l-cbmepi-orange bg-orange-50/30' : ''}`}>
              <CardHeader className="flex flex-row items-center gap-4 pb-2 cursor-pointer" onClick={() => setExpandedId(expandedId === msg.id ? null : msg.id)}>
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    {!msg.is_read && <Badge className="bg-orange-500 text-white">Nova</Badge>}
                    {msg.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <User className="h-4 w-4 text-gray-400" />
                    {msg.profiles?.full_name || msg.sender_id}
                    <span className="mx-2">•</span>
                    {formatDate(msg.sent_at)}
                  </div>
                </div>
                {msg.is_read ? (
                  <span className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500" /><span className="sr-only">Lida</span></span>
                ) : (
                  <span className="flex items-center"><Mail className="h-5 w-5 text-orange-500" /><span className="sr-only">Não lida</span></span>
                )}
              </CardHeader>
              {expandedId === msg.id && (
                <CardContent>
                  <div className="mb-2 text-gray-700 whitespace-pre-line">{msg.content}</div>
                  <div className="text-xs text-gray-500">ID da mensagem: {msg.id}</div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessagesInbox;
