"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search, Plus, MoreHorizontal, Filter, Trash2, Edit, Loader2, XCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ComerciosPage() {
  const [comercios, setComercios] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);
  const [comercioAEditar, setComercioAEditar] = useState<any | null>(null);

  const fetchComercios = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('comercios')
        .select('*')
        .order('fecha_registro', { ascending: false });

      if (error) throw error;
      setComercios(data || []);
    } catch (error) {
      console.error('Error fetching comercios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComercios();

    const cerrarMenu = () => setMenuAbierto(null);
    window.addEventListener('click', cerrarMenu);
    return () => window.removeEventListener('click', cerrarMenu);
  }, []);

  const handleInactivate = async (id: string, nombre: string) => {
    if (window.confirm(`¿Estás seguro que deseas INACTIVAR a "${nombre}"?`)) {
      try {
        const { error } = await supabase
          .from('comercios')
          .update({ estado: 'Vencido' })
          .eq('id', id);

        if (error) throw error;
        fetchComercios();
      } catch (error) {
        console.error('Error inactivating:', error);
      }
    }
    setMenuAbierto(null);
  };

  const handleActivate = async (id: string, nombre: string) => {
    if (window.confirm(`¿Deseas habilitar el comercio "${nombre}"? Los vecinos volverán a verlo en la App.`)) {
      try {
        const { error } = await supabase
          .from('comercios')
          .update({ estado: 'Vigente' })
          .eq('id', id);

        if (error) throw error;
        fetchComercios();
      } catch (error) {
        console.error('Error activating:', error);
      }
    }
    setMenuAbierto(null);
  };

  const handleDelete = async (id: string, nombre: string) => {
    if (window.confirm(`¿Estás seguro que deseas ELIMINAR permanentemente a "${nombre}"? Esta acción borrará también todas sus sucursales y beneficios.`)) {
      try {
        const { error } = await supabase
          .from('comercios')
          .delete()
          .eq('id', id);

        if (error) throw error;
        fetchComercios();
      } catch (error) {
        console.error('Error deleting comercio:', error);
        alert("No se pudo eliminar el comercio. Verifique los permisos.");
      }
    }
    setMenuAbierto(null);
  };

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const { error } = await supabase
        .from('comercios')
        .update({
          nombre_fantasia: formData.get('nombre'),
          categoria: formData.get('categoria'),
          direccion_matriz: formData.get('direccion'),
          estado: formData.get('estado'),
        })
        .eq('id', comercioAEditar.id);

      if (error) throw error;
      fetchComercios();
      setComercioAEditar(null);
    } catch (error) {
      console.error('Error updating:', error);
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Cabecera de Página */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestión de Comercios</h2>
          <p className="text-slate-500 text-sm">Administra los proveedores y convenios de la comuna</p>
        </div>

        <Link
          href="/comercios/nuevo"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-800 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Añadir Proveedor
        </Link>
      </div>

      <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre o RUT..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
          <Filter size={16} />
          Categorías
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre del Comercio</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Categoría</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Dirección</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-10 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-primary" size={32} />
                    <p className="text-slate-400 text-sm italic">Cargando proveedores desde la nube...</p>
                  </div>
                </td>
              </tr>
            ) : comercios.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-slate-400 italic text-sm">
                  No hay comercios registrados en la base de datos.
                </td>
              </tr>
            ) : (
              comercios.map((comercio) => (
                <tr key={comercio.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{comercio.nombre_fantasia}</div>
                    <div className="text-xs text-slate-400 font-medium italic">{comercio.razon_social}</div>
                    <div className="text-[10px] text-primary font-black mt-1 uppercase tracking-tighter">RUT: {comercio.rut}</div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[11px] font-bold">
                      {comercio.categoria || 'Sin Categoría'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600">
                    <p className="line-clamp-2">{comercio.direccion_matriz}</p>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        comercio.estado === 'Vigente' ? 'bg-green-500' :
                        comercio.estado === 'Pendiente' ? 'bg-amber-500' : 'bg-red-500'
                      }`} />
                      <span className="text-sm font-medium text-slate-700">{comercio.estado}</span>
                    </div>
                  </td>
                  <td className="p-4 relative">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setMenuAbierto(menuAbierto === comercio.id ? null : comercio.id);
                        }}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                      >
                        <MoreHorizontal size={20} />
                      </button>

                      {menuAbierto === comercio.id && (
                        <div
                          className="absolute right-0 top-12 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              setComercioAEditar(comercio);
                              setMenuAbierto(null);
                            }}
                            className="w-full flex items-center gap-2 p-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                          >
                            <Edit size={16} />
                            Editar
                          </button>
                          {comercio.estado !== 'Vigente' ? (
                            <button
                              onClick={() => handleActivate(comercio.id, comercio.nombre_fantasia)}
                              className="w-full flex items-center gap-2 p-3 text-sm text-green-600 hover:bg-green-50 transition-colors"
                            >
                              <CheckCircle2 size={16} />
                              Habilitar
                            </button>
                          ) : (
                            <button
                              onClick={() => handleInactivate(comercio.id, comercio.nombre_fantasia)}
                              className="w-full flex items-center gap-2 p-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                            >
                              <XCircle size={16} />
                              Inactivar
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(comercio.id, comercio.nombre_fantasia)}
                            className="w-full flex items-center gap-2 p-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100"
                          >
                            <Trash2 size={16} />
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {comercioAEditar && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-white/20 animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Editar Comercio</h3>
              <p className="text-sm text-slate-500">Actualiza la información del proveedor</p>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre Fantasía</label>
                <input
                  name="nombre"
                  defaultValue={comercioAEditar.nombre_fantasia}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoría</label>
                <select
                  name="categoria"
                  defaultValue={comercioAEditar.categoria}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                >
                  <option value="Salud">Salud</option>
                  <option value="Mascotas">Mascotas</option>
                  <option value="Alimentos">Alimentos</option>
                  <option value="Educación">Educación</option>
                  <option value="Entretenimiento">Entretenimiento</option>
                  <option value="Bebidas">Bebidas</option>
                  <option value="Deporte">Deporte</option>
                  <option value="Servicios">Servicios</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Dirección Casa Matriz</label>
                <input
                  name="direccion"
                  defaultValue={comercioAEditar.direccion_matriz}
                  required
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado del Convenio</label>
                <select
                  name="estado"
                  defaultValue={comercioAEditar.estado}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                >
                  <option value="Vigente">Vigente</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Vencido">Vencido</option>
                </select>
              </div>

              <div className="flex gap-3 pt-6">
                <button
                  type="submit"
                  className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10"
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  onClick={() => setComercioAEditar(null)}
                  className="px-6 text-slate-500 font-medium hover:bg-slate-100 rounded-xl transition-all"
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
