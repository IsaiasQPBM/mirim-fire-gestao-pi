
import { supabase } from '@/integrations/supabase/client';

export interface Communication {
  id?: string;
  sender_id?: string;
  recipient_id?: string;
  class_id?: string;
  title: string;
  content: string;
  message_type: 'individual' | 'group' | 'announcement';
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

export const communicationsService = {
  async sendMessage(message: Communication) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('communications')
      .insert({
        ...message,
        sender_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getMessages() {
    const { data, error } = await supabase
      .from('communications')
      .select(`
        *,
        sender:sender_id(full_name),
        recipient:recipient_id(full_name),
        classes:class_id(name)
      `)
      .order('sent_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async markAsRead(id: string) {
    const { data, error } = await supabase
      .from('communications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) throw error;
    return data;
  }
};
