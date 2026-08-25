"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  BarChart3,
  TrendingUp,
  Users,
  CheckCircle2,
  XCircle,
  Loader2,
  Download,
  Star,
  Calendar,
  Tag,
  Zap
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function EstadisticasPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [rawSol, setRawSol] = useState<any[]>([]);

  const fetchStats = async (comercioId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('solicitudes_canje')
        .select('*, beneficios(titulo), sucursales(nombre)')
        .eq('comercio_id', comercioId)
        .order('fecha_solicitud', { ascending: false });

      if (!error && data) {
        setRawSol(data);
        const aprobados = data.filter(d => d.estado === 'Aprobado').length;
        const rechazados = data.filter(d => d.estado === 'Rechazado').length;

        // Tasa de aprobación real (excluyendo pendientes de la base)
        const totalProcesados = aprobados + rechazados;
        const tasa = totalProcesados > 0 ? ((aprobados / totalProcesados) * 100).toFixed(1) : 0;

        // Canjes del mes actual
        const now = new Date();
        const canjesMes = data.filter(d => {
          const dt = new Date(d.fecha_solicitud);
          return dt.getMonth() === now.getMonth() && dt.getFullYear() === now.getFullYear();
        }).length;

        // Beneficio estrella
        const counts: any = {};
        data.forEach(d => {
          const t = d.beneficios?.titulo;
          if (t) counts[t] = (counts[t] || 0) + 1;
        });
        const topBeneficio = Object.entries(counts).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'N/A';

        setStats({
          total: data.length,
          aprobados,
          rechazados,
          tasaAprobacion: tasa,
          vecinosUnicos: new Set(data.map(d => d.vecino_nombre)).size,
          canjesMes,
          topBeneficio
        });
      }
    } catch (err) {
      console.error("Error cargando estadísticas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const s = localStorage.getItem('miph_comercio_session');
    if (s) {
      const parsed = JSON.parse(s);
      setSession(parsed);
      fetchStats(parsed.comercio_id);
    }
  }, []);

  const exportToExcel = () => {
    const dataToExport = rawSol.map(sol => ({
      'Vecino': sol.vecino_nombre,
      'Beneficio': sol.beneficios?.titulo,
      'Sucursal': sol.sucursales?.nombre || 'Casa Matriz',
      'Fecha Solicitud': new Date(sol.fecha_solicitud).toLocaleString(),
      'Estado': sol.estado,
      'Motivo Rechazo': sol.motivo_rechazo || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Canjes");

    const columnWidths = [
      { wch: 25 }, { wch: 30 }, { wch: 20 }, { wch: 20 }, { wch: 15 }, { wch: 30 }
    ];
    worksheet['!cols'] = columnWidths;

    XLSX.writeFile(workbook, `reporte_analitico_${session?.comercio_id}.xlsx`);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-primary" size={48} />
    </div>
  );

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Estadísticas y Reportes</h2>
          <p className="text-slate-600 font-medium mt-1">Análisis profundo del rendimiento de tus beneficios</p>
        </div>
        <button
          onClick={exportToExcel}
          className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all active:scale-95"
        >
          <Download size={18} />
          DESCARGAR REPORTE (.XLSX)
        </button>
      </header>

      {/* Grid de KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
           <div className="flex justify-between items-start">
              <div className="p-3 bg-blue-50 text-primary rounded-2xl">
                <BarChart3 size={24} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Volumen</span>
           </div>
           <div>
              <p className="text-3xl font-black text-slate-900">{stats?.total}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Solicitudes Totales</p>
           </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
           <div className="flex justify-between items-start">
              <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                <TrendingUp size={24} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Calidad</span>
           </div>
           <div>
              <p className="text-3xl font-black text-slate-900">{stats?.tasaAprobacion}%</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Tasa de Aprobación</p>
           </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
           <div className="flex justify-between items-start">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                <Calendar size={24} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Actual</span>
           </div>
           <div>
              <p className="text-3xl font-black text-slate-900">{stats?.canjesMes}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Canjes realizados este mes</p>
           </div>
        </div>

        <div className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-4">
           <div className="flex justify-between items-start">
              <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl">
                <Star size={24} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Popularidad</span>
           </div>
           <div>
              <p className="text-lg font-black text-slate-900 truncate leading-tight mt-1">{stats?.topBeneficio}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">Beneficio Estrella</p>
           </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Barras de Estados */}
        <div className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-sm flex flex-col justify-center">
           <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-2">
             <Zap size={20} className="text-primary" />
             Desglose Operativo
           </h3>

           <div className="space-y-8">
              <div className="space-y-3">
                 <div className="flex justify-between text-xs font-black uppercase px-2 text-slate-500">
                    <span className="flex items-center gap-2 text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      Canjes Exitosos
                    </span>
                    <span className="text-slate-900">{stats?.aprobados}</span>
                 </div>
                 <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <div className="h-full bg-green-500 rounded-full transition-all duration-1000" style={{ width: `${stats?.tasaAprobacion}%` }} />
                 </div>
              </div>

              <div className="space-y-3">
                 <div className="flex justify-between text-xs font-black uppercase px-2 text-slate-500">
                    <span className="flex items-center gap-2 text-red-500">
                      <div className="w-2 h-2 bg-red-500 rounded-full" />
                      Canjes Rechazados
                    </span>
                    <span className="text-slate-900">{stats?.rechazados}</span>
                 </div>
                 <div className="w-full h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                    <div className="h-full bg-red-500 rounded-full transition-all duration-1000" style={{ width: `${100 - parseFloat(stats?.tasaAprobacion || '0')}%` }} />
                 </div>
              </div>
           </div>
        </div>

        {/* Info de Alcance */}
        <div className="bg-gradient-to-br from-primary to-blue-800 p-10 rounded-[3rem] text-white flex flex-col justify-between shadow-xl shadow-blue-900/30">
          <div className="space-y-2">
            <Users size={40} className="opacity-50" />
            <h3 className="text-2xl font-black tracking-tighter uppercase">Alcance Comunal</h3>
            <p className="text-blue-100 text-sm font-medium">Has impactado la vida de vecinos únicos en Padre Hurtado</p>
          </div>

          <div className="mt-8 flex items-baseline gap-2">
            <span className="text-6xl font-black tracking-tighter">{stats?.vecinosUnicos}</span>
            <span className="text-sm font-bold text-blue-200 uppercase tracking-widest">Vecinos</span>
          </div>

          <div className="mt-10 pt-6 border-t border-white/10">
            <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest">Estado del Canal</p>
            <div className="text-sm font-bold text-green-400 flex items-center gap-2 mt-1">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              CONEXIÓN ACTIVA CON SUPABASE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
