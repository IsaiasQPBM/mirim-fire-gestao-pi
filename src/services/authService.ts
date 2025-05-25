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
      console.log('📝 Tentativa de cadastro:', { email: data.email, role: data.role });
      
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

      if (error) {
        console.error('❌ Erro no cadastro:', error);
        throw error;
      }
      
      console.log('✅ Cadastro realizado:', authData.user?.id);
      return { user: authData.user, error: null };
    } catch (error: any) {
      console.error('💥 Erro no signUp:', error);
      return { user: null, error: error.message };
    }
  }

  async signIn(data: SignInData) {
    try {
      console.log('🔐 Tentativa de login:', { email: data.email });
      
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        console.error('❌ Erro no login:', error);
        throw error;
      }

      console.log('✅ Login realizado:', authData.user?.id);

      // Buscar dados do perfil
      if (authData.user) {
        const profile = await this.getProfile(authData.user.id);
        console.log('👤 Perfil carregado:', profile);
        return { 
          user: authData.user, 
          profile, 
          error: null 
        };
      }

      return { user: authData.user, profile: null, error: null };
    } catch (error: any) {
      console.error('💥 Erro no signIn:', error);
      return { user: null, profile: null, error: error.message };
    }
  }

  async signOut() {
    try {
      console.log('👋 Fazendo logout...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Limpar localStorage
      localStorage.removeItem('userRole');
      localStorage.removeItem('userName');
      localStorage.removeItem('userId');
      
      console.log('✅ Logout realizado');
      return { error: null };
    } catch (error: any) {
      console.error('💥 Erro no logout:', error);
      return { error: error.message };
    }
  }

  async getProfile(userId: string) {
    try {
      console.log('🔍 Buscando perfil:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Erro ao buscar perfil:', error);
        throw error;
      }
      
      console.log('✅ Perfil encontrado:', data);
      return data;
    } catch (error: any) {
      console.error('💥 Erro no getProfile:', error);
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
      console.log('🔍 Verificando usuário atual...');
      
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('❌ Erro ao obter usuário:', error);
        throw error;
      }

      if (user) {
        console.log('✅ Usuário atual encontrado:', user.id);
        const profile = await this.getProfile(user.id);
        return { user, profile, error: null };
      }

      console.log('ℹ️ Nenhum usuário autenticado');
      return { user: null, profile: null, error: null };
    } catch (error: any) {
      console.error('💥 Erro no getCurrentUser:', error);
      return { user: null, profile: null, error: error.message };
    }
  }

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();
