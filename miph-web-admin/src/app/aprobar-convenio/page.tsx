"use client";

import React, { useEffect, useState } from 'react';
import { Search, CheckCircle2, Clock, ArrowRight, Loader2, Store } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AprobarConvenioPage() {
  const router = useRouter();
  const [pendientes, setPendientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPendientes = async () => {
    setLoading(true);
    try {
      // Buscamos comercios en estado 'Pendiente' o 'Vencido' para re-aprobar si fuera necesario,
      // pero el flujo pide principalmente los Pendientes de registro.
      const { data, error } = await supabase
        .from('comercios')
        .select('*')
        .eq('estado', 'Pendiente')
        .order('fecha_registro', { ascending: false });

      if (error) throw error;
      setPendientes(data || []);
    } catch (error) {
      console.error('Error fetching pending:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendientes();
  }, []);

  const handleContinuarRevision = (comercio: any) => {
    // Guardamos el comercio en el borrador temporal para que la página de revisión lo tome
    localStorage.setItem('miph_nuevo_comercio_borrador', JSON.stringify({
      id: comercio.id,
      nombre: comercio.nombre_fantasia,
      razonSocial: comercio.razon_social,
      rut: comercio.rut,
      giro: comercio.giro,
      direccion: comercio.direccion_matriz,
      comuna: comercio.comuna,
      representante: comercio.representante_legal,
      rutRepresentante: comercio.rut_representante_legal,
      email: comercio.email,
      telefono: comercio.telefono,
      decreto: comercio.decreto_numero,
      fechaInicio: comercio.fecha_inicio,
      fechaTermino: comercio.fecha_termino,
      categoria: comercio.categoria,
      archivoUrl: comercio.archivo_url
    }));

    router.push('/comercios/nuevo/revision');
  };

  return (
    <div className="p-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Aprobar Convenio</h2>
          <p className="text-slate-500 text-sm">Listado de comercios en espera de revisión administrativa y legal</p>
        </div>
        <div className="bg-amber-50 px-4 py-2 rounded-xl border border-amber-100 text-center">
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">En Espera</p>
          <p className="text-xl font-bold text-amber-700">{pendientes.length}</p>
        </div>
      </div>

      <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o RUT..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center">
            <Loader2 className="animate-spin text-primary mx-auto" size={32} />
          </div>
        ) : pendientes.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
             <Store size={48} className="mx-auto text-slate-200 mb-4" />
             <p className="text-slate-400 font-medium">No hay convenios pendientes de aprobación.</p>
          </div>
        ) : (
          pendientes.map((comercio) => (
            <div key={comercio.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                  <Clock size={24} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  {new Date(comercio.fecha_registro).toLocaleDateString()}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-lg group-hover:text-primary transition-colors">
                  {comercio.nombre_fantasia}
                </h3>
                <p className="text-xs text-slate-400 font-medium italic">{comercio.razon_social}</p>
                <p className="text-[10px] text-primary font-black uppercase tracking-tighter pt-1">RUT: {comercio.rut}</p>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Giro</p>
                  <p className="text-xs font-bold text-slate-600">{comercio.giro || 'No especificado'}</p>
                </div>
                <button
                  onClick={() => handleContinuarRevision(comercio)}
                  className="bg-primary text-white p-2 rounded-xl shadow-lg shadow-blue-900/10 hover:bg-blue-800 transition-all"
                >
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
