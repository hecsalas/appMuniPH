"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart3, TrendingUp, TrendingDown, Users, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function EstadisticasPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const s = localStorage.getItem('miph_comercio_session');
    if (s) {
      const parsed = JSON.parse(s);
      setSession(parsed);
      fetchStats(parsed.comercio_id);
    }
  }, []);

  const fetchStats = async (comercioId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('solicitudes_canje')
        .select('*')
        .eq('comercio_id', comercioId);

      if (!error && data) {
        const aprobados = data.filter(d => d.estado === 'Aprobado').length;
        const rechazados = data.filter(d => d.estado === 'Rechazado').length;

        setStats({
          total: data.length,
          aprobados,
          rechazados,
          tasaAprobacion: data.length > 0 ? ((aprobados / data.length) * 100).toFixed(1) : 0,
          vecinosUnicos: new Set(data.map(d => d.vecino_nombre)).size
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin text-primary mx-auto" size={32} /></div>;

  return (
    <div className="p-8 space-y-10">
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Estadísticas Propias</h2>
        <p className="text-slate-500 font-medium">Analiza el impacto de tus beneficios en la comunidad</p>
      </header>

      {/* Resumen Superior */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-primary text-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-900/20 space-y-4">
           <div className="flex justify-between items-start">
              <TrendingUp size={32} className="opacity-50" />
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full text-white">Rendimiento</span>
           </div>
           <div>
              <p className="text-4xl font-black">{stats?.tasaAprobacion}%</p>
              <p className="text-xs font-bold opacity-80 uppercase mt-1">Tasa de Aprobación</p>
           </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
           <div className="flex justify-between items-start">
              <Users size={32} className="text-slate-200" />
              <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full text-slate-400">Alcance</span>
           </div>
           <div>
              <p className="text-4xl font-black text-slate-900">{stats?.vecinosUnicos}</p>
              <p className="text-xs font-bold text-slate-400 uppercase mt-1">Vecinos Distintos Atendidos</p>
           </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
           <div className="flex justify-between items-start">
              <BarChart3 size={32} className="text-slate-200" />
              <span className="text-[10px] font-black uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-full text-slate-400">Total</span>
           </div>
           <div>
              <p className="text-4xl font-black text-slate-900">{stats?.total}</p>
              <p className="text-xs font-bold text-slate-400 uppercase mt-1">Solicitudes Totales Recibidas</p>
           </div>
        </div>
      </div>

      {/* Desglose de Estados */}
      <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm">
         <h3 className="text-xl font-black text-slate-900 mb-8 px-2">Desglose de Solicitudes</h3>

         <div className="space-y-6">
            <div className="space-y-2">
               <div className="flex justify-between text-xs font-black uppercase px-2">
                  <span className="text-green-600 flex items-center gap-2"><CheckCircle2 size={14}/> Aprobadas</span>
                  <span className="text-slate-900">{stats?.aprobados}</span>
               </div>
               <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${stats?.tasaAprobacion}%` }} />
               </div>
            </div>

            <div className="space-y-2">
               <div className="flex justify-between text-xs font-black uppercase px-2">
                  <span className="text-red-500 flex items-center gap-2"><XCircle size={14}/> Rechazadas</span>
                  <span className="text-slate-900">{stats?.rechazados}</span>
               </div>
               <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500 rounded-full" style={{ width: `${100 - parseFloat(stats?.tasaAprobacion || '0')}%` }} />
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
