"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Tag,
  MapPin,
  Loader2,
  AlertCircle,
  Zap,
  History,
  Ticket,
  TrendingUp,
  Star
} from 'lucide-react';
import * as XLSX from 'xlsx';

export default function MonitorCanjesPage() {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [comercioId, setComercioId] = useState<string | null>(null);

  const fetchSolicitudes = async (id: string) => {
    const { data, error } = await supabase
      .from('solicitudes_canje')
      .select(`
        *,
        beneficios(titulo),
        sucursales(nombre)
      `)
      .eq('comercio_id', id)
      .order('fecha_solicitud', { ascending: false });

    if (!error) setSolicitudes(data || []);
    setLoading(false);
  };

  useEffect(() => {
    const session = localStorage.getItem('miph_comercio_session');
    if (session) {
      const parsed = JSON.parse(session);
      const id = parsed.comercio_id;
      setComercioId(id);
      fetchSolicitudes(id);

      const channel = supabase
        .channel(`monitor-canjes-${id}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'solicitudes_canje',
            filter: `comercio_id=eq.${id}`
          },
          () => {
            fetchSolicitudes(id);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const handleResponder = async (id: string, estado: 'Aprobado' | 'Rechazado', motivo?: string) => {
    const { error } = await supabase
      .from('solicitudes_canje')
      .update({
        estado: estado,
        motivo_rechazo: motivo,
        fecha_respuesta: new Date().toISOString()
      })
      .eq('id', id);

    if (!error) {
      fetchSolicitudes(comercioId!);
    }
  };

  const pendientes = solicitudes.filter(s => s.estado === 'Pendiente');
  const procesados = solicitudes.filter(s => s.estado !== 'Pendiente');

  // Estadísticas Avanzadas
  const aprobadosCount = solicitudes.filter(s => s.estado === 'Aprobado').length;
  const rechazadosCount = solicitudes.filter(s => s.estado === 'Rechazado').length;
  const tasaAprobacion = solicitudes.length > 0
    ? Math.round((aprobadosCount / (aprobadosCount + rechazadosCount)) * 100)
    : 0;

  const now = new Date();
  const canjesMes = solicitudes.filter(s => {
    const d = new Date(s.fecha_solicitud);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  // Encontrar beneficio estrella
  const counts: any = {};
  solicitudes.forEach(s => {
    const t = s.beneficios?.titulo;
    if (t) counts[t] = (counts[t] || 0) + 1;
  });
  const topBeneficio = Object.entries(counts).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || '---';

  const procesadosVista = procesados.slice(0, 10);

  return (
    <div className="p-8 space-y-10 bg-slate-50/50 min-h-screen">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Monitor de Canjes
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">
              <div className="w-1.5 h-1.5 bg-green-600 rounded-full" />
              En Vivo
            </div>
          </h2>
          <p className="text-slate-500 font-medium mt-1">Gestiona las solicitudes de tus clientes en tiempo real</p>
        </div>

        <div className="flex gap-3">
          <div className="bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
             <div className="p-2 bg-blue-50 text-primary rounded-xl">
                <Ticket size={18} />
             </div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase leading-none">Pendientes</p>
                <p className="text-lg font-bold text-slate-900 leading-none mt-1">{pendientes.length}</p>
             </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* COLUMNA PENDIENTES (2/3 de la pantalla) */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Zap size={16} className="text-amber-500" />
            Solicitudes por Procesar
          </h3>

          {loading ? (
            <div className="py-20 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
              <Loader2 className="animate-spin text-primary mx-auto" size={32} />
              <p className="text-slate-400 text-sm mt-4 font-medium">Sincronizando con la nube...</p>
            </div>
          ) : pendientes.length === 0 ? (
            <div className="py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <Clock size={40} className="text-slate-300" />
               </div>
               <p className="text-slate-500 font-bold text-lg">No hay solicitudes pendientes</p>
               <p className="text-slate-400 text-sm">Las nuevas peticiones aparecerán aquí automáticamente</p>
            </div>
          ) : (
            <div className="space-y-6">
              {pendientes.map((sol) => (
                <div key={sol.id} className="relative group animate-in slide-in-from-right duration-500">
                  {/* DISEÑO TICKET */}
                  <div className="bg-white rounded-[2.5rem] border-2 border-blue-100 shadow-xl shadow-blue-900/5 overflow-hidden flex flex-col md:flex-row">

                    {/* LADO IZQUIERDO: INFORMACIÓN DEL VECINO */}
                    <div className="p-8 flex-1 space-y-6 border-r-2 border-dashed border-slate-100 relative">
                      {/* Muescas de ticket (arriba y abajo) */}
                      <div className="absolute -top-3 -right-3 w-6 h-6 bg-slate-50 rounded-full border-2 border-blue-100 shadow-inner" />
                      <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-slate-50 rounded-full border-2 border-blue-100 shadow-inner" />

                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-700 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-900/20">
                          <User size={28} />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Vecino Solicitante</p>
                          <h4 className="text-2xl font-black text-slate-900 tracking-tight">{sol.vecino_nombre}</h4>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-3xl">
                        <div className="space-y-1">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                            <Tag size={10} /> Beneficio
                          </p>
                          <p className="text-sm font-bold text-slate-700 leading-tight">{sol.beneficios?.titulo}</p>
                        </div>
                        <div className="space-y-1 border-l border-slate-200 pl-4 md:pl-6">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter flex items-center gap-1">
                            <MapPin size={10} /> Sucursal
                          </p>
                          <p className="text-sm font-bold text-slate-700 leading-tight">{sol.sucursales?.nombre || 'Casa Matriz'}</p>
                        </div>
                      </div>
                    </div>

                    {/* LADO DERECHO: ACCIONES */}
                    <div className="bg-blue-50/30 p-8 flex flex-col justify-center items-center gap-4 min-w-[240px]">
                      <button
                        onClick={() => handleResponder(sol.id, 'Aprobado')}
                        className="w-full bg-green-600 text-white py-4 rounded-[1.5rem] font-black text-sm hover:bg-green-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-900/20 uppercase tracking-widest"
                      >
                        <CheckCircle2 size={20} /> Aprobar Canje
                      </button>
                      <button
                        onClick={() => {
                          const m = window.prompt("Motivo del rechazo:");
                          if (m) handleResponder(sol.id, 'Rechazado', m);
                        }}
                        className="w-full bg-white text-red-500 py-3 rounded-[1.2rem] font-bold text-xs hover:bg-red-50 transition-all flex items-center justify-center gap-2 border border-red-100 uppercase"
                      >
                        <XCircle size={16} /> Rechazar
                      </button>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-2 flex items-center gap-1">
                        <Clock size={10} /> Solicitado: {new Date(sol.fecha_solicitud).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* COLUMNA LATERAL: ESTADÍSTICAS Y HISTORIAL */}
        <div className="space-y-6">

          {/* Tarjetas de Estadísticas Rápidas */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-primary rounded-2xl">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total del Mes</p>
                <p className="text-xl font-bold text-slate-900">{canjesMes}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-2xl">
                <TrendingUp size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tasa Aprobación</p>
                <p className="text-xl font-bold text-slate-900">{tasaAprobacion}%</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-[2rem] border border-slate-200 shadow-sm flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl">
                <Star size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Beneficio Estrella</p>
                <p className="text-xs font-bold text-slate-900 line-clamp-1">{topBeneficio}</p>
              </div>
            </div>
          </div>

          <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2 pt-4">
            <History size={16} />
            Últimos Movimientos
          </h3>

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="divide-y divide-slate-50">
              {procesadosVista.length === 0 ? (
                <div className="p-10 text-center text-slate-400 italic text-xs font-medium">No hay actividad reciente</div>
              ) : (
                procesadosVista.map((sol) => (
                  <div key={sol.id} className="p-5 hover:bg-slate-50/80 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${sol.estado === 'Aprobado' ? 'bg-green-500' : 'bg-red-500'}`} />
                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight line-clamp-1">{sol.vecino_nombre}</span>
                      </div>
                      <span className="text-[8px] font-black text-slate-300 uppercase">{new Date(sol.fecha_solicitud).toLocaleDateString()}</span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-500 truncate mb-2">{sol.beneficios?.titulo}</p>

                    {sol.estado === 'Rechazado' && sol.motivo_rechazo && (
                      <div className="mt-2 py-2 px-3 bg-red-50 rounded-lg flex items-center gap-2">
                        <AlertCircle size={10} className="text-red-400 shrink-0" />
                        <p className="text-[9px] text-red-600 italic line-clamp-1">Rechazo: {sol.motivo_rechazo}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
