"use client";

import React from 'react';
import Link from 'next/link';
import { Store, Landmark, ChevronRight } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6 relative overflow-hidden">
      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 w-full h-full opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center space-y-2">
          <h2 className="text-white text-3xl font-black tracking-tighter uppercase">Iniciar Sesión</h2>
          <p className="text-slate-400 font-medium">Selecciona el tipo de cuenta para ingresar</p>
        </div>

        <div className="space-y-4">
          <Link
            href="/admin/login"
            className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all group"
          >
            <div className="p-4 bg-primary/20 text-primary rounded-2xl group-hover:scale-105 transition-transform">
              <Landmark size={32} />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold">Portal Funcionario</p>
              <p className="text-slate-400 text-xs mt-0.5">Acceso exclusivo DIDECO / Municipal</p>
            </div>
            <ChevronRight className="text-slate-600 group-hover:text-white transition-colors" />
          </Link>

          <Link
            href="/socio/login"
            className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-[2rem] hover:bg-white/10 transition-all group"
          >
            <div className="p-4 bg-indigo-500/20 text-indigo-400 rounded-2xl group-hover:scale-105 transition-transform">
              <Store size={32} />
            </div>
            <div className="flex-1">
              <p className="text-white font-bold">Portal del Socio</p>
              <p className="text-slate-400 text-xs mt-0.5">Gestión de beneficios para comercios</p>
            </div>
            <ChevronRight className="text-slate-600 group-hover:text-white transition-colors" />
          </Link>
        </div>

        <div className="pt-8 flex justify-center">
            <Link href="/" className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">
                ← Volver al inicio
            </Link>
        </div>
      </div>
    </div>
  );
}
