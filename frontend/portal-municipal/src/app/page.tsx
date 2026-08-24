"use client";

import React, { useEffect, useState } from "react";
import StatCard from "@/components/StatCard";
import { Users, Store, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    vecinos: 0,
    comercios: 0,
    sos: 15, // Aún simulado
    canjes: 0,
  });
  const [solicitudes, setSolicitudes] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      // 1. Conteo de Comercios Activos
      const { count: countComercios } = await supabase
        .from('comercios')
        .select('*', { count: 'exact', head: true })
        .eq('estado', 'Vigente');

      // 2. Conteo de Canjes Totales
      const { count: countCanjes } = await supabase
        .from('solicitudes_canje')
        .select('*', { count: 'exact', head: true });

      // 3. Conteo de Vecinos Únicos (basado en canjes por ahora)
      const { data: canjesData } = await supabase
        .from('solicitudes_canje')
        .select('vecino_nombre');

      const vecinosUnicos = new Set(canjesData?.map(c => c.vecino_nombre)).size;

      // 4. Últimas solicitudes de comercio
      const { data: ultimosComercios } = await supabase
        .from('comercios')
        .select('nombre_fantasia, fecha_registro, estado')
        .order('fecha_registro', { ascending: false })
        .limit(4);

      setStats({
        vecinos: vecinosUnicos || 1248, // Fallback si no hay canjes aún
        comercios: countComercios || 0,
        sos: 15,
        canjes: countCanjes || 0,
      });

      setSolicitudes(ultimosComercios || []);
    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // SUSCRIPCIONES REAL-TIME
    const channelComercios = supabase
      .channel('cambios-comercios')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comercios' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    const channelCanjes = supabase
      .channel('cambios-canjes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'solicitudes_canje' }, () => {
        fetchDashboardData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channelComercios);
      supabase.removeChannel(channelCanjes);
    };
  }, []);

  const formatFecha = (fecha: string) => {
    const d = new Date(fecha);
    const ahora = new Date();
    const diff = ahora.getTime() - d.getTime();
    const horas = Math.floor(diff / (1000 * 60 * 60));

    if (horas < 1) return "Hace poco";
    if (horas < 24) return `Hace ${horas}h`;
    return d.toLocaleDateString('es-CL');
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={48} />
          <p className="text-slate-500 font-medium animate-pulse">Sincronizando datos en tiempo real...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Encabezado */}
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Panel de Control</h2>
          <p className="text-slate-500">Resumen general de la actividad comunal</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-400 uppercase">Estado del Sistema</p>
          <div className="flex items-center gap-2 text-green-600 font-bold">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
            CONECTADO
          </div>
        </div>
      </header>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Vecinos Activos"
          value={stats.vecinos.toLocaleString()}
          icon={<Users size={24} />}
          description="Usuarios que han usado la App"
        />
        <StatCard
          title="Comercios Vigentes"
          value={stats.comercios}
          icon={<Store size={24} />}
          description="Locales con convenio activo"
        />
        <StatCard
          title="Reportes SOS"
          value={stats.sos}
          icon={<AlertCircle size={24} />}
          description="Alertas ciudadanas hoy"
          color="bg-red-50/30"
        />
        <StatCard
          title="Canjes de Beneficios"
          value={stats.canjes.toLocaleString()}
          icon={<CheckCircle size={24} />}
          description="Total histórico de transacciones"
        />
      </div>

      {/* Sección Inferior */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Últimos Comercios Registrados */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 text-primary uppercase tracking-tighter">Solicitudes Recientes de Comercio</h3>
          <div className="space-y-4">
            {solicitudes.length === 0 ? (
              <p className="text-center text-slate-400 py-10 italic">No hay registros recientes</p>
            ) : (
              solicitudes.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-lg hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0">
                  <div>
                    <p className="font-bold text-slate-800">{item.nombre_fantasia}</p>
                    <p className="text-xs text-slate-400">{formatFecha(item.fecha_registro)}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    item.estado === 'Vigente' ? 'bg-green-100 text-green-700' :
                    item.estado === 'Pendiente' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {item.estado === 'Vigente' ? 'Aprobado' : item.estado}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Alertas de Seguridad (Simuladas hasta tener tabla SOS) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 opacity-50 uppercase tracking-tighter">Alertas SOS en Curso (Demo)</h3>
          <div className="space-y-4">
            {[
              { type: "Luminaria apagada", location: "Villa Los Silos", priority: "Baja" },
              { type: "Basura acumulada", location: "Av. San Ignacio", priority: "Media" },
              { type: "Microbasural", location: "Cmo. Melipilla", priority: "Alta" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start p-3 rounded-lg border border-slate-50 grayscale">
                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                  item.priority === 'Alta' ? 'bg-red-500' :
                  item.priority === 'Media' ? 'bg-orange-500' :
                  'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-bold text-slate-800 text-sm">{item.type}</p>
                    <span className="text-[10px] text-slate-400 font-medium uppercase">{item.priority}</span>
                  </div>
                  <p className="text-xs text-slate-500">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-center text-slate-400 mt-4 italic font-bold">Módulo en etapa de diseño</p>
        </div>
      </div>
    </div>
  );
}
