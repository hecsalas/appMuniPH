"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, FileText, Calendar, Plus, ShieldCheck, Save, FileCheck, Loader2 } from 'lucide-react';
import { saveFile } from '@/lib/fileStorage';
import { supabase } from '@/lib/supabase';

export default function ContratoVigenciaPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [comercioInfo, setComercioInfo] = useState<any>(null);

  useEffect(() => {
    const borrador = localStorage.getItem('miph_nuevo_comercio_borrador');
    if (borrador) setComercioInfo(JSON.parse(borrador));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert("Por favor seleccione un archivo PDF válido.");
    }
  };

  const handleFinalize = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      alert("Debe adjuntar el contrato en PDF para continuar.");
      return;
    }

    setIsSaving(true);
    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const borradorActual = JSON.parse(localStorage.getItem('miph_nuevo_comercio_borrador') || '{}');

      // 1. Subimos el ARCHIVO REAL al Storage de Supabase
      const publicUrl = await saveFile(borradorActual.rut, file);

      // 2. Preparamos el objeto completo
      const decreto = `DEC-2026-${Math.floor(Math.random() * 1000)}`;
      const fInicio = formData.get('fechaInicio');
      const fTermino = formData.get('fechaTermino');

      // 3. GUARDAMOS EN SUPABASE COMO PENDIENTE (Para que aparezca en la bandeja municipal)
      const { data: comercio, error: errSup } = await supabase
        .from('comercios')
        .upsert({
          rut: borradorActual.rut,
          razon_social: borradorActual.razonSocial,
          nombre_fantasia: borradorActual.nombre,
          giro: borradorActual.giro,
          telefono: borradorActual.telefono,
          email: borradorActual.email,
          direccion_matriz: borradorActual.direccion,
          comuna: borradorActual.comuna,
          representante_legal: borradorActual.representante,
          rut_representante_legal: borradorActual.rutRepresentante,
          categoria: borradorActual.categoria,
          decreto_numero: decreto,
          fecha_inicio: fInicio,
          fecha_termino: fTermino,
          archivo_url: publicUrl,
          estado: 'Pendiente'
        }, { onConflict: 'rut' })
        .select()
        .single();

      if (errSup) throw errSup;

      // 4. Actualizamos el borrador local con el ID real de la base de datos
      const borradorActualizado = {
        ...borradorActual,
        id: comercio.id, // ID ÚNICO DE SUPABASE
        fechaInicio: fInicio,
        fechaTermino: fTermino,
        nombreArchivo: file.name,
        archivoUrl: publicUrl,
        decreto: decreto,
      };

      localStorage.setItem('miph_nuevo_comercio_borrador', JSON.stringify(borradorActualizado));
      router.push('/admin/comercios/nuevo/revision');
    } catch (error: any) {
      console.error("Error al procesar el archivo o guardar en nube:", error);
      alert(`Error técnico: ${error.message || 'No se pudo conectar con el servidor'}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <Link href="/admin/comercios/nuevo" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-medium">
        <ArrowLeft size={16} />
        Volver a datos básicos
      </Link>

      <div>
        <h2 className="text-2xl font-bold text-slate-900">Documentación y Vigencia</h2>
        <p className="text-slate-500 text-sm">Paso final: Adjunta el respaldo legal y define los plazos del convenio</p>
      </div>

      <form onSubmit={handleFinalize} className="space-y-6">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
            <FileText size={18} />
            Respaldo Legal
          </h3>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className={`p-10 border-2 border-dashed rounded-2xl transition-colors cursor-pointer flex flex-col items-center justify-center text-center space-y-4 ${
              file ? 'border-green-200 bg-green-50/30' : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            {file ? (
              <>
                <div className="p-4 bg-green-100 rounded-full shadow-sm text-green-600">
                  <FileCheck size={32} />
                </div>
                <div>
                  <p className="font-bold text-green-700">Archivo seleccionado</p>
                  <p className="text-xs text-green-600 mt-1">{file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                  <p className="text-[10px] text-green-500 mt-2 font-medium underline">Haga clic para cambiar el archivo</p>
                </div>
              </>
            ) : (
              <>
                <div className="p-4 bg-white rounded-full shadow-sm text-primary">
                  <Plus size={32} />
                </div>
                <div>
                  <p className="font-bold text-slate-700">Subir Decreto Alcaldicio o Contrato</p>
                  <p className="text-xs text-slate-400 mt-1">El archivo debe ser PDF (Sin límite de tamaño)</p>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
            <Calendar size={18} />
            Periodo de Vigencia
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-tighter">Fecha de Inicio</label>
              <input required name="fechaInicio" type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" />
              <p className="text-[10px] text-slate-400">Fecha en que se firma el decreto</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-tighter">Fecha de Término</label>
              <input required name="fechaTermino" type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none" />
              <p className="text-[10px] text-slate-400">El convenio se desactivará automáticamente después de este día</p>
            </div>
          </div>
        </div>

        <div className="pt-4 flex flex-col items-center space-y-4">
          <button
            type="submit"
            disabled={isSaving}
            className={`w-full flex items-center justify-center gap-3 py-5 rounded-2xl font-black text-lg transition-all shadow-xl uppercase tracking-wider ${
              isSaving ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-secondary text-white hover:bg-green-700 shadow-green-900/20'
            }`}
          >
            {isSaving ? <Loader2 className="animate-spin" size={24} /> : <ShieldCheck size={24} />}
            {isSaving ? 'PROCESANDO ARCHIVO...' : 'GUARDAR Y CONTINUAR'}
          </button>
          <p className="text-xs text-slate-400 text-center px-10">
            El archivo se guardará de forma segura en la base de datos local para su posterior revisión administrativa.
          </p>
        </div>
      </form>
    </div>
  );
}
