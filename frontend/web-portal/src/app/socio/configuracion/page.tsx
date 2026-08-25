"use client";

import React, { useEffect, useState } from 'react';
import { User, Store, Shield, Mail, Phone, MapPin, Loader2 } from 'lucide-react';

export default function ConfiguracionSocioPage() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const s = localStorage.getItem('miph_comercio_session');
    if (s) {
      setSession(JSON.parse(s));
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  const comercio = session?.comercios;

  return (
    <div className="p-8 space-y-10 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Configuración de Cuenta</h2>
        <p className="text-slate-600 font-medium mt-1">Gestiona tu información de acceso y los datos de tu comercio</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bloque 1: Perfil del Administrador */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-primary rounded-2xl">
              <User size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Perfil de Usuario</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nombre Completo</p>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800">
                {session?.nombre || 'No disponible'}
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email / Usuario</p>
              <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-800">
                <Mail size={16} className="text-slate-400" />
                {session?.email || 'No disponible'}
              </div>
            </div>

            <div className="pt-4">
              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-2">
                <Shield size={16} /> Cambiar Contraseña
              </button>
            </div>
          </div>
        </div>

        {/* Bloque 2: Información del Comercio */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Store size={24} />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Datos del Comercio</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Nombre de Fantasía</p>
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-indigo-700">
                {comercio?.nombre_fantasia || 'No disponible'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">RUT Empresa</p>
                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 text-sm">
                        {comercio?.rut || 'No disponible'}
                    </div>
                </div>
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Teléfono</p>
                    <div className="flex items-center gap-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 text-sm">
                        <Phone size={14} className="text-slate-400" />
                        {comercio?.telefono || 'No disponible'}
                    </div>
                </div>
            </div>

            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Dirección Casa Matriz</p>
              <div className="flex items-center gap-2 p-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-700 text-sm">
                <MapPin size={14} className="text-slate-400 shrink-0" />
                <span className="truncate">{comercio?.direccion_matriz || 'No disponible'}</span>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100">
                <p className="text-[9px] text-amber-800 font-bold leading-relaxed">
                    Si necesitas actualizar los datos de tu comercio o sucursal, por favor contacta a la oficina de fomento productivo de la Municipalidad.
                </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
