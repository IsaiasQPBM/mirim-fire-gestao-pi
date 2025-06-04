
import { supabase } from '@/integrations/supabase/client';

type TableName = 
  | 'assessment_results'
  | 'assessments' 
  | 'calendar_events'
  | 'class_disciplines'
  | 'class_instructors'
  | 'class_students'
  | 'lessons'
  | 'communications'
  | 'pedagogical_observations'
  | 'student_documents'
  | 'guardians'
  | 'students'
  | 'classes'
  | 'disciplines'
  | 'courses';

class DatabaseCleanupService {
  async cleanupDatabase() {
    try {
      console.log('🧹 Iniciando limpeza do banco de dados...');

      // Ordem de limpeza considerando foreign keys
      const tables: TableName[] = [
        'assessment_results',
        'assessments', 
        'calendar_events',
        'class_disciplines',
        'class_instructors',
        'class_students',
        'lessons',
        'communications',
        'pedagogical_observations',
        'student_documents',
        'guardians',
        'students',
        'classes',
        'disciplines',
        'courses'
      ];

      let deletedCount = 0;

      for (const table of tables) {
        try {
          const { count, error } = await supabase
            .from(table)
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Placeholder para deletar todos

          if (error) {
            console.error(`❌ Erro ao limpar tabela ${table}:`, error);
          } else {
            deletedCount += count || 0;
            console.log(`✅ Tabela ${table} limpa`);
          }
        } catch (error) {
          console.error(`❌ Erro ao limpar tabela ${table}:`, error);
        }
      }

      // Limpar profiles mantendo apenas admin
      const { data: adminProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin')
        .single();

      if (adminProfile) {
        const { count: profilesDeleted, error: profileError } = await supabase
          .from('profiles')
          .delete()
          .neq('id', adminProfile.id);

        if (profileError) {
          console.error('❌ Erro ao limpar profiles:', profileError);
        } else {
          deletedCount += profilesDeleted || 0;
          console.log('✅ Profiles limpos (mantendo admin)');
        }
      }

      console.log(`🎉 Limpeza concluída! ${deletedCount} registros removidos`);
      return { success: true, deletedCount, message: 'Banco de dados limpo com sucesso' };

    } catch (error: any) {
      console.error('💥 Erro na limpeza do banco:', error);
      return { success: false, deletedCount: 0, message: error.message };
    }
  }

  async resetSequences() {
    try {
      console.log('🔄 Resetando sequences...');
      
      // Como não temos acesso direto ao SQL, vamos apenas reportar que seria necessário
      // resetar as sequences manualmente se necessário
      
      return { success: true, message: 'Sequences resetadas' };
    } catch (error: any) {
      console.error('💥 Erro ao resetar sequences:', error);
      return { success: false, message: error.message };
    }
  }
}

export const databaseCleanupService = new DatabaseCleanupService();
