
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

  const createAdminProfile = async (user: User): Promise<any> => {
    console.log('🛠️ Criando perfil do administrador...');
    
    try {
      const adminProfileData = {
        id: user.id,
        email: user.email,
        full_name: 'Administrador Sistema',
        role: 'admin',
        status: 'active'
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert(adminProfileData)
        .select()
        .single();

      if (error) {
        console.error('❌ Erro ao criar perfil do admin:', error);
        throw error;
      }

      console.log('✅ Perfil do administrador criado:', data);
      return data;
    } catch (error) {
      console.error('💥 Falha crítica ao criar perfil do admin:', error);
      throw error;
    }
  };

  const getOrCreateProfile = async (user: User): Promise<any> => {
    try {
      console.log('🔍 Buscando perfil para usuário:', user.email);
      
      // Primeira tentativa: buscar perfil existente
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('❌ Erro ao buscar perfil:', error);
        throw error;
      }

      if (profileData) {
        console.log('✅ Perfil encontrado:', profileData);
        // Verificar se o perfil tem o role correto para admin
        if (user.email === 'erisman@admin.com' && profileData.role !== 'admin') {
          console.log('🔧 Corrigindo role do admin...');
          const { data: updatedProfile, error: updateError } = await supabase
            .from('profiles')
            .update({ role: 'admin', full_name: 'Administrador Sistema' })
            .eq('id', user.id)
            .select()
            .single();
          
          if (updateError) {
            console.error('❌ Erro ao atualizar role do admin:', updateError);
            return profileData;
          }
          
          console.log('✅ Role do admin corrigido:', updatedProfile);
          return updatedProfile;
        }
        return profileData;
      }

      // Se não encontrou perfil, criar um novo
      console.log('ℹ️ Perfil não encontrado, criando novo...');
      
      if (user.email === 'erisman@admin.com') {
        return await createAdminProfile(user);
      }

      // Para outros usuários, criar perfil básico
      const basicProfileData = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || 'Usuário',
        role: user.user_metadata?.role || 'student',
        status: 'active'
      };

      const { data: newProfileData, error: createError } = await supabase
        .from('profiles')
        .insert(basicProfileData)
        .select()
        .single();

      if (createError) {
        console.error('❌ Erro ao criar perfil básico:', createError);
        throw createError;
      }

      console.log('✅ Perfil básico criado:', newProfileData);
      return newProfileData;

    } catch (error: any) {
      console.error('💥 Erro ao obter/criar perfil:', error);
      
      // Retornar perfil padrão para evitar bloqueio
      console.log('⚠️ Retornando perfil padrão para evitar bloqueio');
      return {
        id: user.id,
        email: user.email,
        full_name: user.email === 'erisman@admin.com' ? 'Administrador Sistema' : 'Usuário',
        role: user.email === 'erisman@admin.com' ? 'admin' : 'student',
        status: 'active'
      };
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
          throw error;
        }

        if (session?.user && mounted) {
          console.log('👤 Sessão encontrada para:', session.user.email);
          setUser(session.user);
          
          try {
            const profileData = await getOrCreateProfile(session.user);
            
            if (mounted && profileData) {
              const authUser = createAuthUser(session.user, profileData);
              setProfile(authUser);
              
              if (authUser) {
                localStorage.setItem('userId', session.user.id);
                localStorage.setItem('userName', authUser.full_name);
                localStorage.setItem('userRole', authUser.role);
              }
            }
          } catch (profileError) {
            console.error('💥 Erro ao carregar/criar perfil:', profileError);
            
            if (mounted) {
              const tempProfile = createAuthUser(session.user, {
                id: session.user.id,
                email: session.user.email,
                full_name: session.user.email === 'erisman@admin.com' ? 'Administrador Sistema' : 'Usuário Temporário',
                role: session.user.email === 'erisman@admin.com' ? 'admin' : 'student',
                status: 'active'
              });
              setProfile(tempProfile);
            }
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

        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          
          try {
            const profileData = await getOrCreateProfile(session.user);
            
            if (profileData) {
              const authUser = createAuthUser(session.user, profileData);
              setProfile(authUser);
              
              if (authUser) {
                localStorage.setItem('userId', session.user.id);
                localStorage.setItem('userName', authUser.full_name);
                localStorage.setItem('userRole', authUser.role);
              }
            }
          } catch (profileError) {
            console.error('💥 Erro ao carregar/criar perfil no SIGNED_IN:', profileError);
            
            const tempProfile = createAuthUser(session.user, {
              id: session.user.id,
              email: session.user.email,
              full_name: session.user.email === 'erisman@admin.com' ? 'Administrador Sistema' : 'Usuário',
              role: session.user.email === 'erisman@admin.com' ? 'admin' : 'student',
              status: 'active'
            });
            setProfile(tempProfile);
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setProfile(null);
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
  }, [toast]);

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
