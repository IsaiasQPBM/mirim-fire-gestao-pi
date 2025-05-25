
import { supabase } from '@/integrations/supabase/client';
import { authService } from '../authService';
import type { ExecutionResult } from './types';
import type { MigrationLogger } from './logger';

export class AdminUserMigration {
  constructor(private logger: MigrationLogger) {}

  async createAdminUser(): Promise<ExecutionResult> {
    try {
      // First, try to sign in with existing credentials to check if user exists
      const existingLoginResult = await authService.signIn({
        email: 'erisman@admin.com',
        password: 'admin'
      });

      if (!existingLoginResult.error && existingLoginResult.user) {
        this.logger.logOperation('Verify', 'AdminUser', true, 'Admin user already exists and can login');
        return { success: true, message: 'Usuário administrador já existe e pode fazer login' };
      }

      // Check if user exists in auth.users but cannot login
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'erisman@admin.com')
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        this.logger.logOperation('Check', 'AdminUser', false, undefined, profileError.message);
        return { success: false, message: 'Erro ao verificar usuário existente: ' + profileError.message };
      }

      if (existingProfile) {
        // User profile exists but cannot login - may need to reset password
        this.logger.logOperation('Check', 'AdminUser', true, 'Profile exists but login failed - may need password reset');
        
        // Try to update the user's password directly using admin privileges
        try {
          const { error: updateError } = await supabase.auth.admin.updateUserById(
            existingProfile.id,
            { 
              password: 'admin',
              email_confirm: true
            }
          );

          if (updateError) {
            this.logger.logOperation('Update', 'AdminUser', false, undefined, updateError.message);
          } else {
            this.logger.logOperation('Update', 'AdminUser', true, 'Password updated successfully');
            return { success: true, message: 'Senha do administrador atualizada com sucesso' };
          }
        } catch (adminError) {
          this.logger.logOperation('Update', 'AdminUser', false, undefined, 'Admin API not available in client');
        }
      }

      // Create new admin user
      const authResult = await authService.signUp({
        email: 'erisman@admin.com',
        password: 'admin',
        full_name: 'Administrador Sistema',
        role: 'admin',
      });

      if (authResult.error) {
        this.logger.logOperation('Create', 'AdminUser', false, undefined, String(authResult.error));
        return { success: false, message: 'Erro ao criar usuário administrador: ' + String(authResult.error) };
      }

      if (authResult.user) {
        // Wait for trigger to create profile
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Verify profile was created
        const { data: newProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authResult.user.id)
          .single();

        if (newProfile) {
          this.logger.logOperation('Create', 'AdminUser', true, `Admin user created with ID: ${authResult.user.id}`);
          return { success: true, message: 'Usuário administrador criado com sucesso' };
        }
      }

      this.logger.logOperation('Create', 'AdminUser', true, `Admin user created with ID: ${authResult.user?.id}`);
      return { success: true, message: 'Usuário administrador criado com sucesso' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.logOperation('Create', 'AdminUser', false, undefined, errorMessage);
      return { success: false, message: 'Erro ao criar usuário administrador: ' + errorMessage };
    }
  }

  async diagnoseAdminUser(): Promise<ExecutionResult> {
    try {
      console.log('🔍 Iniciando diagnóstico do usuário administrador...');
      
      // Test 1: Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'erisman@admin.com')
        .maybeSingle();

      console.log('📋 Perfil encontrado:', profile);
      console.log('❌ Erro no perfil:', profileError);

      if (profileError) {
        return { 
          success: false, 
          message: `Erro ao verificar perfil: ${profileError.message}` 
        };
      }

      if (!profile) {
        return { 
          success: false, 
          message: 'Perfil do administrador não encontrado na tabela profiles' 
        };
      }

      // Test 2: Try to sign in
      console.log('🔐 Testando login...');
      const loginResult = await authService.signIn({
        email: 'erisman@admin.com',
        password: 'admin'
      });

      console.log('✅ Resultado do login:', loginResult);

      if (loginResult.error) {
        return {
          success: false,
          message: `Erro no login: ${loginResult.error}. Perfil existe: ${profile.full_name} (${profile.role})`
        };
      }

      // Test 3: Check admin function
      if (loginResult.user) {
        const { data: isAdminResult, error: adminError } = await supabase
          .rpc('is_admin');

        console.log('👑 É administrador?', isAdminResult);
        console.log('❌ Erro admin check:', adminError);

        return {
          success: true,
          message: `Login bem-sucedido! Usuário: ${profile.full_name}, Role: ${profile.role}, Admin: ${isAdminResult}`
        };
      }

      return { success: false, message: 'Falha no diagnóstico' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error('💥 Erro no diagnóstico:', errorMessage);
      return { success: false, message: 'Erro no diagnóstico: ' + errorMessage };
    }
  }

  async resetAdminPassword(): Promise<ExecutionResult> {
    try {
      // Check if profile exists first
      const { data: profile } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('email', 'erisman@admin.com')
        .maybeSingle();

      if (!profile) {
        return { success: false, message: 'Perfil do administrador não encontrado' };
      }

      // Send password reset email
      const { error } = await supabase.auth.resetPasswordForEmail(
        'erisman@admin.com',
        {
          redirectTo: `${window.location.origin}/reset-password`
        }
      );

      if (error) {
        return { success: false, message: 'Erro ao enviar reset: ' + error.message };
      }

      return { 
        success: true, 
        message: 'Email de redefinição de senha enviado para erisman@admin.com' 
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      return { success: false, message: 'Erro no reset: ' + errorMessage };
    }
  }
}
