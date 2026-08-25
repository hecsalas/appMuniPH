"use client";

import React, { useEffect, useState } from 'react';
import { Search, Gift, CheckCircle2, XCircle, Filter, MoreHorizontal, Edit, Trash2, Loader2, Plus, X, Store, Calendar, Clock, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ConveniosPage() {
  const [listaBeneficios, setListaBeneficios] = useState<any[]>([]);
  const [listaComercios, setListaComercios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);
  const [beneficioAEditar, setBeneficioAEditar] = useState<any | null>(null);
  const [mostrarModalNuevo, setMostrarModalNuevo] = useState(false);
  const [isSavingNuevo, setIsSavingNuevo] = useState(false);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // 1. Obtener beneficios
      const { data: bData, error: bError } = await supabase
        .from('beneficios')
        .select('*');

      if (bError) throw bError;

      // 2. Obtener comercios
      const { data: cData, error: cError } = await supabase
        .from('comercios')
        .select('*');

      if (cError) throw cError;
      setListaComercios(cData || []);

      // 3. Unir manualmente
      const joined = (bData || []).map(ben => {
        const cId = ben.comercio_id || ben.comercioid || ben.ComercioId;
        const comercio = (cData || []).find(c => c.id === cId);

        return {
          ...ben,
          estado: ben.estado || 'Activo',
          comercios: comercio || null
        };
      });

      setListaBeneficios(joined);
    } catch (error: any) {
      console.error('Error en la carga:', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
    const cerrarMenu = () => setMenuAbierto(null);
    window.addEventListener('click', cerrarMenu);
    return () => window.removeEventListener('click', cerrarMenu);
  }, []);

  const handleInactivate = async (id: string, titulo: string) => {
    if (window.confirm(`¿Estás seguro que deseas INACTIVAR el beneficio "${titulo}"?`)) {
      try {
        const { error } = await supabase
          .from('beneficios')
          .update({ estado: 'Inactivo' })
          .eq('id', id);

        if (error) throw error;
        cargarDatos();
      } catch (error) {
        console.error('Error inactivating benefit:', error);
      }
    }
    setMenuAbierto(null);
  };

  const handleActivate = async (id: string, titulo: string) => {
    if (window.confirm(`¿Deseas habilitar el beneficio "${titulo}"?`)) {
      try {
        const { error } = await supabase
          .from('beneficios')
          .update({ estado: 'Activo' })
          .eq('id', id);

        if (error) throw error;
        cargarDatos();
      } catch (error) {
        console.error('Error activating benefit:', error);
      }
    }
    setMenuAbierto(null);
  };

  const handleDelete = async (id: string, titulo: string) => {
    if (window.confirm(`¿Estás seguro que deseas ELIMINAR permanentemente el beneficio "${titulo}"?`)) {
      try {
        const { error } = await supabase.from('beneficios').delete().eq('id', id);
        if (error) throw error;
        cargarDatos();
      } catch (error) {
        console.error('Error deleting benefit:', error);
      }
    }
    setMenuAbierto(null);
  };

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const { error } = await supabase
        .from('beneficios')
        .update({
          titulo: formData.get('titulo'),
          descripcion: formData.get('descripcion'),
          estado: formData.get('estado')
        })
        .eq('id', beneficioAEditar.id);

      if (error) throw error;
      cargarDatos();
      setBeneficioAEditar(null);
    } catch (error) {
      console.error('Error updating benefit:', error);
    }
  };

  const handleCreateBenefit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSavingNuevo(true);
    const formData = new FormData(e.currentTarget);

    try {
      const { error } = await supabase
        .from('beneficios')
        .insert({
          comercio_id: formData.get('comercio_id'),
          titulo: formData.get('titulo'),
          descripcion: formData.get('descripcion'),
          dias_uso: formData.get('dias_uso'),
          horario_uso: formData.get('horario_uso'),
          condiciones: formData.get('condiciones'),
          estado: 'Activo'
        });

      if (error) throw error;

      alert("Beneficio creado exitosamente.");
      setMostrarModalNuevo(false);
      cargarDatos();
    } catch (error: any) {
      console.error('Error creating benefit:', error);
      alert(`Error al crear: ${error.message}`);
    } finally {
      setIsSavingNuevo(false);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Catálogo de Beneficios</h2>
          <p className="text-slate-500 text-sm">Visualización global de convenios y ofertas para el vecino</p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="bg-green-50 px-4 py-2 rounded-xl border border-green-100 text-center">
            <p className="text-[10px] font-black text-green-400 uppercase">Ofertas Activas</p>
            <p className="text-xl font-bold text-green-700">
              {listaBeneficios.filter(b => b.estado === 'Activo' && b.comercios?.estado === 'Vigente').length}
            </p>
          </div>
          <button
            onClick={() => setMostrarModalNuevo(true)}
            className="bg-primary text-white px-6 py-3 rounded-xl font-black text-sm hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2 uppercase tracking-widest"
          >
            <Plus size={18} /> Añadir Beneficio
          </button>
        </div>
      </div>

      <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar beneficio o comercio..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
          <Filter size={16} />
          Filtrar
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Beneficio</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Comercio</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Categoría</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
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
            ) : listaBeneficios.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-slate-400 italic">
                  No hay beneficios registrados actualmente.
                </td>
              </tr>
            ) : (
              listaBeneficios.map((ben) => (
                <tr key={ben.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded-lg text-primary">
                        <Gift size={20} />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{ben.titulo}</div>
                        <div className="text-xs text-slate-500 line-clamp-1">{ben.descripcion}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-medium text-slate-700">{ben.comercios?.nombre_fantasia}</td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase">
                      {ben.comercios?.categoria}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {ben.estado === 'Activo' && ben.comercios?.estado === 'Vigente' ? (
                        <div className="flex items-center gap-1 text-green-600 font-bold text-xs">
                          <CheckCircle2 size={14} /> ACTIVO
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-400 font-bold text-xs">
                          <XCircle size={14} /> INACTIVO
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuAbierto(menuAbierto === ben.id ? null : ben.id);
                      }}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {menuAbierto === ben.id && (
                      <div className="absolute right-0 top-12 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden" onClick={e => e.stopPropagation()}>
                        <button onClick={() => { setBeneficioAEditar(ben); setMenuAbierto(null); }} className="w-full flex items-center gap-2 p-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                          <Edit size={16} /> Editar
                        </button>
                        {ben.estado !== 'Activo' ? (
                          <button onClick={() => handleActivate(ben.id, ben.titulo)} className="w-full flex items-center gap-2 p-3 text-sm text-green-600 hover:bg-green-50 transition-colors">
                            <CheckCircle2 size={16} /> Habilitar
                          </button>
                        ) : (
                          <button onClick={() => handleInactivate(ben.id, ben.titulo)} className="w-full flex items-center gap-2 p-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                            <XCircle size={16} /> Inactivar
                          </button>
                        )}
                        <button onClick={() => handleDelete(ben.id, ben.titulo)} className="w-full flex items-center gap-2 p-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100 text-left">
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

      {beneficioAEditar && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-white/20">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Editar Beneficio</h3>
              <p className="text-sm text-slate-500">{beneficioAEditar.comercios?.nombre_fantasia}</p>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Título</label>
                <input name="titulo" defaultValue={beneficioAEditar.titulo} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Descripción</label>
                <textarea name="descripcion" defaultValue={beneficioAEditar.descripcion} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none h-24" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</label>
                <select name="estado" defaultValue={beneficioAEditar.estado} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
              <div className="flex gap-3 pt-6">
                <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-all">Guardar Cambios</button>
                <button type="button" onClick={() => setBeneficioAEditar(null)} className="px-6 text-slate-500 font-medium hover:bg-slate-100 rounded-xl transition-all">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE NUEVO BENEFICIO */}
      {mostrarModalNuevo && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-xl shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in duration-300">
            <div className="bg-primary p-6 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl">
                  <Plus size={20} />
                </div>
                <div>
                  <h3 className="font-black uppercase tracking-tighter text-sm">Nuevo Beneficio</h3>
                  <p className="text-[10px] text-white/70 uppercase font-bold tracking-widest">Añadir oferta al catálogo</p>
                </div>
              </div>
              <button onClick={() => setMostrarModalNuevo(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateBenefit} className="p-8 space-y-5">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Comercio Responsable</label>
                  <div className="relative">
                    <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <select name="comercio_id" required className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-slate-700 appearance-none">
                      <option value="">Seleccionar comercio...</option>
                      {listaComercios.map(c => (
                        <option key={c.id} value={c.id}>{c.nombre_fantasia}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Título del Beneficio</label>
                  <div className="relative">
                    <Gift className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input name="titulo" required placeholder="Ej: 20% de descuento en consultas" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-slate-700" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Descripción Breve</label>
                  <textarea name="descripcion" required placeholder="Detalle qué incluye el beneficio..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm h-24" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Días de Uso</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input name="dias_uso" required placeholder="Lun a Vie" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs" />
                      </div>
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Horario</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input name="horario_uso" required placeholder="09:00 - 18:00" className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs" />
                      </div>
                   </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Condiciones</label>
                  <input name="condiciones" placeholder="Ej: No acumulable, solo presencial" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs" />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="submit"
                  disabled={isSavingNuevo}
                  className="flex-1 bg-primary text-white py-4 rounded-2xl font-black text-xs hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 uppercase tracking-widest"
                >
                  {isSavingNuevo ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                  {isSavingNuevo ? 'Creando...' : 'Crear Beneficio'}
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarModalNuevo(false)}
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
