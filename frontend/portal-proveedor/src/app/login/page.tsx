"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Lock, Mail, Loader2, Store } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Consulta a la tabla de administradores para validar email y clave temporal
      const { data, error: queryError } = await supabase
        .from('administradores_comercios')
        .select('*, comercios(*)')
        .eq('email', email)
        .eq('password_temporal', password)
        .single();

      if (queryError || !data) {
        throw new Error('Credenciales inválidas o cuenta no activa.');
      }

      // Guardamos la sesión en el navegador (simulado para este flujo)
      localStorage.setItem('miph_comercio_session', JSON.stringify(data));

      router.push('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100">
        <div className="text-center space-y-2">
          <div className="bg-primary/10 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto text-primary mb-4">
            <Store size={40} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Portal Socio</h2>
          <p className="text-slate-500 text-sm font-medium">Inicia sesión para gestionar tus beneficios municipales</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-xs font-bold border border-red-100">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="correo@comercio.cl"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña temporal"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-white rounded-2xl font-black shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Entrar al Portal'}
          </button>
        </form>

        <p className="text-center text-[10px] text-slate-400 uppercase font-black tracking-tighter">
          Si no tienes tus credenciales, contacta a DIDECO de la Municipalidad de Padre Hurtado
        </p>
      </div>
    </div>
  );
}
