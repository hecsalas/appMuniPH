"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { UserCheck, Mail, ShieldCheck, ChevronRight, Info } from 'lucide-react';

export default function AdministradorConfirmacionPage() {
  const router = useRouter();
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    // Priorizamos leer al administrador de la sesión activa
    const currentAdmin = localStorage.getItem('miph_current_active_admin');

    if (currentAdmin) {
      setAdmin(JSON.parse(currentAdmin));
    } else {
      // Fallback: Tomamos el último administrador de la lista general
      const admins = JSON.parse(localStorage.getItem('miph_administradores_db') || '[]');
      if (admins.length > 0) {
        setAdmin(admins[admins.length - 1]);
      }
    }
  }, []);

  if (!admin) return <div className="p-20 text-center">Cargando datos del administrador...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <div className="inline-flex p-4 bg-blue-50 text-primary rounded-full relative">
          <UserCheck size={40} />
          <div className="absolute -top-1 -right-1 bg-green-500 text-white p-1 rounded-full border-2 border-white">
            <ShieldCheck size={16} />
          </div>
        </div>
        <div>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase rounded-full tracking-wider">
            Nuevo Paso: Registro de Identidad
          </span>
          <h2 className="text-3xl font-bold text-slate-900 mt-4">Crear usuario administrador</h2>
          <p className="text-slate-500 text-sm max-w-md mx-auto">
            Se ha vinculado al Representante Legal como el responsable oficial del comercio en la plataforma.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Perfil del Administrador</h3>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-3 bg-white rounded-xl shadow-sm font-bold text-primary text-xs">RUT</div>
                  <p className="font-bold text-slate-800">{admin.rut}</p>
                </div>

                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="p-3 bg-white rounded-xl shadow-sm font-bold text-primary text-xs">ESTADO</div>
                  <p className="font-bold text-amber-600 flex items-center gap-2">
                    <Info size={16} /> Pendiente primer acceso
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Vinculación Comercial</h3>

              <div className="p-6 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-center space-y-2">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <ShieldCheck size={24} />
                </div>
                <p className="font-bold text-slate-700">{admin.comercioNombre}</p>
                <p className="text-[10px] text-slate-400 uppercase font-black">Asociado al comercio</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 p-6 rounded-2xl border border-green-100 flex items-start gap-4">
            <Mail className="text-green-600 shrink-0 mt-1" />
            <div className="space-y-1">
              <p className="text-sm font-bold text-green-800 text-left">Correo de activación enviado</p>
              <p className="text-xs text-green-700 leading-relaxed text-left">
                Se han enviado las instrucciones al correo electrónico registrado para que el representante pueda acceder al Portal del Comercio con su Clave Única.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <button
          onClick={() => router.push('/admin/comercios/nuevo/sucursales')}
          className="bg-primary text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-blue-800 transition-all shadow-2xl shadow-blue-900/20 flex items-center gap-3 uppercase tracking-tighter"
        >
          Continuar a Registro de Sucursales <ChevronRight size={24} />
        </button>
        <p className="text-[10px] text-slate-400 font-medium max-w-xs text-center uppercase tracking-widest">
          El administrador podrá gestionar su empresa una vez activado el convenio
        </p>
      </div>
    </div>
  );
}
