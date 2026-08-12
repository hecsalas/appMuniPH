"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, XCircle, FileSearch, Info, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function RevisionPage() {
  const router = useRouter();
  const [datos, setDatos] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Leemos el borrador guardado en los pasos anteriores
    const borrador = localStorage.getItem('miph_nuevo_comercio_borrador');
    if (borrador) setDatos(JSON.parse(borrador));
  }, []);

  const handleDecision = async (aprobado: boolean) => {
    setIsProcessing(true);
    try {
      if (aprobado) {
        // 1. Si el comercio ya existe (viniendo de Aprobar Convenio), actualizamos estado
        if (datos.id && datos.id !== 'Nuevo') {
          const { error } = await supabase
            .from('comercios')
            .update({ estado: 'Vigente' })
            .eq('id', datos.id);
          if (error) throw error;
        }

        // 2. Crear administrador (LocalStorage para prototipado rápido + Supabase si existe tabla)
        const adminsActuales = JSON.parse(localStorage.getItem('miph_administradores_db') || '[]');

        const nuevoAdmin = {
          id: Date.now(),
          rut: datos.rutRepresentante,
          nombre: datos.representante,
          email: datos.email,
          comercioId: datos.id || 'Nuevo',
          comercioNombre: datos.nombre,
          estado: 'Pendiente primer acceso',
          fechaCreacion: new Date().toISOString()
        };

        localStorage.setItem('miph_administradores_db', JSON.stringify([...adminsActuales, nuevoAdmin]));

        // Intentar guardar en Supabase si la tabla existe
        try {
          await supabase.from('administradores_comercios').insert({
            rut: datos.rutRepresentante,
            nombre: datos.representante,
            email: datos.email,
            comercio_id: datos.id !== 'Nuevo' ? datos.id : null,
            estado: 'Pendiente'
          });
        } catch (e) {
          console.warn("No se pudo guardar en tabla administradores_comercios real");
        }

        alert(`Convenio Aprobado.\n\nAdministrador creado: ${datos.representante}\nSe ha enviado un correo de activación a ${datos.email}`);
        router.push('/comercios/nuevo/administrador');
      } else {
        const motivo = window.prompt("Indique el motivo del rechazo:");
        if (motivo) {
          if (datos.id && datos.id !== 'Nuevo') {
            await supabase.from('comercios').update({ estado: 'Rechazado' }).eq('id', datos.id);
          }
          alert("Comercio rechazado. Se notificará al proveedor.");
          router.push('/comercios');
        }
      }
    } catch (error) {
      console.error("Error en decisión:", error);
      alert("Hubo un error al procesar la solicitud.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!datos) return <div className="p-20 text-center">Cargando antecedentes...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase rounded-full tracking-wider">
            Estado: Pendiente de revisión
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">Revisión de Antecedentes</h2>
          <p className="text-slate-500 text-sm">Confirma que la información y los documentos coincidan con el decreto</p>
        </div>
        <FileSearch size={40} className="text-slate-300" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUMNA IZQUIERDA: RESUMEN */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest">Resumen del Comercio</h3>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Razón Social</p>
                <p className="font-bold text-slate-800">{datos.razonSocial}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">RUT Empresa</p>
                <p className="font-bold text-slate-800">{datos.rut}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Representante Legal</p>
                <p className="font-bold text-slate-800">{datos.representante} (RUT: {datos.rutRepresentante})</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Dirección Principal</p>
                <p className="text-sm text-slate-600">{datos.direccion}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
            <Info className="text-blue-500 shrink-0" />
            <p className="text-xs text-blue-800 leading-relaxed">
              Verifique que el archivo PDF adjunto en el paso anterior sea legible y contenga las firmas correspondientes de la municipalidad y el representante legal.
            </p>
          </div>
        </div>

        {/* COLUMNA DERECHA: DECISIÓN */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Observaciones</h3>
            <textarea
              placeholder="Escriba observaciones si es necesario..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm h-32 focus:ring-2 focus:ring-primary/20 outline-none"
            />

            <div className="space-y-3 pt-4">
              <button
                onClick={() => handleDecision(true)}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-secondary text-white py-4 rounded-xl font-black hover:bg-green-700 transition-all shadow-lg shadow-green-900/20 disabled:bg-slate-200"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                APROBAR CONVENIO
              </button>

              <button
                onClick={() => handleDecision(false)}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 border-2 border-red-100 text-red-500 py-4 rounded-xl font-bold hover:bg-red-50 transition-all disabled:text-slate-300 disabled:border-slate-100"
              >
                <XCircle size={20} />
                RECHAZAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}