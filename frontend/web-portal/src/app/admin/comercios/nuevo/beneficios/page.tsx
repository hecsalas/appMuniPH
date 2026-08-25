"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Gift, Plus, CheckCircle2, MoreVertical, ChevronRight, Store, Clock, Calendar, AlertCircle } from 'lucide-react';

export default function BeneficiosAsignacionPage() {
  const router = useRouter();
  const [beneficios, setBeneficios] = useState<any[]>([]);
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  useEffect(() => {
    // Cargamos sucursales y beneficios previos
    const sucs = localStorage.getItem('miph_sucursales_borrador');
    const bens = localStorage.getItem('miph_beneficios_borrador');
    if (sucs) setSucursales(JSON.parse(sucs));
    if (bens) setBeneficios(JSON.parse(bens));
  }, []);

  const agregarBeneficio = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const nuevo = {
      id: Date.now(),
      titulo: formData.get('titulo'),
      descripcion: formData.get('descripcion'),
      diasUso: formData.get('diasUso'),
      horarioUso: formData.get('horarioUso'),
      condiciones: formData.get('condiciones'),
      estado: 'Activo'
    };

    const nuevaLista = [...beneficios, nuevo];
    setBeneficios(nuevaLista);
    localStorage.setItem('miph_beneficios_borrador', JSON.stringify(nuevaLista));
    setMostrarForm(false);
  };

  const handleAsignar = () => {
    if (!sucursalSeleccionada) {
      alert("Por favor seleccione una sucursal.");
      return;
    }

    setMensajeExito("Beneficios asignados correctamente a la sucursal.");
    setTimeout(() => setMensajeExito(""), 3000);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500">
      <Link href="/admin/comercios/nuevo/qr" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-medium">
        <ArrowLeft size={16} />
        Volver a QR
      </Link>

      {mensajeExito && (
        <div className="fixed top-24 right-8 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-xl z-[100] flex items-center gap-2 animate-in slide-in-from-right duration-300">
          <CheckCircle2 size={20} />
          <span className="font-bold text-sm">{mensajeExito}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

        {/* COLUMNA IZQUIERDA: REGISTRO DE BENEFICIOS (PASO 9) */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-900">9. Registro de Beneficios</h2>
              <p className="text-slate-500 text-xs mt-1">Define los descuentos y condiciones del convenio</p>
            </div>
            <button
              onClick={() => setMostrarForm(true)}
              className="flex items-center gap-2 bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-800 transition-colors shadow-sm"
            >
              <Plus size={14} /> Nuevo beneficio
            </button>
          </div>

          <div className="space-y-3">
            {beneficios.length === 0 && !mostrarForm && (
              <div className="py-10 text-center bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 text-sm italic">
                No hay beneficios creados
              </div>
            )}

            {beneficios.map((ben) => (
              <div key={ben.id} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 relative group">
                <div className="flex justify-between">
                  <h4 className="font-bold text-slate-800 text-sm">{ben.titulo}</h4>
                  <span className="text-[9px] font-black text-green-600 uppercase bg-green-50 px-2 py-0.5 rounded">Activo</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                  <div className="flex items-center gap-1"><Calendar size={12} /> {ben.diasUso || 'No especificado'}</div>
                  <div className="flex items-center gap-1"><Clock size={12} /> {ben.horarioUso || 'Todo el día'}</div>
                </div>
                <div className="text-[10px] bg-slate-50 p-2 rounded-lg text-slate-600 border border-slate-100 italic">
                   {ben.condiciones || 'Sin condiciones especiales'}
                </div>
              </div>
            ))}

            {mostrarForm && (
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-primary/20 space-y-4 shadow-inner">
                <form onSubmit={agregarBeneficio} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Título del Beneficio</label>
                    <input required name="titulo" placeholder="Ej: 15% Descuento Menú Ejecutivo" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Días de Vigencia</label>
                      <input required name="diasUso" placeholder="Ej: Lunes a Viernes" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Horario</label>
                      <input required name="horarioUso" placeholder="Ej: 12:00 - 16:00" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Condiciones / Restricciones</label>
                    <textarea required name="condiciones" placeholder="Ej: Válido solo presencial, no acumulable" className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm outline-none h-20" />
                  </div>

                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-xl font-bold">Guardar Beneficio</button>
                    <button type="button" onClick={() => setMostrarForm(false)} className="px-4 text-slate-500 text-sm font-bold">Cancelar</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: ASIGNACIÓN A SUCURSALES (PASO 10) */}
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">10. Asignación a Sucursales</h2>
            <p className="text-slate-500 text-xs mt-1">Vincula los beneficios a locales específicos</p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seleccionar Sucursal</label>
              <select
                value={sucursalSeleccionada}
                onChange={(e) => setSucursalSeleccionada(e.target.value)}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Elegir sucursal...</option>
                {sucursales.map(s => (
                  <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Seleccionar beneficios disponibles</label>
              <div className="space-y-2">
                {beneficios.map(ben => (
                  <label key={ben.id} className="flex items-center gap-3 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-colors">
                    <input type="checkbox" className="w-5 h-5 accent-primary rounded-lg" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-700">{ben.titulo}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black">{ben.diasUso}</p>
                    </div>
                  </label>
                ))}
                {beneficios.length === 0 && <p className="text-xs text-slate-400 italic text-center py-4">Registre un beneficio primero</p>}
              </div>
            </div>

            <button
              onClick={handleAsignar}
              className="w-full bg-primary text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
            >
              ASIGNAR A SUCURSAL
            </button>
          </div>
        </div>

      </div>

      {/* BOTÓN FINAL */}
      <div className="pt-10 flex justify-center">
        <button
          onClick={() => router.push('/admin/comercios/nuevo/exito')}
          className="bg-secondary text-white px-16 py-5 rounded-3xl font-black text-xl hover:bg-green-700 transition-all shadow-2xl shadow-green-900/30 flex items-center gap-4 uppercase tracking-tighter"
        >
          FINALIZAR Y ACTIVAR <ChevronRight size={28} />
        </button>
      </div>
    </div>
  );
}
