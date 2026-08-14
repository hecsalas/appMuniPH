"use client";

import React, { useEffect, useState } from 'react';
import { Store, Users, CheckCircle2, XCircle, ArrowUpRight, Zap } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null);
  const [stats, setStats] = useState({
    total: 0,
    aprobados: 0,
    rechazados: 0,
    vecinos: 0
  });

  useEffect(() => {
    const s = localStorage.getItem('miph_comercio_session');
    if (s) {
      const parsed = JSON.parse(s);
      setSession(parsed);
      fetchStats(parsed.comercio_id);
    }
  }, []);

  const fetchStats = async (comercioId: string) => {
    try {
      const { data, error } = await supabase
        .from('solicitudes_canje')
        .select('*')
        .eq('comercio_id', comercioId);

      if (!error && data) {
        setStats({
          total: data.length,
          aprobados: data.filter(d => d.estado === 'Aprobado').length,
          rechazados: data.filter(d => d.estado === 'Rechazado').length,
          vecinos: new Set(data.map(d => d.vecino_nombre)).size
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-8 space-y-10">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">¡Hola, {session?.nombre}!</h2>
          <p className="text-slate-500 font-medium">Panel de control para {session?.comercios?.nombre_fantasia}</p>
        </div>
        <div className="bg-primary text-white px-6 py-3 rounded-2xl font-black text-sm shadow-xl shadow-blue-900/20 flex items-center gap-2">
           ESTADO: ACTIVO <Zap size={16} fill="currentColor" />
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<MonitorPlay size={20}/>} label="Solicitudes" value={stats.total} color="blue" />
        <StatCard icon={<CheckCircle2 size={20}/>} label="Aprobadas" value={stats.aprobados} color="green" />
        <StatCard icon={<XCircle size={20}/>} label="Rechazadas" value={stats.rechazados} color="red" />
        <StatCard icon={<Users size={20}/>} label="Vecinos Atendidos" value={stats.vecinos} color="purple" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
           <h3 className="text-xl font-black text-slate-900">Actividad Reciente</h3>
           <div className="py-20 text-center">
              <p className="text-slate-400 italic">No hay canjes registrados en las últimas 24 horas.</p>
           </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-primary/40 transition-all duration-500" />
           <div className="relative z-10 space-y-6">
              <h3 className="text-xl font-black">Mis Convenios</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Recuerda que los términos legales de tus beneficios son administrados por la Municipalidad de Padre Hurtado.
              </p>
              <button className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-xs hover:gap-3 transition-all">
                Ver Detalles <ArrowUpRight size={16} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color }: any) {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600'
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-black text-slate-900">{value}</p>
      </div>
    </div>
  );
}

import { MonitorPlay } from 'lucide-react';
