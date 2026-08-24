"use client";
import React from 'react';
import { User, Shield, Bell, Palette } from 'lucide-react';

export default function ConfiguracionPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Configuración</h2>
        <p className="text-slate-500 text-sm">Gestiona tu perfil y preferencias del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Perfil */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-primary font-bold">
            <User size={20} />
            <h4>Datos de Perfil</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-[10px] font-black text-slate-400 uppercase">Nombre Completo</p>
              <p className="text-sm font-bold text-slate-700">Administrador Municipal</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <p className="text-[10px] font-black text-slate-400 uppercase">Cargo</p>
              <p className="text-sm font-bold text-slate-700">Gestor de Convenios</p>
            </div>
          </div>
        </div>

        {/* Seguridad */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 text-primary font-bold">
            <Shield size={20} />
            <h4>Seguridad</h4>
          </div>
          <button className="w-full py-2 px-4 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            Cambiar Contraseña
          </button>
          <button className="w-full py-2 px-4 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            Activar Doble Factor (2FA)
          </button>
        </div>
      </div>
    </div>
  );
}