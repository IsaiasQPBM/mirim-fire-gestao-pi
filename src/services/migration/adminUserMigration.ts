
import { supabase } from '@/integrations/supabase/client';
import { authService } from '../authService';
import type { ExecutionResult } from './types';
import type { MigrationLogger } from './logger';

export class AdminUserMigration {
  constructor(private logger: MigrationLogger) {}

  async createAdminUser(): Promise<ExecutionResult> {
    try {
      // Verificar se o usuário admin já existe na tabela profiles
      const { data: existingProfile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'erisman@admin.com')
        .maybeSingle();

      if (profileError && profileError.code !== 'PGRST116') {
        this.logger.logOperation('Create', 'AdminUser', false, undefined, profileError.message);
        return { success: false, message: 'Erro ao verificar usuário existente: ' + profileError.message };
      }

      if (existingProfile) {
        this.logger.logOperation('Create', 'AdminUser', true, 'Admin user already exists');
        return { success: true, message: 'Usuário administrador já existe' };
      }

      // Criar usuário usando o serviço de autenticação
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

      // Se o usuário foi criado com sucesso, verificar se o perfil foi criado automaticamente
      if (authResult.user) {
        // Aguardar um momento para o trigger criar o perfil
        await new Promise(resolve => setTimeout(resolve, 1000));
        
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
}
