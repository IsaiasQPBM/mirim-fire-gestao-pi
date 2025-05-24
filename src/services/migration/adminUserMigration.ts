
import { supabase } from '@/integrations/supabase/client';
import { authService } from '../authService';
import type { ExecutionResult } from './types';
import type { MigrationLogger } from './logger';

export class AdminUserMigration {
  constructor(private logger: MigrationLogger) {}

  async createAdminUser(): Promise<ExecutionResult> {
    try {
      // Simplify the query to avoid type inference issues
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'erisman@admin.com')
        .maybeSingle();

      if (error) {
        this.logger.logOperation('Create', 'AdminUser', false, undefined, error.message);
        return { success: false, message: 'Erro ao verificar usuário existente: ' + error.message };
      }

      if (data) {
        this.logger.logOperation('Create', 'AdminUser', true, 'Admin user already exists');
        return { success: true, message: 'Usuário administrador já existe' };
      }

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

      this.logger.logOperation('Create', 'AdminUser', true, `Admin user created with ID: ${authResult.user?.id}`);
      return { success: true, message: 'Usuário administrador criado com sucesso' };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.logger.logOperation('Create', 'AdminUser', false, undefined, errorMessage);
      return { success: false, message: 'Erro ao criar usuário administrador: ' + errorMessage };
    }
  }
}
