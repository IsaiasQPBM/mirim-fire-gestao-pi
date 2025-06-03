
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  role: 'admin' | 'instructor' | 'student';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface ProfileInsert {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
  birth_date?: string;
  role: 'admin' | 'instructor' | 'student';
  status?: 'active' | 'inactive';
}

class ProfilesService {
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching profiles:', error);
      return { data: null, error: error.message };
    }
  }

  async getById(id: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      return { data: null, error: error.message };
    }
  }

  async create(profile: ProfileInsert) {
    try {
      // Primeiro criar o usuário na auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: profile.email || '',
        password: 'temp123456', // Senha temporária
        email_confirm: true,
        user_metadata: {
          full_name: profile.full_name,
          role: profile.role
        }
      });

      if (authError) throw authError;

      // Depois criar o perfil
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          ...profile,
          id: authData.user.id
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error creating profile:', error);
      return { data: null, error: error.message };
    }
  }

  async update(id: string, updates: Partial<ProfileInsert>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      return { data: null, error: error.message };
    }
  }

  async delete(id: string) {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Error deleting profile:', error);
      return { error: error.message };
    }
  }

  async getByRole(role: 'admin' | 'instructor' | 'student') {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', role)
        .order('full_name');

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error fetching profiles by role:', error);
      return { data: null, error: error.message };
    }
  }
}

export const profilesService = new ProfilesService();
