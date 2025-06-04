
import { supabase } from '@/integrations/supabase/client';

export interface Lesson {
  id?: string;
  class_id: string;
  discipline_id: string;
  title: string;
  description?: string;
  lesson_date: string;
  start_time: string;
  end_time: string;
  instructor_id?: string;
  resources?: string[];
  content?: string;
  status: 'planned' | 'completed' | 'cancelled';
}

export const lessonsService = {
  async createLesson(lesson: Lesson) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const { data, error } = await supabase
      .from('lessons')
      .insert({
        ...lesson,
        instructor_id: user.id
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getLessons() {
    const { data, error } = await supabase
      .from('lessons')
      .select(`
        *,
        classes:class_id(name),
        disciplines:discipline_id(name),
        profiles:instructor_id(full_name)
      `)
      .order('lesson_date', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async updateLesson(id: string, updates: Partial<Lesson>) {
    const { data, error } = await supabase
      .from('lessons')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteLesson(id: string) {
    const { error } = await supabase
      .from('lessons')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
