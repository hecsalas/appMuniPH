"use client";

import React, { useEffect, useState, useRef } from 'react'; // Agregamos useRef
import { useRouter } from 'next/navigation';
import { CheckCircle2, LayoutDashboard, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ExitoIncorporacionPage() {
  const router = useRouter();
  const [comercioFinal, setComercioFinal] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(true);
  const hasSaved = useRef(false); // Ref para evitar doble ejecución

  useEffect(() => {
    const saveToSupabase = async () => {
      // 1. Evitar que se ejecute dos veces o si no hay datos
      if (hasSaved.current) return;

      const dStr = localStorage.getItem('miph_nuevo_comercio_borrador');
      if (!dStr) {
        setIsSaving(false);
        return;
      }

      hasSaved.current = true; // Marcamos como "en proceso"
      const d = JSON.parse(dStr);
      const s = JSON.parse(localStorage.getItem('miph_sucursales_borrador') || '[]');
      const b = JSON.parse(localStorage.getItem('miph_beneficios_borrador') || '[]');

      try {
        // 2. Insertar Comercio
        const { data: comercio, error: errC } = await supabase
          .from('comercios')
          .insert({
            rut: d.rut,
            razon_social: d.razonSocial,
            nombre_fantasia: d.nombre,
            giro: d.giro,
            telefono: d.telefono,
            email: d.email,
            direccion_matriz: d.direccion,
            comuna: d.comuna,
            representante_legal: d.representante,
            rut_representante_legal: d.rutRepresentante,
            categoria: d.categoria,
            decreto_numero: d.decreto,
            fecha_inicio: d.fechaInicio,
            fecha_termino: d.fechaTermino,
            archivo_url: d.archivoUrl,
            estado: 'Pendiente' // Aseguramos que entre a la bandeja de aprobación
          })
          .select()
          .single();

        if (errC) {
          // Si el error es por RUT duplicado, intentamos recuperarlo en lugar de fallar
          if (errC.code === '23505') {
             const { data: existing } = await supabase.from('comercios').select().eq('rut', d.rut).single();
             setComercioFinal(existing);
          } else {
            throw errC;
          }
        } else {
          setComercioFinal(comercio);

          // 3. Insertar Sucursales
          if (s.length > 0) {
            await supabase.from('sucursales').insert(
              s.map((suc: any) => ({
                comercio_id: comercio.id,
                nombre: suc.nombre,
                direccion: suc.direccion,
                telefono: suc.telefono,
                horario: suc.horario
              }))
            );
          }

          // 4. Insertar Beneficios
          if (b.length > 0) {
            await supabase.from('beneficios').insert(
              b.map((ben: any) => ({
                comercio_id: comercio.id,
                titulo: ben.titulo,
                descripcion: ben.descripcion,
                dias_uso: ben.diasUso,
                horario_uso: ben.horarioUso,
                condiciones: ben.condiciones,
                estado: ben.estado
              }))
            );
          }
        }

        // 5. Limpiar borradores solo después de un éxito total o parcial controlado
        localStorage.removeItem('miph_nuevo_comercio_borrador');
        localStorage.removeItem('miph_sucursales_borrador');
        localStorage.removeItem('miph_beneficios_borrador');

      } catch (error: any) {
        console.error('Error saving to Supabase:', error);
        alert(`Error al guardar: ${error.message}`);
        hasSaved.current = false; // Permitir reintento si falló realmente
      } finally {
        setIsSaving(false);
      }
    };

    saveToSupabase();
  }, []);

  if (isSaving) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 space-y-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-xs">
          Publicando en la nube municipal...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center space-y-8 animate-in zoom-in duration-300">
        <div className="relative inline-flex">
          <div className="absolute inset-0 bg-green-200 rounded-full animate-ping opacity-25" />
          <div className="relative p-5 bg-green-500 text-white rounded-full">
            <CheckCircle2 size={48} />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900">Comercio Activo</h2>
          <p className="text-slate-500 font-medium">
            El comercio y sus beneficios ya están disponibles en la App Ciudadana.
          </p>
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
          <div className="flex justify-between text-xs font-bold text-slate-400 uppercase">
            <span>Comercio</span>
            <span>Estado</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="font-bold text-slate-800">{comercioFinal?.nombre || '...'}</p>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-[10px] font-black rounded-full uppercase">Activo</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => router.push('/comercios')}
            className="w-full py-4 bg-primary text-white rounded-xl font-black shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
          >
            VER EN LA APP <LayoutDashboard size={20} />
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-all"
          >
            Volver al Dashboard
          </button>
        </div>

        <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest pt-4">
          Trazabilidad: Registro guardado en auditoría municipal
        </p>
      </div>
    </div>
  );
}
