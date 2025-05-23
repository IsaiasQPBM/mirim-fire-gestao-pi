
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { authService, type AuthUser } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

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

  useEffect(() => {
    // Verificar usuário atual
    authService.getCurrentUser().then(({ user, profile }) => {
      setUser(user);
      setProfile(profile);
      
      // Manter compatibilidade com localStorage para transição
      if (user && profile) {
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userName', profile.full_name);
        localStorage.setItem('userRole', profile.role);
      }
      
      setLoading(false);
    });

    // Escutar mudanças de autenticação
    const { data: { subscription } } = authService.onAuthStateChange(
      async (event, session) => {
        console.log('Auth event:', event, session);
        
        if (session?.user) {
          setUser(session.user);
          const profile = await authService.getProfile(session.user.id);
          setProfile(profile);
          
          if (profile) {
            localStorage.setItem('userId', session.user.id);
            localStorage.setItem('userName', profile.full_name);
            localStorage.setItem('userRole', profile.role);
          }
        } else {
          setUser(null);
          setProfile(null);
          localStorage.removeItem('userId');
          localStorage.removeItem('userName');
          localStorage.removeItem('userRole');
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { user, profile, error } = await authService.signIn({ email, password });
      
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Erro no login',
          description: error,
        });
        return { error };
      }

      if (user && profile) {
        setUser(user);
        setProfile(profile);
        toast({
          title: 'Login realizado com sucesso',
          description: `Bem-vindo, ${profile.full_name}!`,
        });
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
        setProfile(data);
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
