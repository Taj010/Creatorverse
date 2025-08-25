import { createClient } from '@supabase/supabase-js'

const URL = import.meta.env.VITE_SUPABASE_PROJECT_URL
const API_KEY = import.meta.env.VITE_SUPABASE_API_KEY

console.log('Environment variables:', {
  URL: URL ? 'Set' : 'Not set',
  API_KEY: API_KEY ? 'Set' : 'Not set'
});

if (!URL || !API_KEY) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(URL, API_KEY)


