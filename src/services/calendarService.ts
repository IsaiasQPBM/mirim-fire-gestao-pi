
import { supabase } from '@/integrations/supabase/client';

export interface CalendarEvent {
  id?: string;
  title: string;
  description?: string;
  start_date: string;
  end_date: string;
  event_type: 'lesson' | 'exam' | 'event';
  class_id?: string;
  discipline_id?: string;
  created_by?: string;
}

export const calendarService = {
  async createEvent(event: CalendarEvent) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('calendar_events')
      .insert({
        ...event,
        created_by: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getEvents() {
    const { data, error } = await supabase
      .from('calendar_events')
      .select(`
        *,
        classes:class_id(name),
        disciplines:discipline_id(name)
      `)
      .order('start_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async updateEvent(id: string, updates: Partial<CalendarEvent>) {
    const { data, error } = await supabase
      .from('calendar_events')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteEvent(id: string) {
    const { error } = await supabase
      .from('calendar_events')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
