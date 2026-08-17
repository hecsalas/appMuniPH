"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ShieldCheck, Calendar, Clock, Info, CheckCircle2, Store, Tag } from 'lucide-react';

export default function MisConveniosPage() {
  const [comercios, setComercios] = useState<any[]>([]);
  const [beneficios, setBeneficios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('miph_comercio_session');
    if (session) {
      const parsed = JSON.parse(session);
      fetchData(parsed.comercio_id);
    }
  }, []);

  const fetchData = async (comercioId: string) => {
    setLoading(true);
    try {
      const { data: cData } = await supabase.from('comercios').select('*').eq('id', comercioId).single();
      const { data: bData } = await supabase.from('beneficios').select('*').eq('comercio_id', comercioId);

      setComercios([cData]);
      setBeneficios(bData || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin text-primary mx-auto" size={32} /></div>;

  const main = comercios[0];

  return (
    <div className="p-8 space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Mis Convenios</h2>
          <p className="text-slate-600 font-medium">Información oficial y beneficios activos en la Municipalidad</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full font-bold text-xs border border-green-100">
           <CheckCircle2 size={16} /> CONVENIO VIGENTE
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ficha Contractual */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" />
              Datos Legales
            </h3>

            <div className="space-y-6">
               <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Razón Social</p>
                  <p className="font-bold text-slate-800">{main?.razon_social}</p>
               </div>
               <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">RUT Empresa</p>
                  <p className="font-bold text-slate-800">{main?.rut}</p>
               </div>
               <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">N° Decreto</p>
                  <p className="font-bold text-primary font-mono">{main?.decreto_numero}</p>
               </div>
               <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Vigencia</p>
                  <p className="text-sm font-bold text-slate-700 flex items-center gap-2 mt-1">
                    <Calendar size={14} /> {main?.fecha_inicio} al {main?.fecha_termino}
                  </p>
               </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 flex gap-4">
             <Info className="text-blue-500 shrink-0" />
             <p className="text-[11px] text-blue-800 leading-relaxed">
               Usted no puede editar esta información. Si detecta un error, por favor contacte a su ejecutivo municipal asignado.
             </p>
          </div>
        </div>

        {/* Beneficios */}
        <div className="lg:col-span-2 space-y-6">
           <div className="flex justify-between items-center">
              <h3 className="text-xl font-black text-slate-900">Beneficios Publicados</h3>
              <span className="text-xs font-bold text-slate-500 uppercase">{beneficios.length} Items</span>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {beneficios.map((ben) => (
                <div key={ben.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4 hover:border-primary/20 transition-all">
                   <div className="flex justify-between items-start">
                      <div className="p-3 bg-slate-50 rounded-2xl text-primary">
                         <Tag size={20} />
                      </div>
                      <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">Activo</span>
                   </div>
                   <div>
                      <h4 className="font-bold text-slate-900 text-lg leading-tight">{ben.titulo}</h4>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2">{ben.descripcion}</p>
                   </div>
                   <div className="pt-4 border-t border-slate-50 grid grid-cols-1 gap-2">
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                         <Calendar size={12} /> {ben.dias_uso}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase">
                         <Clock size={12} /> {ben.horario_uso}
                      </div>
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}

import { Loader2 } from 'lucide-react';
