"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, MapPin, Phone, Clock, Plus, Store, CheckCircle2 } from 'lucide-react';

export default function SucursalesPage() {
  const router = useRouter();
  const [sucursales, setSucursales] = useState<any[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  // Cargar datos previos si existen
  useEffect(() => {
    const guardadas = localStorage.getItem('miph_sucursales_borrador');
    if (guardadas) setSucursales(JSON.parse(guardadas));
  }, []);

  const agregarSucursal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const nueva = {
      id: Date.now(),
      nombre: formData.get('nombre'),
      direccion: formData.get('direccion'),
      telefono: formData.get('telefono'),
      horario: formData.get('horario'),
    };

    const nuevaLista = [...sucursales, nueva];
    setSucursales(nuevaLista);
    localStorage.setItem('miph_sucursales_borrador', JSON.stringify(nuevaLista));
    setMostrarFormulario(false);
  };

  const eliminarSucursal = (id: number) => {
    const filtradas = sucursales.filter(s => s.id !== id);
    setSucursales(filtradas);
    localStorage.setItem('miph_sucursales_borrador', JSON.stringify(filtradas));
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      <Link href="/comercios/nuevo/revision" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-medium">
        <ArrowLeft size={16} />
        Volver a revisión
      </Link>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Registro de Sucursales</h2>
          <p className="text-slate-500 text-sm">Añade todos los locales físicos que participan en el convenio</p>
        </div>
        <button
          onClick={() => setMostrarFormulario(true)}
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-800 transition-colors shadow-md"
        >
          <Plus size={18} />
          Nueva Sucursal
        </button>
      </div>

      {/* LISTADO DE SUCURSALES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sucursales.length === 0 && !mostrarFormulario && (
          <div className="col-span-full py-20 text-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl">
            <Store size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">Aún no hay sucursales registradas</p>
          </div>
        )}

        {sucursales.map((sucursal) => (
          <div key={sucursal.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 relative group">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-slate-900 text-lg">{sucursal.nombre}</h3>
              <span className="flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-full uppercase tracking-tighter">
                <CheckCircle2 size={12} /> Activa
              </span>
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-primary" /> {sucursal.direccion}
              </div>
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-primary" /> {sucursal.telefono}
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-primary" /> {sucursal.horario}
              </div>
            </div>

            <button
              onClick={() => eliminarSucursal(sucursal.id)}
              className="absolute top-2 right-2 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
            >
              Borrar
            </button>
          </div>
        ))}

        {/* FORMULARIO DE NUEVA SUCURSAL */}
        {mostrarFormulario && (
          <div className="bg-slate-50 p-6 rounded-2xl border-2 border-primary/20 shadow-inner space-y-4">
            <h3 className="font-black text-primary text-xs uppercase tracking-widest">Nueva Sucursal</h3>
            <form onSubmit={agregarSucursal} className="space-y-4">
              <input required name="nombre" placeholder="Nombre (Ej: Sucursal Centro)" className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20" />
              <input required name="direccion" placeholder="Dirección exacta" className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20" />
              <div className="grid grid-cols-2 gap-4">
                <input required name="telefono" placeholder="Teléfono" className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none" />
                <input required name="horario" placeholder="Horario (09:00 - 18:00)" className="w-full p-3 bg-white border border-slate-200 rounded-xl outline-none" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-colors">Guardar Sucursal</button>
                <button type="button" onClick={() => setMostrarFormulario(false)} className="px-6 text-slate-500 font-medium hover:bg-slate-200 rounded-xl transition-colors">Cancelar</button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* BOTÓN PARA CONTINUAR */}
      {sucursales.length > 0 && (
        <div className="pt-10 flex justify-center">
          <button
            onClick={() => router.push('/comercios/nuevo/qr')}
            className="bg-secondary text-white px-12 py-4 rounded-2xl font-black text-lg hover:bg-green-700 transition-all shadow-xl shadow-green-900/20"
          >
            CONTINUAR A GENERACIÓN DE QR
          </button>
        </div>
      )}
    </div>
  );
}