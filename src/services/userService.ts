
import { supabase } from '@/integrations/supabase/client';

export interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
  role: 'admin' | 'instructor' | 'student';
  phone?: string;
  birthDate?: string;
}

class UserService {
  async createUser(userData: CreateUserData) {
    try {
      console.log('🚀 Creating user via edge function:', userData.email);
      
      const { data, error } = await supabase.functions.invoke('create-user', {
        body: userData
      });

      if (error) {
        console.error('❌ Edge function error:', error);
        return { data: null, error: error.message };
      }

      console.log('✅ User created successfully:', data);
      return { data, error: null };
    } catch (error: any) {
      console.error('💥 Error calling create-user function:', error);
      return { data: null, error: error.message || 'Erro inesperado' };
    }
  }

  async createAdminUser() {
    try {
      console.log('🔧 Creating admin user via edge function');
      
      const { data, error } = await supabase.functions.invoke('create-admin');

      if (error) {
        console.error('❌ Create admin error:', error);
        return { data: null, error: error.message };
      }

      console.log('✅ Admin user processed:', data);
      return { data, error: null };
    } catch (error: any) {
      console.error('💥 Error calling create-admin function:', error);
      return { data: null, error: error.message || 'Erro inesperado' };
    }
  }
}

export const userService = new UserService();
