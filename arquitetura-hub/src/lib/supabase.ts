import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const useMocks = !supabaseUrl || !supabaseAnonKey

export const supabase = useMocks
  ? null
  : createClient(supabaseUrl!, supabaseAnonKey!)
