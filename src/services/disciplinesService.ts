
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Discipline = Tables<'disciplines'>;
export type DisciplineInsert = TablesInsert<'disciplines'>;
export type DisciplineUpdate = TablesUpdate<'disciplines'>;

export interface DisciplineWithCourse extends Discipline {
  courses: {
    id: string;
    name: string;
  } | null;
}

class DisciplinesService {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('disciplines')
        .select(`
          *,
          courses:course_id (
            id,
            name
          )
        `)
        .order('name');

      if (error) throw error;
      return { data: data as DisciplineWithCourse[], error: null };
    } catch (error: any) {
      console.error('Error fetching disciplines:', error);
      return { data: null, error: error.message };
    }
  }

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('disciplines')
        .select(`
          *,
          courses:course_id (
            id,
            name
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data: data as DisciplineWithCourse, error: null };
    } catch (error: any) {
      console.error('Error fetching discipline:', error);
      return { data: null, error: error.message };
    }
  }

  async getByCourse(courseId: string) {
    try {
      const { data, error } = await supabase
        .from('disciplines')
        .select('*')
        .eq('course_id', courseId)
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching disciplines by course:', error);
      return { data: null, error: error.message };
    }
  }

  async create(discipline: DisciplineInsert) {
    try {
      const { data, error } = await supabase
        .from('disciplines')
        .insert(discipline)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating discipline:', error);
      return { data: null, error: error.message };
    }
  }

  async update(id: string, updates: DisciplineUpdate) {
    try {
      const { data, error } = await supabase
        .from('disciplines')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating discipline:', error);
      return { data: null, error: error.message };
    }
  }

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('disciplines')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Error deleting discipline:', error);
      return { error: error.message };
    }
  }
}

export const disciplinesService = new DisciplinesService();
