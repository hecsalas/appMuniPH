"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Building2, MapPin, FileCheck, Plus } from 'lucide-react';

export default function NuevoComercioPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const nuevoBorrador = {
      razonSocial: formData.get('razonSocial'),
      nombre: formData.get('nombre'),
      rut: formData.get('rut'),
      giro: formData.get('giro'),
      comuna: formData.get('comuna'),
      representante: formData.get('representante'),
      rutRepresentante: formData.get('rutRepresentante'),
      telefono: formData.get('telefono'),
      email: formData.get('email'),
      categoria: formData.get('categoria'),
      direccion: formData.get('direccion'),
      fechaRegistro: new Date().toISOString(),
    };

localStorage.setItem('miph_nuevo_comercio_borrador', JSON.stringify(nuevoBorrador));

router.push('/comercios/nuevo/contrato');
};

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      {/* Botón de Volver */}
      <Link href="/comercios" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-medium">
        <ArrowLeft size={16} />
        Volver a la lista
      </Link>

      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Ingresar datos del comercio</h2>
          <p className="text-slate-500 text-sm">Completa la información legal y comercial del local</p>
        </div>
      </div>

      {/* Formulario Principal */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">

          {/* SECCIÓN 1: Información Básica */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
              <Building2 size={18} />
              Nuevo Comercio
            </h3>

            {/* Se usa solo 1 grid para todo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">RUT Empresa *</label>
                <input required name="rut" type="text" placeholder="12.345.678-9" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Razón Social *</label>
                <input required name="razonSocial" type="text" placeholder="Ej: Comercial La Central SpA" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Nombre de fantasía *</label>
                <input required name="nombre" type="text" placeholder="La Central" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Giro *</label>
                <input required name="giro" type="text" placeholder="Ej: Alimentación" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Teléfono *</label>
                <input required name="telefono" type="text" placeholder="+56 9 1234 5678" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Email contacto *</label>
                <input required name="email" type="email" placeholder="contacto@lacentral.cl" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Dirección Casa Matriz *</label>
                <input required name="direccion" type="text" placeholder="Av. Pedro Aguirre Cerda 1234" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Comuna *</label>
                <input required name="comuna" type="text" defaultValue="Padre Hurtado" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Rep. Legal *</label>
                <input required name="representante" type="text" placeholder="Juan Pérez González" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">RUT Rep. Legal *</label>
                <input required name="rutRepresentante" type="text" placeholder="11.111.111-1" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Categoría</label>
                <select name="categoria" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                  <option value="">Seleccionar...</option>
                  <option value="Salud">Salud</option>
                  <option value="Mascotas">Mascotas</option>
                  <option value="Alimentos">Alimentos</option>
                  <option value="Educación">Educación</option>
                  <option value="Entretenimiento">Entretenimiento</option>
                  <option value="Bebidas">Bebidas</option>
                </select>
              </div>
            </div>
          </div>

          <hr className="border-slate-100" />

          {/* Botones de Acción */}
          <div className="pt-4 flex gap-4">
            <button type="submit" className="flex-1 flex items-center justify-center gap-2 bg-primary text-white py-4 rounded-xl font-black hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20">
              <Save size={20} />
              GUARDAR Y CONTINUAR
            </button>
            <Link href="/comercios" className="px-8 flex items-center justify-center text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-all">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
