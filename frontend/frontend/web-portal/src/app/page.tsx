"use client";

import React from 'react';
import Link from 'next/link';
import { Store, Landmark, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">
            Mi Padre Hurtado
          </h1>
          <p className="text-xl text-slate-500 font-medium">
            Selecciona el portal de acceso para continuar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Tarjeta Portal Municipal */}
          <Link
            href="/admin"
            className="group bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:border-primary/20 transition-all flex flex-col items-center text-center space-y-6"
          >
            <div className="p-6 bg-blue-50 text-primary rounded-[2rem] group-hover:scale-110 transition-transform">
              <Landmark size={64} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Portal Funcionario</h2>
              <p className="text-slate-500 text-sm">Gestión administrativa, comercios y reportes comunales.</p>
            </div>
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs">
              Ingresar <ArrowRight size={16} />
            </div>
          </Link>

          {/* Tarjeta Portal Socio */}
          <Link
            href="/socio"
            className="group bg-white p-10 rounded-[3rem] border border-slate-200 shadow-xl hover:shadow-2xl hover:border-indigo-500/20 transition-all flex flex-col items-center text-center space-y-6"
          >
            <div className="p-6 bg-indigo-50 text-indigo-600 rounded-[2rem] group-hover:scale-110 transition-transform">
              <Store size={64} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">Portal del Socio</h2>
              <p className="text-slate-500 text-sm">Administra tus beneficios y monitorea tus canjes en vivo.</p>
            </div>
            <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-xs">
              Ingresar <ArrowRight size={16} />
            </div>
          </Link>
        </div>

        <p className="text-center text-[10px] text-slate-400 uppercase font-black tracking-[0.2em]">
          © 2026 Municipalidad de Padre Hurtado • Dirección de Desarrollo Comunitario
        </p>
      </div>
    </div>
  );
}
