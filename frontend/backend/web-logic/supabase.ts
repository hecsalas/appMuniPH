import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * Cliente de Supabase unificado para la lógica de negocio web.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
