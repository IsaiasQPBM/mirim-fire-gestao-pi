
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

      console.log('ℹ️ Perfil não encontrado');
      return null;

    } catch (error: any) {
      console.error('💥 Erro ao obter perfil:', error);
      return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔄 Inicializando autenticação...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Erro ao obter sessão:', error);
          if (mounted) {
            setLoading(false);
          }
          return;
        }

        if (session?.user && mounted) {
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
          }
        }
      } catch (error) {
        console.error('💥 Erro na inicialização da auth:', error);
      } finally {
        if (mounted) {
          console.log('✅ Inicialização da auth concluída');
          setLoading(false);
        }
      }
    };

    // Configurar listener de mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('📡 Auth event:', event, session?.user?.email);
        
        if (!mounted) return;

        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          
          // Usar setTimeout para evitar deadlock
          setTimeout(async () => {
            if (mounted) {
              const profileData = await getProfile(session.user.id);
              
              if (profileData && mounted) {
                const authUser = createAuthUser(session.user, profileData);
                setProfile(authUser);
                
                if (authUser) {
                  localStorage.setItem('userId', session.user.id);
                  localStorage.setItem('userName', authUser.full_name);
                  localStorage.setItem('userRole', authUser.role);
                }
              }
            }
          }, 0);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
          localStorage.removeItem('userId');
          localStorage.removeItem('userName');
          localStorage.removeItem('userRole');
        }
      }
    );

    // Inicializar auth
    initializeAuth();

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
