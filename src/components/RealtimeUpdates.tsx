
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Bell, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Interface para as atualizações em tempo real
interface RealtimeUpdate {
  id: string;
  type: 'course' | 'class' | 'discipline' | 'assessment' | 'communication' | 'student';
  action: 'create' | 'update' | 'delete';
  entity: string;
  timestamp: Date;
  message: string;
  read: boolean;
}

const RealtimeUpdates: React.FC = () => {
  const [updates, setUpdates] = useState<RealtimeUpdate[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Configurar inscrições em tempo real para várias tabelas
    const courseChannel = supabase
      .channel('public:courses')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'courses' }, 
        (payload) => {
          handleRealtimeUpdate('course', payload);
        }
      )
      .subscribe();

    const classesChannel = supabase
      .channel('public:classes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'classes' }, 
        (payload) => {
          handleRealtimeUpdate('class', payload);
        }
      )
      .subscribe();
      
    const disciplinesChannel = supabase
      .channel('public:disciplines')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'disciplines' }, 
        (payload) => {
          handleRealtimeUpdate('discipline', payload);
        }
      )
      .subscribe();

    return () => {
      // Limpar inscrições quando o componente for desmontado
      supabase.removeChannel(courseChannel);
      supabase.removeChannel(classesChannel);
      supabase.removeChannel(disciplinesChannel);
    };
  }, []);

  // Função para criar mensagens amigáveis para atualizações em tempo real
  const handleRealtimeUpdate = (type: RealtimeUpdate['type'], payload: any) => {
    const action: RealtimeUpdate['action'] = 
      payload.eventType === 'INSERT' 
        ? 'create' 
        : payload.eventType === 'UPDATE' 
          ? 'update' 
          : 'delete';
    
    let entity = '';
    let message = '';
    
    if (type === 'course') {
      entity = payload.new?.name || payload.old?.name || 'Curso';
      
      if (action === 'create') {
        message = `Novo curso "${entity}" foi criado.`;
      } else if (action === 'update') {
        message = `O curso "${entity}" foi atualizado.`;
      } else {
        message = `O curso "${entity}" foi removido.`;
      }
    } else if (type === 'class') {
      entity = payload.new?.name || payload.old?.name || 'Turma';
      
      if (action === 'create') {
        message = `Nova turma "${entity}" foi criada.`;
      } else if (action === 'update') {
        message = `A turma "${entity}" foi atualizada.`;
      } else {
        message = `A turma "${entity}" foi removida.`;
      }
    } else if (type === 'discipline') {
      entity = payload.new?.name || payload.old?.name || 'Disciplina';
      
      if (action === 'create') {
        message = `Nova disciplina "${entity}" foi criada.`;
      } else if (action === 'update') {
        message = `A disciplina "${entity}" foi atualizada.`;
      } else {
        message = `A disciplina "${entity}" foi removida.`;
      }
    }
    
    const update: RealtimeUpdate = {
      id: crypto.randomUUID(),
      type,
      action,
      entity,
      timestamp: new Date(),
      message,
      read: false,
    };
    
    setUpdates(prev => [update, ...prev].slice(0, 100));
    
    // Mostrar toast para notificação
    toast({
      title: `Atualização: ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      description: message,
    });
  };

  const markAsRead = (id: string) => {
    setUpdates(prev => 
      prev.map(update => 
        update.id === id ? { ...update, read: true } : update
      )
    );
  };

  const markAllAsRead = () => {
    setUpdates(prev => prev.map(update => ({ ...update, read: true })));
  };

  const clearAll = () => {
    setUpdates([]);
  };

  const unreadCount = updates.filter(update => !update.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-medium">Atualizações em Tempo Real</h3>
            <button onClick={() => setIsOpen(false)} className="hover:bg-gray-100 p-1 rounded-full">
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {updates.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                Nenhuma atualização recente.
              </div>
            ) : (
              <ul className="divide-y">
                {updates.map((update) => (
                  <li 
                    key={update.id} 
                    className={`p-3 hover:bg-gray-50 cursor-pointer ${update.read ? 'bg-white' : 'bg-blue-50'}`}
                    onClick={() => markAsRead(update.id)}
                  >
                    <p className="text-sm mb-1">{update.message}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        {new Date(update.timestamp).toLocaleTimeString()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(update.type)}`}>
                        {update.type}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="p-2 border-t flex justify-between">
            <button 
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Marcar tudo como lido
            </button>
            <button 
              onClick={clearAll}
              className="text-xs text-gray-600 hover:text-gray-800"
            >
              Limpar tudo
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Função auxiliar para obter cores baseadas no tipo
function getTypeColor(type: string): string {
  switch (type) {
    case 'course':
      return 'bg-blue-100 text-blue-800';
    case 'class':
      return 'bg-green-100 text-green-800';
    case 'discipline':
      return 'bg-purple-100 text-purple-800';
    case 'assessment':
      return 'bg-yellow-100 text-yellow-800';
    case 'communication':
      return 'bg-pink-100 text-pink-800';
    case 'student':
      return 'bg-orange-100 text-orange-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default RealtimeUpdates;
