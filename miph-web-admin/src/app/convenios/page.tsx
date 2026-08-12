"use client";

import React, { useEffect, useState } from 'react';
import { Search, Gift, CheckCircle2, XCircle, Filter, MoreHorizontal, Edit, Trash2, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ConveniosPage() {
  const [listaBeneficios, setListaBeneficios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);
  const [beneficioAEditar, setBeneficioAEditar] = useState<any | null>(null);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      console.log("Intentando cargar beneficios y comercios...");

      // 1. Obtener beneficios con selector universal para evitar bloqueos por cache de columnas
      const { data: bData, error: bError } = await supabase
        .from('beneficios')
        .select('*');

      if (bError) {
        console.error("Error al obtener beneficios:", bError);
        throw bError;
      }

      if (bData && bData.length > 0) {
        console.log("Columnas detectadas en primer beneficio:", Object.keys(bData[0]));
      }

      // 2. Obtener comercios
      const { data: cData, error: cError } = await supabase
        .from('comercios')
        .select('*');

      if (cError) {
        console.error("Error al obtener comercios:", cError);
        throw cError;
      }

      // 3. Unir manualmente en el navegador con manejo de diferentes nomenclaturas posibles
      const joined = (bData || []).map(ben => {
        // Buscamos el comercio_id intentando varias variaciones si falló el esquema
        const cId = ben.comercio_id || ben.comercioid || ben.ComercioId;
        const comercio = (cData || []).find(c => c.id === cId);

        return {
          ...ben,
          estado: ben.estado || 'Activo', // Salvavidas: si la columna no llega, asumimos Activo
          comercios: comercio || null
        };
      });

      console.log("Sincronización de datos completada. Registros:", joined.length);
      setListaBeneficios(joined);
    } catch (error: any) {
      console.error('Error detallado en la carga del portal:', error.message || error);
      alert(`Error de sincronización: ${error.message}. Por favor, ejecute "NOTIFY pgrst, 'reload schema';" en Supabase si el problema persiste.`);
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

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Catálogo de Beneficios</h2>
          <p className="text-slate-500 text-sm">Visualización global de convenios y ofertas para el vecino</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-green-50 px-4 py-2 rounded-xl border border-green-100 text-center">
            <p className="text-[10px] font-black text-green-400 uppercase">Ofertas Activas</p>
            <p className="text-xl font-bold text-green-700">
              {listaBeneficios.filter(b => b.estado === 'Activo' && b.comercios?.estado === 'Vigente').length}
            </p>
          </div>
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
    </div>
  );
}
