"use client";

import React, { useEffect, useState } from 'react';
import { Search, UserCog, Mail, CheckCircle2, XCircle, Clock, MoreHorizontal, Loader2, Edit } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdministradoresPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      // 1. Obtener administradores
      const { data: aData, error: aError } = await supabase
        .from('administradores_comercios')
        .select('*');

      if (aError) {
        console.warn("Tabla administradores_comercios no encontrada o error:", aError.message);
        const stored = localStorage.getItem('miph_administradores_db');
        setAdmins(stored ? JSON.parse(stored) : []);
        return;
      }

      // 2. Obtener comercios para unir manualmente (Bypass error de esquema)
      const { data: cData } = await supabase.from('comercios').select('id, nombre_fantasia');

      // 3. Unir datos
      const joined = (aData || []).map(admin => ({
        ...admin,
        comercios: cData?.find(c => c.id === admin.comercio_id) || null
      }));

      setAdmins(joined);
    } catch (error: any) {
      console.error('Error fetching admins:', error.message || error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
    const cerrarMenu = () => setMenuAbierto(null);
    window.addEventListener('click', cerrarMenu);
    return () => window.removeEventListener('click', cerrarMenu);
  }, []);

  const handleResendEmail = (email: string) => {
    alert(`Reenviando correo de activación a: ${email}`);
    setMenuAbierto(null);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestión de Administradores</h2>
          <p className="text-slate-500 text-sm">Supervisión de representantes legales y acceso al portal privado</p>
        </div>
        <div className="bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 text-center">
          <p className="text-[10px] font-black text-primary uppercase">Total Registrados</p>
          <p className="text-xl font-bold text-primary">{admins.length}</p>
        </div>
      </div>

      <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por RUT o nombre..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Administrador</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Comercio Asociado</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado de Acceso</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha Registro</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-10 text-center">
                  <Loader2 className="animate-spin text-primary mx-auto" size={32} />
                </td>
              </tr>
            ) : admins.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-slate-400 italic">No hay administradores registrados.</td>
              </tr>
            ) : (
              admins.map((admin, index) => (
                <tr key={admin.id || index} className="hover:bg-slate-50/50 transition-colors text-sm">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{admin.nombre}</div>
                    <div className="text-xs text-slate-400 font-bold uppercase tracking-tighter">RUT: {admin.rut}</div>
                  </td>
                  <td className="p-4 font-medium text-slate-700">{admin.comercios?.nombre_fantasia || admin.comercioNombre}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {admin.estado === 'Aprobado' ? (
                        <span className="flex items-center gap-1 text-green-600 font-bold text-xs bg-green-50 px-2 py-0.5 rounded-full uppercase">
                          <CheckCircle2 size={12} /> Acceso Activo
                        </span>
                      ) : admin.estado === 'Rechazado' ? (
                        <span className="flex items-center gap-1 text-red-600 font-bold text-xs bg-red-50 px-2 py-0.5 rounded-full uppercase">
                          <XCircle size={12} /> Rechazado
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-amber-600 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-full uppercase">
                          <Clock size={12} /> Pendiente primer acceso
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-slate-500">
                    {new Date(admin.fecha_creacion || admin.fechaCreacion).toLocaleDateString()}
                  </td>
                  <td className="p-4 relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const adminId = admin.id ? admin.id.toString() : index.toString();
                        setMenuAbierto(menuAbierto === adminId ? null : adminId);
                      }}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {menuAbierto === (admin.id ? admin.id.toString() : index.toString()) && (
                      <div className="absolute right-0 top-12 w-48 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => handleResendEmail(admin.email)}
                          className="w-full flex items-center gap-2 p-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <Mail size={16} /> Reenviar Email
                        </button>
                        <button
                          onClick={() => alert('Función próximamente')}
                          className="w-full flex items-center gap-2 p-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors border-t border-slate-100"
                        >
                          <Edit size={16} /> Editar Perfil
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
