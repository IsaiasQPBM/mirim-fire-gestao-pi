
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

export type Course = Tables<'courses'>;
export type CourseInsert = TablesInsert<'courses'>;
export type CourseUpdate = TablesUpdate<'courses'>;

class CoursesService {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('name');

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      return { data: null, error: error.message };
    }
  }

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching course:', error);
      return { data: null, error: error.message };
    }
  }

  async create(course: CourseInsert) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert(course)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating course:', error);
      return { data: null, error: error.message };
    }
  }

  async update(id: string, updates: CourseUpdate) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating course:', error);
      return { data: null, error: error.message };
    }
  }

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Error deleting course:', error);
      return { error: error.message };
    }
  }

  async getActiveCourses() {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching active courses:', error);
      return { data: null, error: error.message };
    }
  }
}

export const coursesService = new CoursesService();
