
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { authService, type AuthUser } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: User | null;
  profile: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (data: any) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<{ error: string | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const createAuthUser = (user: User, profileData: any): AuthUser | null => {
    if (!profileData) return null;
    
    return {
      id: user.id,
      email: user.email || '',
      full_name: profileData.full_name,
      role: profileData.role,
      status: profileData.status
    };
  };

  const getProfile = async (userId: string): Promise<any> => {
    try {
      console.log('🔍 Buscando perfil para usuário:', userId);
      
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('❌ Erro ao buscar perfil:', error);
        return null;
      }

      if (profileData) {
        console.log('✅ Perfil encontrado:', profileData);
        return profileData;
      }

      // Se não encontrou perfil, criar um básico
      console.log('ℹ️ Perfil não encontrado, criando básico...');
      
      const basicProfileData = {
        id: userId,
        email: user?.email || '',
        full_name: user?.email === 'admin@admin.com' ? 'Administrador Sistema' : 'Usuário',
        role: user?.email === 'admin@admin.com' ? 'admin' : 'student',
        status: 'active'
      };

      const { data: newProfileData, error: createError } = await supabase
        .from('profiles')
        .insert(basicProfileData)
        .select()
        .single();

      if (createError) {
        console.error('❌ Erro ao criar perfil básico:', createError);
        return basicProfileData; // Retorna perfil padrão mesmo se falhar a criação
      }

      console.log('✅ Perfil básico criado:', newProfileData);
      return newProfileData;

    } catch (error: any) {
      console.error('💥 Erro ao obter perfil:', error);
      
      // Retornar perfil padrão para evitar bloqueio
      return {
        id: userId,
        email: user?.email || '',
        full_name: user?.email === 'admin@admin.com' ? 'Administrador Sistema' : 'Usuário',
        role: user?.email === 'admin@admin.com' ? 'admin' : 'student',
        status: 'active'
      };
    }
  };

  useEffect(() => {
    let mounted = true;
    let profileLoaded = false;

    const initializeAuth = async () => {
      try {
        console.log('🔄 Inicializando autenticação...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erro ao obter sessão:', error);
          throw error;
        }

        if (session?.user && mounted && !profileLoaded) {
          console.log('👤 Sessão encontrada para:', session.user.email);
          setUser(session.user);
          
          const profileData = await getProfile(session.user.id);
          
          if (mounted && profileData) {
            const authUser = createAuthUser(session.user, profileData);
            setProfile(authUser);
            
            if (authUser) {
              localStorage.setItem('userId', session.user.id);
              localStorage.setItem('userName', authUser.full_name);
              localStorage.setItem('userRole', authUser.role);
            }
            profileLoaded = true;
          }
        }
      } catch (error) {
        console.error('💥 Erro na inicialização da auth:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('📡 Auth event:', event, session?.user?.email);
        
        if (!mounted) return;

        if (event === 'SIGNED_IN' && session?.user && !profileLoaded) {
          setUser(session.user);
          
          const profileData = await getProfile(session.user.id);
          
          if (profileData) {
            const authUser = createAuthUser(session.user, profileData);
            setProfile(authUser);
            
            if (authUser) {
              localStorage.setItem('userId', session.user.id);
              localStorage.setItem('userName', authUser.full_name);
              localStorage.setItem('userRole', authUser.role);
            }
            profileLoaded = true;
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          profileLoaded = false;
          localStorage.removeItem('userId');
          localStorage.removeItem('userName');
          localStorage.removeItem('userRole');
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { user, profile: profileData, error } = await authService.signIn({ email, password });
      
      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'Erro desconhecido no login';
      return { error: errorMessage };
    }
  };

  const signUp = async (data: any) => {
    try {
      const { user, error } = await authService.signUp(data);
      
      if (error) {
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'Erro desconhecido no cadastro';
      return { error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setProfile(null);
    } catch (error: any) {
      console.error('Erro no logout:', error);
      throw error;
    }
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    try {
      if (!user) return { error: 'Usuário não autenticado' };

      const { data, error } = await authService.updateProfile(user.id, updates);
      
      if (error) {
        return { error };
      }

      if (data) {
        const authUser = createAuthUser(user, data);
        setProfile(authUser);
      }

      return { error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'Erro desconhecido ao atualizar perfil';
      return { error: errorMessage };
    }
  };

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
