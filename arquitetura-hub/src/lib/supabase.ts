import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ozwymwzlmvodbmutqkfc.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ntgUjbqHEymTYIrozxUMYg_8sSNiXe-'

export const useMocks = true

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
