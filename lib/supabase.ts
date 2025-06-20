import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = "https://rtbtjinwleilrrdulpag.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ0YnRqaW53bGVpbHJyZHVscGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwOTE4OTEsImV4cCI6MjA2NTY2Nzg5MX0.Sb4EXOBpNAwUyIPLllgbCub9xu2zfVebsaG3Z0MyBe8"
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})