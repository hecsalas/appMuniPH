"use client";

import React, { useEffect, useState } from 'react';
import { Search, UserCog, Mail, CheckCircle2, XCircle, Clock, MoreHorizontal, Loader2, Edit, Trash2, X, Save, Copy, Lock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdministradoresPage() {
  const [admins, setAdmins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState<string | null>(null);
  const [adminAEditar, setAdminAEditar] = useState<any | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleResendEmail = async (admin: any) => {
    setIsSendingEmail(admin.id.toString());
    try {
      const res = await fetch('/admin/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: admin.email,
          nombre: admin.nombre,
          tempPass: admin.password_temporal || 'Consultar con Municipalidad',
          activationLink: admin.enlace_activacion || '#'
        })
      });

      if (!res.ok) throw new Error('Error al enviar email');
      alert(`Correo de activación reenviado con éxito a: ${admin.email}`);
    } catch (e) {
      console.error("Fallo reenvío de email:", e);
      alert("No se pudo reenviar el correo. Verifique la conexión o que los datos del administrador sean correctos.");
    } finally {
      setIsSendingEmail(null);
      setMenuAbierto(null);
    }
  };

  const handleDeleteAdmin = async (id: string, nombre: string) => {
    if (window.confirm(`¿Estás seguro que deseas ELIMINAR permanentemente al administrador "${nombre}"?`)) {
      try {
        const { error } = await supabase
          .from('administradores_comercios')
          .delete()
          .eq('id', id);

        if (error) throw error;
        fetchAdmins();
      } catch (error: any) {
        console.error('Error deleting admin:', error.message || error);
        alert("No se pudo eliminar el registro.");
      }
    }
    setMenuAbierto(null);
  };

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);

    try {
      const { error } = await supabase
        .from('administradores_comercios')
        .update({
          email: formData.get('email'),
          password_temporal: formData.get('password'),
        })
        .eq('id', adminAEditar.id);

      if (error) throw error;

      alert("Perfil actualizado con éxito.");
      setAdminAEditar(null);
      fetchAdmins();
    } catch (error: any) {
      console.error("Error updating admin:", error);
      alert(`Error al guardar: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyCredentials = (admin: any) => {
    const text = `Hola ${admin.nombre},\n\nTu acceso al Portal de Comercios Mi Padre Hurtado ha sido habilitado.\n\nUsuario: ${admin.email}\nClave Temporal: ${admin.password_temporal || 'Consultar'}\nLink de Activación: ${admin.enlace_activacion || 'https://miph.cl'}\n\nPor favor, ingresa y cambia tu clave en el primer acceso.`;

    navigator.clipboard.writeText(text).then(() => {
      alert("Datos de acceso copiados al portapapeles. Ya puedes pegarlos en WhatsApp o Email.");
    });
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
                          onClick={() => handleResendEmail(admin)}
                          disabled={isSendingEmail === admin.id.toString()}
                          className="w-full flex items-center gap-2 p-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors disabled:opacity-50"
                        >
                          {isSendingEmail === admin.id.toString() ? (
                            <Loader2 className="animate-spin" size={16} />
                          ) : (
                            <Mail size={16} />
                          )}
                          {isSendingEmail === admin.id.toString() ? 'Enviando...' : 'Reenviar Email'}
                        </button>
                        <button
                          onClick={() => handleCopyCredentials(admin)}
                          className="w-full flex items-center gap-2 p-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors border-t border-slate-100"
                        >
                          <Copy size={16} /> Copiar Accesos
                        </button>
                        <button
                          onClick={() => {
                            setAdminAEditar(admin);
                            setMenuAbierto(null);
                          }}
                          className="w-full flex items-center gap-2 p-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors border-t border-slate-100"
                        >
                          <Edit size={16} /> Editar Perfil
                        </button>
                        <button
                          onClick={() => handleDeleteAdmin(admin.id, admin.nombre)}
                          className="w-full flex items-center gap-2 p-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100"
                        >
                          <Trash2 size={16} /> Eliminar
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

      {/* MODAL DE EDICIÓN DE PERFIL */}
      {adminAEditar && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in duration-300">
            <div className="bg-primary p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <UserCog size={20} />
                </div>
                <div>
                  <h3 className="font-black uppercase tracking-tighter text-sm">Editar Perfil de Acceso</h3>
                  <p className="text-[10px] text-white/70 uppercase font-bold tracking-widest">{adminAEditar.nombre}</p>
                </div>
              </div>
              <button onClick={() => setAdminAEditar(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Correo de Contacto / Usuario</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      name="email"
                      type="email"
                      defaultValue={adminAEditar.email}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Contraseña Temporal</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      name="password"
                      type="text"
                      defaultValue={adminAEditar.password_temporal}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono font-bold text-primary text-lg"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 italic px-1">Esta clave es solo para el primer acceso del socio.</p>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-xs hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                <button
                  type="button"
                  onClick={() => setAdminAEditar(null)}
                  className="px-6 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all uppercase text-[10px] tracking-widest"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
