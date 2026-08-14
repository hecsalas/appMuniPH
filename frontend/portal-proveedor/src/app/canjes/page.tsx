"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { CheckCircle2, XCircle, Clock, User, Tag, MapPin, Loader2, AlertCircle } from 'lucide-react';

export default function MonitorCanjesPage() {
  const [solicitudes, setSolicitudes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [comercioId, setComercioId] = useState<string | null>(null);

  useEffect(() => {
    const session = localStorage.getItem('miph_comercio_session');
    if (session) {
      const parsed = JSON.parse(session);
      const id = parsed.comercio_id;
      setComercioId(id);
      fetchSolicitudes(id);

      // Seteo de Realtime dentro del useEffect para manejar limpieza correctamente
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
          (payload) => {
            console.log('Nueva solicitud recibida!', payload);
            fetchSolicitudes(id);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, []);

  const fetchSolicitudes = async (id: string) => {
    // No ponemos loading(true) aquí para evitar parpadeos en actualizaciones real-time
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

  return (
    <div className="p-8 space-y-8">
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Monitor de Canjes</h2>
        <p className="text-slate-500 font-medium">Visualiza y gestiona las solicitudes de tus clientes en tiempo real</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="animate-spin text-primary mx-auto" size={32} />
          </div>
        ) : solicitudes.length === 0 ? (
          <div className="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
             <Clock size={48} className="mx-auto text-slate-200 mb-4" />
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Esperando solicitudes entrantes...</p>
          </div>
        ) : (
          solicitudes.map((sol) => (
            <div key={sol.id} className={`bg-white p-8 rounded-[2.5rem] border shadow-sm transition-all ${sol.estado === 'Pendiente' ? 'border-primary/20 bg-blue-50/10' : 'border-slate-100'}`}>
              <div className="flex flex-col md:flex-row justify-between gap-8">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-100 rounded-2xl text-slate-600">
                      <User size={24} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Vecino Solicitante</p>
                      <h4 className="text-xl font-bold text-slate-900">{sol.vecino_nombre}</h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 text-slate-600">
                      <Tag size={18} className="text-primary" />
                      <span className="text-sm font-medium">{sol.beneficios?.titulo}</span>
                    </div>
                    <div className="flex items-center gap-3 text-slate-600">
                      <MapPin size={18} className="text-primary" />
                      <span className="text-sm font-medium">{sol.sucursales?.nombre}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center items-end gap-3 min-w-[200px]">
                  {sol.estado === 'Pendiente' ? (
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() => handleResponder(sol.id, 'Aprobado')}
                        className="flex-1 bg-green-500 text-white py-3 rounded-2xl font-black text-xs hover:bg-green-600 transition-all flex items-center justify-center gap-2 uppercase"
                      >
                        <CheckCircle2 size={16} /> Aceptar
                      </button>
                      <button
                        onClick={() => {
                          const m = window.prompt("Motivo del rechazo:");
                          if (m) handleResponder(sol.id, 'Rechazado', m);
                        }}
                        className="flex-1 bg-red-50 text-red-500 py-3 rounded-2xl font-black text-xs hover:bg-red-100 transition-all flex items-center justify-center gap-2 uppercase"
                      >
                        <XCircle size={16} /> Rechazar
                      </button>
                    </div>
                  ) : (
                    <div className={`px-6 py-3 rounded-2xl font-black text-xs uppercase flex items-center gap-2 ${
                      sol.estado === 'Aprobado' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {sol.estado === 'Aprobado' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                      {sol.estado}
                    </div>
                  )}
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                    {new Date(sol.fecha_solicitud).toLocaleString()}
                  </p>
                </div>
              </div>

              {sol.motivo_rechazo && (
                <div className="mt-6 p-4 bg-red-50/50 rounded-xl border border-red-100 flex items-center gap-3 text-red-600 text-xs italic">
                  <AlertCircle size={16} /> Motivo rechazo: {sol.motivo_rechazo}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
