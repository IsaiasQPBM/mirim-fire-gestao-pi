
import { supabase } from '@/integrations/supabase/client';

export interface PedagogicalObservation {
  id: string;
  student_id: string;
  instructor_id: string;
  type: 'behavioral' | 'academic' | 'attendance' | 'health' | 'personal';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  date: string;
  follow_up_required: boolean;
  follow_up_date?: string;
  created_at: string;
  updated_at: string;
  students?: {
    id: string;
    profiles: {
      full_name: string;
    };
  };
  instructor_profiles?: {
    full_name: string;
  };
}

export interface ObservationInsert {
  student_id: string;
  instructor_id: string;
  type: 'behavioral' | 'academic' | 'attendance' | 'health' | 'personal';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  description: string;
  date?: string;
  follow_up_required?: boolean;
  follow_up_date?: string;
}

class ObservationsService {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('pedagogical_observations')
        .select(`
          *,
          students:student_id (
            id,
            profiles:user_id (
              full_name
            )
          ),
          instructor_profiles:instructor_id (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching observations:', error);
      return { data: null, error: error.message };
    }
  }

  async getByStudentId(studentId: string) {
    try {
      const { data, error } = await supabase
        .from('pedagogical_observations')
        .select(`
          *,
          instructor_profiles:instructor_id (
            full_name
          )
        `)
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching student observations:', error);
      return { data: null, error: error.message };
    }
  }

  async create(observation: ObservationInsert) {
    try {
      const { data, error } = await supabase
        .from('pedagogical_observations')
        .insert(observation)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating observation:', error);
      return { data: null, error: error.message };
    }
  }

  async update(id: string, updates: Partial<ObservationInsert>) {
    try {
      const { data, error } = await supabase
        .from('pedagogical_observations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating observation:', error);
      return { data: null, error: error.message };
    }
  }

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('pedagogical_observations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Error deleting observation:', error);
      return { error: error.message };
    }
  }
}

export const observationsService = new ObservationsService();
