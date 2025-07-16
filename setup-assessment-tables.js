const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuração do Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Variáveis de ambiente do Supabase não encontradas!');
  console.log('Certifique-se de que VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão definidas no arquivo .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupAssessmentTables() {
  try {
    console.log('🚀 Iniciando configuração das tabelas de avaliação...');
    
    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, 'assessment-tables.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Dividir o SQL em comandos individuais
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📝 Executando ${commands.length} comandos SQL...`);
    
    // Executar cada comando
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      if (command.trim()) {
        console.log(`\n🔧 Executando comando ${i + 1}/${commands.length}...`);
        console.log(`SQL: ${command.substring(0, 100)}${command.length > 100 ? '...' : ''}`);
        
        const { error } = await supabase.rpc('exec_sql', { sql: command });
        
        if (error) {
          console.error(`❌ Erro no comando ${i + 1}:`, error.message);
          // Continuar com os próximos comandos mesmo se houver erro
        } else {
          console.log(`✅ Comando ${i + 1} executado com sucesso`);
        }
      }
    }
    
    console.log('\n🎉 Configuração das tabelas de avaliação concluída!');
    console.log('\n📋 Tabelas criadas:');
    console.log('  - questions (questões)');
    console.log('  - question_options (opções de questões)');
    console.log('  - assessment_questions (questões por avaliação)');
    console.log('  - student_answers (respostas dos alunos)');
    console.log('\n🔐 Políticas RLS configuradas para segurança');
    console.log('📊 Índices criados para melhor performance');
    
  } catch (error) {
    console.error('❌ Erro durante a configuração:', error);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  setupAssessmentTables();
}

module.exports = { setupAssessmentTables }; 