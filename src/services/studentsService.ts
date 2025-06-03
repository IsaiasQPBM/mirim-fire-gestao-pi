
import { supabase } from '@/integrations/supabase/client';

export interface Student {
  id: string;
  user_id?: string;
  registration_number: string;
  birth_date?: string;
  phone?: string;
  profile_image?: string;
  status: 'active' | 'inactive' | 'on_leave';
  enrollment_date: string;
  notes?: string;
  address?: any;
  created_at: string;
  updated_at: string;
  profiles?: {
    id: string;
    full_name: string;
    email?: string;
    phone?: string;
  };
}

export interface Guardian {
  id: string;
  student_id: string;
  name: string;
  relationship: string;
  phone?: string;
  email?: string;
  is_emergency_contact: boolean;
}

export interface StudentInsert {
  user_id?: string;
  registration_number: string;
  birth_date?: string;
  phone?: string;
  profile_image?: string;
  status?: 'active' | 'inactive' | 'on_leave';
  enrollment_date?: string;
  notes?: string;
  address?: any;
}

class StudentsService {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          profiles:user_id (
            id,
            full_name,
            email,
            phone
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching students:', error);
      return { data: null, error: error.message };
    }
  }

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('students')
        .select(`
          *,
          profiles:user_id (
            id,
            full_name,
            email,
            phone
          ),
          guardians (*),
          student_documents (*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching student:', error);
      return { data: null, error: error.message };
    }
  }

  async create(student: StudentInsert) {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert(student)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating student:', error);
      return { data: null, error: error.message };
    }
  }

  async update(id: string, updates: Partial<StudentInsert>) {
    try {
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating student:', error);
      return { data: null, error: error.message };
    }
  }

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Error deleting student:', error);
      return { error: error.message };
    }
  }

  async addGuardian(guardian: Omit<Guardian, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('guardians')
        .insert(guardian)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error adding guardian:', error);
      return { data: null, error: error.message };
    }
  }

  async removeGuardian(id: string) {
    try {
      const { error } = await supabase
        .from('guardians')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Error removing guardian:', error);
      return { error: error.message };
    }
  }
}

export const studentsService = new StudentsService();
