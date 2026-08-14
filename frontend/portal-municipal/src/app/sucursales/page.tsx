"use client";

import React, { useEffect, useState } from 'react';
import { Search, MapPin, Phone, Clock, Store, Filter, MoreHorizontal, Edit, Trash2, Loader2, XCircle, CheckCircle2, QrCode, Download, Printer, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import QRCode from 'react-qr-code';

export default function SucursalesPage() {
  const [listaSucursales, setListaSucursales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);
  const [sucursalAEditar, setSucursalAEditar] = useState<any | null>(null);
  const [sucursalParaQR, setSucursalParaQR] = useState<any | null>(null);
  const [comerciosDisponibles, setComerciosDisponibles] = useState<any[]>([]);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // 1. Obtener sucursales planas
      const { data: sData, error: sError } = await supabase
        .from('sucursales')
        .select('*');

      if (sError) throw sError;

      // 2. Obtener lista de comercios
      const { data: cData, error: cError } = await supabase
        .from('comercios')
        .select('id, nombre_fantasia, categoria, estado');

      if (cError) throw cError;

      setComerciosDisponibles(cData || []);

      // 3. Unir datos manualmente para evitar errores de cache de esquema
      const joined = (sData || []).map(suc => {
        const cId = suc.comercio_id || suc.comercioid;
        const comercio = (cData || []).find(c => c.id === cId);

        return {
          ...suc,
          comercios: comercio || null
        };
      });

      setListaSucursales(joined);
    } catch (error: any) {
      console.error('Error loading sucursales:', error.message || error);
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

  const handleInactivate = async (id: string, nombre: string) => {
    if (window.confirm(`¿Estás seguro que deseas INACTIVAR la sucursal "${nombre}"?`)) {
      try {
        const { error } = await supabase
          .from('sucursales')
          .update({ estado: 'Inactiva' })
          .eq('id', id);

        if (error) throw error;
        cargarDatos();
      } catch (error) {
        console.error('Error inactivating sucursal:', error);
      }
    }
    setMenuAbierto(null);
  };

  const handleActivate = async (id: string, nombre: string) => {
    if (window.confirm(`¿Deseas habilitar la sucursal "${nombre}"?`)) {
      try {
        const { error } = await supabase
          .from('sucursales')
          .update({ estado: 'Activa' })
          .eq('id', id);

        if (error) throw error;
        cargarDatos();
      } catch (error) {
        console.error('Error activating sucursal:', error);
      }
    }
    setMenuAbierto(null);
  };

  const handleDelete = async (id: string, nombre: string) => {
    if (window.confirm(`¿Estás seguro que deseas ELIMINAR permanentemente la sucursal "${nombre}"?`)) {
      try {
        const { error } = await supabase
          .from('sucursales')
          .delete()
          .eq('id', id);

        if (error) throw error;
        cargarDatos();
      } catch (error) {
        console.error('Error deleting sucursal:', error);
      }
    }
    setMenuAbierto(null);
  };

  const handleSaveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const { error } = await supabase
        .from('sucursales')
        .update({
          nombre: formData.get('nombre'),
          direccion: formData.get('direccion'),
          telefono: formData.get('telefono'),
          horario: formData.get('horario'),
          comercio_id: formData.get('comercioId')
        })
        .eq('id', sucursalAEditar.id);

      if (error) throw error;
      cargarDatos();
      setSucursalAEditar(null);
    } catch (error) {
      console.error('Error updating sucursal:', error);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Sucursales Adheridas</h2>
          <p className="text-slate-500 text-sm">Registro centralizado de locales físicos y puntos de atención</p>
        </div>
        <div className="bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 text-center">
          <p className="text-[10px] font-black text-primary uppercase">Total Locales</p>
          <p className="text-xl font-bold text-primary">{listaSucursales.length}</p>
        </div>
      </div>

      <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por sucursal, comercio o dirección..."
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
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Sucursal</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Comercio Dueño</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Ubicación</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Contacto y Horario</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-20 text-center">
                  <Loader2 className="animate-spin text-primary mx-auto" size={32} />
                </td>
              </tr>
            ) : listaSucursales.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-20 text-center">
                  <div className="flex flex-col items-center space-y-3">
                    <Store size={40} className="text-slate-200" />
                    <p className="text-slate-400 italic text-sm">No se han registrado sucursales físicas aún.</p>
                  </div>
                </td>
              </tr>
            ) : (
              listaSucursales.map((suc) => (
                <tr key={suc.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">{suc.nombre}</div>
                    <div className="flex items-center gap-1 mt-1">
                      <span className={`w-1.5 h-1.5 rounded-full ${suc.estado === 'Activa' ? 'bg-green-500' : 'bg-slate-300'}`} />
                      <span className="text-[9px] text-slate-400 font-bold uppercase">{suc.estado}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-700">{suc.comercios?.nombre_fantasia}</span>
                      <span className="text-[10px] text-primary font-medium">{suc.comercios?.categoria}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-start gap-2 text-sm text-slate-600 max-w-xs">
                      <MapPin size={16} className="text-slate-400 mt-0.5 shrink-0" />
                      <span>{suc.direccion}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2 text-slate-700 font-medium">
                        <Phone size={14} className="text-green-500" /> {suc.telefono}
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock size={14} className="text-amber-500" /> {suc.horario}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuAbierto(menuAbierto === suc.id ? null : suc.id);
                      }}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {menuAbierto === suc.id && (
                      <div className="absolute right-0 top-12 w-40 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => {
                            setSucursalParaQR(suc);
                            setMenuAbierto(null);
                          }}
                          className="w-full flex items-center gap-2 p-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                        >
                          <QrCode size={16} /> Ver Código QR
                        </button>
                        <button onClick={() => { setSucursalAEditar(suc); setMenuAbierto(null); }} className="w-full flex items-center gap-2 p-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors border-t border-slate-100">
                          <Edit size={16} /> Editar
                        </button>
                        {suc.estado !== 'Activa' ? (
                          <button onClick={() => handleActivate(suc.id, suc.nombre)} className="w-full flex items-center gap-2 p-3 text-sm text-green-600 hover:bg-green-50 transition-colors">
                            <CheckCircle2 size={16} /> Habilitar
                          </button>
                        ) : (
                          <button onClick={() => handleInactivate(suc.id, suc.nombre)} className="w-full flex items-center gap-2 p-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                            <XCircle size={16} /> Inactivar
                          </button>
                        )}
                        <button onClick={() => handleDelete(suc.id, suc.nombre)} className="w-full flex items-center gap-2 p-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100">
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

      {sucursalAEditar && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-white/20">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">Editar Sucursal</h3>
              <p className="text-sm text-slate-500">Modifica los detalles operativos de la sede</p>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre Sucursal</label>
                  <input name="nombre" defaultValue={sucursalAEditar.nombre} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Comercio Dueño</label>
                  <select name="comercioId" defaultValue={sucursalAEditar.comercio_id} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none">
                    {comerciosDisponibles.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre_fantasia}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ubicación / Dirección</label>
                <input name="direccion" defaultValue={sucursalAEditar.direccion} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Teléfono</label>
                  <input name="telefono" defaultValue={sucursalAEditar.telefono} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Horario</label>
                  <input name="horario" defaultValue={sucursalAEditar.horario} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-6">
                <button type="submit" className="flex-1 bg-primary text-white py-3 rounded-xl font-bold hover:bg-blue-800 transition-all">Guardar Cambios</button>
                <button type="button" onClick={() => setSucursalAEditar(null)} className="px-6 text-slate-500 font-medium hover:bg-slate-100 rounded-xl transition-all">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DE VISUALIZACIÓN DE QR */}
      {sucursalParaQR && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-sm shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in duration-300">
            <div className="p-8 space-y-8 text-center">
              <div className="flex justify-between items-start">
                <div className="text-left space-y-1">
                  <h3 className="text-xl font-black text-slate-900 leading-tight tracking-tighter">IDENTIDAD DIGITAL</h3>
                  <p className="text-[10px] text-primary font-black uppercase tracking-widest">Padre Hurtado</p>
                </div>
                <button
                  onClick={() => setSucursalParaQR(null)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Diseño tipo Cartel Municipal */}
              <div className="space-y-4">
                <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-blue-900/20">
                  <Store size={40} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-2xl font-black text-slate-900 uppercase leading-none">{sucursalParaQR.nombre}</h4>
                  <p className="text-sm font-bold text-slate-400 italic">{sucursalParaQR.comercios?.nombre_fantasia}</p>
                </div>
              </div>

              {/* QR CODE PREMIUM PERSONALIZADO */}
              <div className="bg-slate-50 p-6 rounded-[2.5rem] border-4 border-white shadow-inner inline-block mx-auto relative group">
                <div className="absolute inset-0 bg-primary/5 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity" />
                <QRCode
                  value={`miph-app://beneficios?target=${encodeURIComponent(sucursalParaQR.comercios?.nombre_fantasia || sucursalParaQR.nombre)}&sucursal=${encodeURIComponent(sucursalParaQR.nombre)}`}
                  size={200}
                  fgColor="#1e3a8a" // Azul institucional en el código
                  level="H" // Mayor nivel de corrección de errores
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => window.print()}
                  className="w-full flex items-center justify-center gap-3 bg-primary text-white py-4 rounded-2xl font-black text-sm hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/20 uppercase tracking-widest"
                >
                  <Printer size={18} /> Imprimir Cartel
                </button>
                <button
                  onClick={() => alert('Generando archivo para descarga...')}
                  className="w-full flex items-center justify-center gap-3 border-2 border-slate-100 text-slate-600 py-3 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all"
                >
                  <Download size={18} /> Descargar Imagen
                </button>
              </div>

              <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-tighter">
                Escanea con tu App Mi Padre Hurtado para validar beneficios
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
