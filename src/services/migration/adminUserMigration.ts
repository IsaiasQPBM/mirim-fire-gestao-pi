
import { supabase } from '@/integrations/supabase/client';
import { authService } from '../authService';
import type { ExecutionResult } from './types';
import type { MigrationLogger } from './logger';

export class AdminUserMigration {
  constructor(private logger: MigrationLogger) {}

  async createAdminUser(): Promise<ExecutionResult> {
    try {
      // Simplified query with explicit type handling
      const { data: existingUser, error: queryError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', 'erisman@admin.com')
        .maybeSingle();

      if (queryError) {
        this.logger.logOperation('Create', 'AdminUser', false, undefined, queryError.message);
        return { success: false, message: 'Erro ao verificar usuário existente: ' + queryError.message };
      }

      if (existingUser) {
        this.logger.logOperation('Create', 'AdminUser', true, 'Admin user already exists');
        return { success: true, message: 'Usuário administrador já existe' };
      }

      const result = await authService.signUp({
        email: 'erisman@admin.com',
        password: 'admin',
        full_name: 'Administrador Sistema',
        role: 'admin',
      });

      if (result.error) {
        this.logger.logOperation('Create', 'AdminUser', false, undefined, result.error);
        return { success: false, message: 'Erro ao criar usuário administrador: ' + result.error };
      }

      this.logger.logOperation('Create', 'AdminUser', true, `Admin user created with ID: ${result.user?.id}`);
      return { success: true, message: 'Usuário administrador criado com sucesso' };
    } catch (err: any) {
      this.logger.logOperation('Create', 'AdminUser', false, undefined, err.message);
      return { success: false, message: 'Erro ao criar usuário administrador: ' + err.message };
    }
  }
}
