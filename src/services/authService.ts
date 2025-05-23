
import { supabase } from '@/integrations/supabase/client';
import type { User } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'instructor' | 'student';
  status: 'active' | 'inactive';
}

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  role: 'admin' | 'instructor' | 'student';
  phone?: string;
  birth_date?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

class AuthService {
  async signUp(data: SignUpData) {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.full_name,
            role: data.role,
            phone: data.phone,
            birth_date: data.birth_date,
          }
        }
      });

      if (error) throw error;
      return { user: authData.user, error: null };
    } catch (error: any) {
      console.error('Error signing up:', error);
      return { user: null, error: error.message };
    }
  }

  async signIn(data: SignInData) {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;

      // Buscar dados do perfil
      if (authData.user) {
        const profile = await this.getProfile(authData.user.id);
        return { 
          user: authData.user, 
          profile, 
          error: null 
        };
      }

      return { user: authData.user, profile: null, error: null };
    } catch (error: any) {
      console.error('Error signing in:', error);
      return { user: null, profile: null, error: error.message };
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Limpar localStorage
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('userId');
      
      return { error: null };
    } catch (error: any) {
      console.error('Error signing out:', error);
      return { error: error.message };
    }
  }

  async getProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  async updateProfile(userId: string, updates: Partial<AuthUser>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error: any) {
      console.error('Error updating profile:', error);
      return { data: null, error: error.message };
    }
  }

  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;

      if (user) {
        const profile = await this.getProfile(user.id);
        return { user, profile, error: null };
      }

      return { user: null, profile: null, error: null };
    } catch (error: any) {
      console.error('Error getting current user:', error);
      return { user: null, profile: null, error: error.message };
    }
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();
