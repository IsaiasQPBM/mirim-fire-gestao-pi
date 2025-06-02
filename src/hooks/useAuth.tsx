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

  // Helper function to create AuthUser from user and profile data
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

  // Function to create admin profile if missing
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

  // Optimized function to get or create profile with shorter timeout
  const getOrCreateProfile = async (user: User): Promise<any> => {
    const maxAttempts = 2;
    const timeoutMs = 3000; // Reduced to 3 seconds
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`🔍 Tentativa ${attempt}/${maxAttempts} - Buscando perfil para:`, user.email);
      
      try {
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout na busca do perfil')), timeoutMs);
        });

        // Race between profile fetch and timeout
        const profilePromise = supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        const { data: profileData, error } = await Promise.race([
          profilePromise,
          timeoutPromise
        ]) as any;

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
          console.error(`❌ Erro na tentativa ${attempt}:`, error);
          if (attempt === maxAttempts) {
            throw error;
          }
          continue;
        }

        if (profileData) {
          console.log(`✅ Perfil encontrado na tentativa ${attempt}:`, profileData);
          return profileData;
        }

        // Profile not found - check if admin user needs profile creation
        if (user.email === 'erisman@admin.com') {
          console.log('👑 Usuário admin sem perfil detectado - criando perfil...');
          const newProfile = await createAdminProfile(user);
          return newProfile;
        }

        // For non-admin users, create a basic profile
        console.log(`ℹ️ Criando perfil básico para usuário:`, user.email);
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
        console.error(`💥 Erro na tentativa ${attempt}:`, error);
        
        if (attempt === maxAttempts) {
          // Return a default profile to prevent blocking
          console.log('⚠️ Retornando perfil padrão para evitar bloqueio');
          return {
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || 'Usuário',
            role: user.user_metadata?.role || 'student',
            status: 'active'
          };
        }
        
        // Wait before next attempt (reduced wait time)
        await new Promise(resolve => setTimeout(resolve, 500 * attempt));
      }
    }

    throw new Error('Falha ao obter ou criar perfil após todas as tentativas');
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('🔄 Inicializando autenticação...');
        
        // Get current session with timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout ao obter sessão')), 5000);
        });

        const { data: { session }, error } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
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
              toast({
                variant: 'destructive',
                title: 'Erro ao carregar perfil',
                description: 'Usando perfil temporário. Algumas funcionalidades podem estar limitadas.',
                duration: 5000,
              });
              
              // Set a temporary profile to avoid blocking the app
              const tempProfile = createAuthUser(session.user, {
                id: session.user.id,
                email: session.user.email,
                full_name: 'Usuário Temporário',
                role: 'student',
                status: 'active'
              });
              setProfile(tempProfile);
            }
          }
        }
      } catch (error) {
        console.error('💥 Erro na inicialização da auth:', error);
        
        if (mounted) {
          toast({
            variant: 'destructive',
            title: 'Erro de autenticação',
            description: 'Erro ao verificar autenticação. Tente recarregar a página.',
            duration: 5000,
          });
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Initialize auth
    initializeAuth();

    // Set up auth state listener
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
                
                toast({
                  title: 'Login realizado com sucesso',
                  description: `Bem-vindo, ${authUser.full_name}!`,
                });
              }
            }
          } catch (profileError) {
            console.error('💥 Erro ao carregar/criar perfil no SIGNED_IN:', profileError);
            
            // Set temporary profile instead of failing
            const tempProfile = createAuthUser(session.user, {
              id: session.user.id,
              email: session.user.email,
              full_name: 'Usuário',
              role: 'student',
              status: 'active'
            });
            setProfile(tempProfile);
            
            toast({
              title: 'Login realizado',
              description: 'Bem-vindo! Usando perfil temporário.',
            });
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
        toast({
          variant: 'destructive',
          title: 'Erro no login',
          description: error,
        });
        return { error };
      }

      return { error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'Erro desconhecido no login';
      toast({
        variant: 'destructive',
        title: 'Erro no login',
        description: errorMessage,
      });
      return { error: errorMessage };
    }
  };

  const signUp = async (data: any) => {
    try {
      const { user, error } = await authService.signUp(data);
      
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erro no cadastro',
          description: error,
        });
        return { error };
      }

      toast({
        title: 'Cadastro realizado com sucesso',
        description: 'Verifique seu email para confirmar a conta.',
      });

      return { error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'Erro desconhecido no cadastro';
      toast({
        variant: 'destructive',
        title: 'Erro no cadastro',
        description: errorMessage,
      });
      return { error: errorMessage };
    }
  };

  const signOut = async () => {
    try {
      await authService.signOut();
      setUser(null);
      setProfile(null);
      toast({
        title: 'Logout realizado com sucesso',
        description: 'Até breve!',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro no logout',
        description: error.message,
      });
    }
  };

  const updateProfile = async (updates: Partial<AuthUser>) => {
    try {
      if (!user) return { error: 'Usuário não autenticado' };

      const { data, error } = await authService.updateProfile(user.id, updates);
      
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erro ao atualizar perfil',
          description: error,
        });
        return { error };
      }

      if (data) {
        const authUser = createAuthUser(user, data);
        setProfile(authUser);
        toast({
          title: 'Perfil atualizado com sucesso',
        });
      }

      return { error: null };
    } catch (error: any) {
      const errorMessage = error.message || 'Erro desconhecido ao atualizar perfil';
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar perfil',
        description: errorMessage,
      });
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
