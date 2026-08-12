"use client";

import React, { useEffect, useState } from 'react';
import { Search, FileText, FileDown, Eye, Calendar, Loader2, MoreHorizontal, Edit, Trash2, XCircle, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ContratosPage() {
  const [contratos, setContratos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoadingFile, setIsLoadingFile] = useState<string | null>(null);
  const [menuAbierto, setMenuAbierto] = useState<string | null>(null);
  const [contratoAEditar, setContratoAEditar] = useState<any | null>(null);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('comercios')
        .select('*')
        .order('fecha_registro', { ascending: false });

      if (error) throw error;
      setContratos(data || []);
    } catch (error) {
      console.error('Error loading contracts:', error);
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

  const handleActivateContract = async (id: string, nombre: string) => {
    if (window.confirm(`¿Deseas habilitar el convenio de "${nombre}"?`)) {
      try {
        const { error } = await supabase.from('comercios').update({ estado: 'Vigente' }).eq('id', id);
        if (error) throw error;
        cargarDatos();
      } catch (error) {
        console.error('Error activating contract:', error);
      }
    }
    setMenuAbierto(null);
  };

  const handleInactivateContract = async (id: string, nombre: string) => {
    if (window.confirm(`¿Estás seguro que deseas INACTIVAR el convenio de "${nombre}"? El estado del comercio pasará a Vencido.`)) {
      try {
        const { error } = await supabase.from('comercios').update({ estado: 'Vencido' }).eq('id', id);
        if (error) throw error;
        cargarDatos();
      } catch (error) {
        console.error('Error inactivating contract:', error);
      }
    }
    setMenuAbierto(null);
  };

  const handleDeleteContract = async (id: string, nombre: string) => {
    if (window.confirm(`¿Estás seguro que deseas ELIMINAR permanentemente a "${nombre}" y toda su documentación?`)) {
      try {
        const { error } = await supabase.from('comercios').delete().eq('id', id);
        if (error) throw error;
        cargarDatos();
      } catch (error) {
        console.error('Error deleting contract:', error);
        alert("No se pudo eliminar el registro.");
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
          decreto_numero: formData.get('decreto'),
          fecha_inicio: formData.get('fechaInicio'),
          fecha_termino: formData.get('fechaTermino'),
        })
        .eq('id', contratoAEditar.id);

      if (error) throw error;
      cargarDatos();
      setContratoAEditar(null);
    } catch (error) {
      console.error('Error updating contract:', error);
    }
  };

  const handleViewPDF = (url: string) => {
    if (!url) {
      alert("No hay un archivo PDF asociado a este contrato.");
      return;
    }
    window.open(url, '_blank');
  };

  const handleDownloadPDF = async (url: string, filename: string) => {
    if (!url) {
      alert("Archivo no disponible.");
      return;
    }

    setIsLoadingFile(url);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename || 'Contrato.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download error:', error);
    } finally {
      setIsLoadingFile(null);
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Inventario de Contratos</h2>
          <p className="text-slate-500 text-sm">Registro oficial de decretos y convenios municipales</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100 text-center">
            <p className="text-[10px] font-black text-blue-400 uppercase">Vigentes</p>
            <p className="text-xl font-bold text-blue-700">{contratos.filter(c => c.estado === 'Vigente').length}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-4 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por número de decreto o comercio..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-visible">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">N° Decreto</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Comercio Asociado</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Vigencia</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Estado</th>
              <th className="p-4 text-xs font-bold text-slate-500 uppercase">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-20 text-center">
                  <Loader2 className="animate-spin text-primary mx-auto" size={32} />
                </td>
              </tr>
            ) : contratos.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-10 text-center text-slate-400 italic">No hay contratos registrados.</td>
              </tr>
            ) : (
              contratos.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-mono text-sm font-bold text-primary">{item.decreto_numero || 'S/N'}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-slate-300" />
                      <div>
                        <div className="font-medium text-slate-700">{item.nombre_fantasia}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">RUT: {item.rut}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} /> {item.fecha_inicio} - {item.fecha_termino}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                      item.estado === 'Vigente' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.estado}
                    </span>
                  </td>
                  <td className="p-4 relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuAbierto(menuAbierto === item.id ? null : item.id);
                      }}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                    >
                      <MoreHorizontal size={20} />
                    </button>

                    {menuAbierto === item.id && (
                      <div className="absolute right-0 top-12 w-48 bg-white border border-slate-200 rounded-xl shadow-2xl z-[100] overflow-hidden" onClick={e => e.stopPropagation()}>
                        <button onClick={() => handleViewPDF(item.archivo_url)} className="w-full flex items-center gap-2 p-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                          <Eye size={16} /> Visualizar
                        </button>
                        <button onClick={() => handleDownloadPDF(item.archivo_url, `Contrato_${item.nombre_fantasia}.pdf`)} className="w-full flex items-center gap-2 p-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                          {isLoadingFile === item.archivo_url ? <Loader2 className="animate-spin" size={16} /> : <FileDown size={16} />}
                          Descargar
                        </button>
                        <button onClick={() => { setContratoAEditar(item); setMenuAbierto(null); }} className="w-full flex items-center gap-2 p-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors border-t border-slate-100">
                          <Edit size={16} /> Editar Contrato
                        </button>
                        {item.estado !== 'Vigente' ? (
                          <button onClick={() => handleActivateContract(item.id, item.nombre_fantasia)} className="w-full flex items-center gap-2 p-3 text-sm text-green-600 hover:bg-green-50 transition-colors">
                            <CheckCircle2 size={16} /> Habilitar
                          </button>
                        ) : (
                          <button onClick={() => handleInactivateContract(item.id, item.nombre_fantasia)} className="w-full flex items-center gap-2 p-3 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                            <XCircle size={16} /> Inactivar
                          </button>
                        )}
                        <button onClick={() => handleDeleteContract(item.id, item.nombre_fantasia)} className="w-full flex items-center gap-2 p-3 text-sm text-red-600 hover:bg-red-50 transition-colors border-t border-slate-100">
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

      {contratoAEditar && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[150] p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-white/20">
            <div className="p-6 border-b border-slate-100 text-center">
              <h3 className="text-xl font-bold text-slate-900">Editar Datos Legales</h3>
              <p className="text-sm text-slate-500">{contratoAEditar.nombre_fantasia}</p>
            </div>
            <form onSubmit={handleSaveEdit} className="p-8 space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left block">N° de Decreto</label>
                <input name="decreto" defaultValue={contratoAEditar.decreto_numero} required className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 font-mono text-primary font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left block">Fecha Inicio</label>
                  <input name="fechaInicio" type="date" defaultValue={contratoAEditar.fecha_inicio} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left block">Fecha Término</label>
                  <input name="fechaTermino" type="date" defaultValue={contratoAEditar.fecha_termino} required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-xs" />
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="submit" className="flex-1 bg-primary text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-all shadow-lg shadow-blue-900/10">Guardar Cambios</button>
                <button type="button" onClick={() => setContratoAEditar(null)} className="px-6 text-slate-500 font-medium hover:bg-slate-100 rounded-xl transition-all">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
