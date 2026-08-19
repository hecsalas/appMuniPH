"use client";

import React, {useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Store,
  CreditCard,
  Award,
  Calendar,
  Download,
  Filter,
  ArrowRight,
  Loader2
} from 'lucide-react';

export default function ReportesPage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [impacto, setImpacto] = useState({ logrado: 0, meta: 15000000 });

    useEffect(() => {
        fetchReportData();
        }, []);

    const fetchReportData = async () => {
    setLoading(true);
    try {
        const { data, error } = await supabase
        .from('solicitudes_canje')
        .select(`
            *,
            comercios(nombre_fantasia, categoria),
            beneficios(titulo)
            `)
            .order('fecha_solicitud', { ascending: false});

            if (error) throw error;

            const totalCanjes = data.length;
            const aprobados = data.filter(d => d.estado === 'Aprobado').length;
            const vecinosUnicos = new Set(data.map(d => d.vecino_nombre)).size;

            const ahorroEstimado = aprobados * 3000;

            const catMap: any = {};
            data.forEach(d => {
                const cat = d.comercios?.categoria || 'Otros';
                catMap[cat] = (catMap[cat] || 0) + 1;
                });

            const processedCats = Object.keys(catMap).map(key => ({
                name: key,
                percentage: totalCanjes > 0 ? Math.round((catMap[key] / totalCanjes) * 100) : 0,
                color: getColorForCategory(key)
                })).sort((a, b) => b.percentage - a.percentage);

            setStats([
                { title: "Total Canjes", value: totalCanjes.toLocaleString(), trend: "+10%", isUp: true, icon: <CreditCard className="text-blue-600" />, color:"bg-blue-50"},
                { title: "Ahorro Comunal", value: `$${(ahorroEstimado / 1000000).toFixed(1)}M`, trend: "+5%", isUp: true, icon: <Award className="text-green-600" />, color: "bg-green-50" },
                { title: "Vecinos Activos", value: vecinosUnicos.toLocaleString(), trend: "+15%", isUp: true, icon: <Users className="text-purple-600" />, color: "bg-purple-50" },
                { title: "Canjes Aprobados", value: aprobados.toLocaleString(), trend: "Real", isUp: true, icon: <Store className="text-orange-600" />, color: "bg-orange-50" },
              ]);

            setCategories(processedCats);
            setRecentActivity(data.slice(0, 6).map(d=> ({
                id:d.id,
                vecino: d.vecino_nombre,
                comercio: d.comercios?.nombre_fantasia,
                ahorro: d.estado === 'Aprobado' ? "$3.000*" : "---",
                fecha: new Date(d.fecha_solicitud).toLocaleDateString('es-CL', {day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
                estado: d.estado
                })));
            setImpacto(prev => ({ ...prev, logrado: ahorroEstimado }));

            } catch (e) {
                console.error("Error en reportes:", e);
                } finally {
                    setLoading(false);
                    }
                };

                        const exportToCSV = () => {
                            const headers = ["Vecino,Comercio,Ahorro,Fecha,Estado\n"];
                            const rows = recentActivity.map(act =>
                                `${act.vecino},${act.comercio},${act.ahorro},${act.fecha},${act.estado}\n`
                                );
                            const blob = new Blob([headers + rows.join("")], { type: 'text/csv'});
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.setAttribute('hidden', '');
                            a.setAttribute('href', url);
                            a.setAttribute('download', 'reporte_canjes.csv');
                            document.body.appendChild(a);
                            a.click();
                            document.body.removeChild(a);
                            };


            const getColorForCategory = (cat: string) => {
    const colors: any = {
      'Alimentos': 'bg-blue-500',
      'Salud': 'bg-green-500',
      'Mascotas': 'bg-orange-500',
      'Educación': 'bg-purple-500',
      'Deporte': 'bg-teal-500',
      'Entretenimiento': 'bg-cyan-500',
      'Bebidas': 'bg-indigo-500',
      'Servicios': 'bg-slate-500',
    };
    return colors[cat] || 'bg-slate-400';
  };

            if(loading) return (
                <div className="h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={48} />
                </div>
                );

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Cabecera */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reportes y Estadísticas</h2>
          <p className="text-slate-500 text-sm">Análisis del impacto social y económico en Padre Hurtado</p>
        </div>
        <div className="flex gap-3">
          <button onClick={fetchReportData} className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Calendar size={16} /> Actualizar
          </button>
            <button onClick={exportToCSV} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/10">
            <Download size={16} /> Exportar Excel
            </button>
        </div>
      </div>

      {/* Grid de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                {stat.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-black ${stat.isUp ? 'text-green-600' : 'text-red-500'}`}>
                {stat.isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {stat.trend}
              </div>
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Gráfico de Categorías */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Uso por Categoría</h3>
            <Filter size={18} className="text-slate-300" />
          </div>
          <div className="space-y-5">
            {categories.map((cat, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-700">{cat.name}</span>
                  <span className="font-black text-slate-400">{cat.percentage}%</span>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${cat.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-50">
            <p className="text-xs text-slate-400 leading-relaxed italic text-center">
              "La categoría de alimentos lidera el uso de beneficios este mes"
            </p>
          </div>
        </div>

        {/* Tabla de Actividad Reciente */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-900">Últimos Canjes Realizados</h3>
            <button className="text-primary text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-1">
              Ver todos <ArrowRight size={14} />
            </button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
              <tr>
                <th className="p-4">Vecino</th>
                <th className="p-4">Comercio</th>
                <th className="p-4">Ahorro</th>
                <th className="p-4">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {recentActivity.map((act) => (
                <tr key={act.id} className="text-sm hover:bg-slate-50/30 transition-colors">
                  <td className="p-4 font-bold text-slate-800">{act.vecino}</td>
                  <td className="p-4 text-slate-600">{act.comercio}</td>
                  <td className="p-4 font-black text-green-600">{act.ahorro}</td>
                  <td className="p-4 text-slate-400 text-xs">{act.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentActivity.length === 0 && (
            <div className="p-10 text-center text-slate-400 italic">No hay actividad registrada hoy.</div>
          )}
        </div>
      </div>

      {/* Banner de Impacto */}
      <div className="bg-gradient-to-r from-primary to-blue-600 p-8 rounded-3xl text-white flex flex-col md:flex-row justify-between items-center gap-6 shadow-xl shadow-blue-900/20">
        <div>
          <h4 className="text-xl font-bold">Impacto Comunal Real</h4>
          <p className="text-blue-100 text-sm mt-1">
          Meta del mes: ${(impacto.meta / 1000000).toFixed(1)}M
          </p>
        </div>
        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-3xl font-black">${(impacto.logrado / 1000000).toFixed(1)}M</p>
            <p className="text-[10px] uppercase font-bold text-blue-200">Logrado</p>
          </div>
          <div className="h-12 w-px bg-white/20 hidden md:block" />
          <div className="text-center">
          {/* Cálculo de porcentaje dinámico */}
            <p className="text-3xl font-black text-white/50">{Math.round((impacto.logrado / impacto.meta) * 100)}%</p>
            <p className="text-[10px] uppercase font-bold text-blue-200">Progreso</p>
          </div>
        </div>
      </div>
    </div>
  );
}
