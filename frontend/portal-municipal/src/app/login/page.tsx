"use client"
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import {Lock, Mail, Loader2, Landmark} from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
//simulacion de login
    localStorage.setItem('miph_municipal_session', 'true');
    setTimeout(() => router.push('/'), 1000);
        };

    return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-xl border border-slate-200">
        <div className="text-center mb-8">
          <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-primary mb-4">
            <Landmark size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Portal Municipal</h2>
          <p className="text-slate-500 text-sm">Ingreso exclusivo para funcionarios</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Correo Institucional</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input required type="email" placeholder="nombre@mph.cl" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input required type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>

          <button disabled={loading} type="submit" className="w-full py-4 bg-primary text-white rounded-xl font-bold hover:bg-blue-800 transition-all flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'INICIAR SESIÓN'}
          </button>
        </form>
      </div>
    </div>
        );
    }