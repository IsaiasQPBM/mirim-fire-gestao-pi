
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

const SUPABASE_URL = "https://duaagdmldzdinayzkexz.supabase.co"
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR1YWFnZG1sZHpkaW5heXprZXh6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc5OTgzNzgsImV4cCI6MjA2MzU3NDM3OH0.xUc7faYCf8A0bqCRF1gdDSB-VpKrnT7Y7FR1JmFXZDs"

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: window.localStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
