import { createClient } from '@supabase/supabase-js'
import { Database } from '@/integrations/supabase/types'

// Configuração do Supabase
const supabaseUrl = 'https://gjzddakrdakqcxduddcw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdqemRkYWtyZGFrcWN4ZHVkZGN3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxMDI5MDEsImV4cCI6MjA2NzY3ODkwMX0.LCGWzW1JT07i05KlNX93IbuGTiCl0IGGhGjJ49tDCcs'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Tipos úteis
export type Tables = Database['public']['Tables']
export type TableNames = keyof Tables

// Helper para obter tipos de uma tabela específica
export type TableRow<T extends TableNames> = Tables[T]['Row']
export type TableInsert<T extends TableNames> = Tables[T]['Insert']
export type TableUpdate<T extends TableNames> = Tables[T]['Update'] 