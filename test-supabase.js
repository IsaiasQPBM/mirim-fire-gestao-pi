import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gjzddakrdakqcxduddcw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqemRkYWtyZGFrcWN4ZHVkZGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMDI5MDEsImV4cCI6MjA2NzY3ODkwMX0.LCGWzW1JT07i05KlNX93IbuGTiCl0IGGhGjJ49tDCcs'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testSupabaseSetup() {
  console.log('🧪 Testando configuração completa do Supabase...\n')
  
  const tests = [
    {
      name: 'Conexão básica',
      test: async () => {
        const { data, error } = await supabase.from('profiles').select('count')
        if (error) throw new Error(error.message)
        return data
      }
    },
    {
      name: 'Tabela de usuários',
      test: async () => {
        const { data, error } = await supabase.from('profiles').select('*').limit(1)
        if (error) throw new Error(error.message)
        return data
      }
    },
    {
      name: 'Tabela de cursos',
      test: async () => {
        const { data, error } = await supabase.from('courses').select('*').limit(1)
        if (error) throw new Error(error.message)
        return data
      }
    },
    {
      name: 'Tabela de turmas',
      test: async () => {
        const { data, error } = await supabase.from('classes').select('*').limit(1)
        if (error) throw new Error(error.message)
        return data
      }
    },
    {
      name: 'Tabela de alunos',
      test: async () => {
        const { data, error } = await supabase.from('students').select('*').limit(1)
        if (error) throw new Error(error.message)
        return data
      }
    },
    {
      name: 'Relacionamento turma-aluno',
      test: async () => {
        const { data, error } = await supabase.from('class_students').select('*').limit(1)
        if (error) throw new Error(error.message)
        return data
      }
    },
    {
      name: 'Sistema de comunicação',
      test: async () => {
        const { data, error } = await supabase.from('communications').select('*').limit(1)
        if (error) throw new Error(error.message)
        return data
      }
    },
    {
      name: 'Observações pedagógicas',
      test: async () => {
        const { data, error } = await supabase.from('pedagogical_observations').select('*').limit(1)
        if (error) throw new Error(error.message)
        return data
      }
    }
  ]

  let passedTests = 0
  let totalTests = tests.length

  for (const test of tests) {
    try {
      console.log(`🔍 Testando: ${test.name}...`)
      const result = await test.test()
      console.log(`✅ ${test.name}: OK`)
      passedTests++
    } catch (error) {
      console.log(`❌ ${test.name}: FALHOU - ${error.message}`)
    }
  }

  console.log(`\n📊 Resultado: ${passedTests}/${totalTests} testes passaram`)
  
  if (passedTests === totalTests) {
    console.log('🎉 Todos os testes passaram! O Supabase está configurado corretamente.')
    console.log('\n🚀 Próximos passos:')
    console.log('1. Execute: npm run dev')
    console.log('2. Acesse: http://localhost:5173')
    console.log('3. Teste as funcionalidades do sistema')
  } else {
    console.log('⚠️ Alguns testes falharam. Verifique se executou o schema.sql no Supabase.')
    console.log('\n📋 Para resolver:')
    console.log('1. Acesse: https://supabase.com/dashboard/project/gjzddakrdakqcxduddcw')
    console.log('2. Vá para SQL Editor')
    console.log('3. Execute o arquivo schema.sql')
    console.log('4. Execute este teste novamente')
  }
}

// Executar testes
testSupabaseSetup() 