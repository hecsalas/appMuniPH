import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Cliente de Supabase para operaciones desde el navegador.
 * Este cliente respeta las políticas RLS (Row Level Security).
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
