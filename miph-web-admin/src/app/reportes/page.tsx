"use client";

import React from 'react';
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
  ArrowRight
} from 'lucide-react';

export default function ReportesPage() {
  // Datos simulados para el reporte
  const stats = [
    {
      title: "Total Canjes",
      value: "4,285",
      trend: "+12.5%",
      isUp: true,
      icon: <CreditCard className="text-blue-600" />,
      color: "bg-blue-50"
    },
    {
      title: "Ahorro Comunal",
      value: "$12.4M",
      trend: "+8.2%",
      isUp: true,
      icon: <Award className="text-green-600" />,
      color: "bg-green-50"
    },
    {
      title: "Vecinos Activos",
      value: "12,840",
      trend: "+24.3%",
      isUp: true,
      icon: <Users className="text-purple-600" />,
      color: "bg-purple-50"
    },
    {
      title: "Nuevos Comercios",
      value: "8",
      trend: "-2.1%",
      isUp: false,
      icon: <Store className="text-orange-600" />,
      color: "bg-orange-50"
    },
  ];

  const topCategories = [
    { name: "Alimentos", percentage: 45, color: "bg-blue-500" },
    { name: "Salud", percentage: 30, color: "bg-green-500" },
    { name: "Mascotas", percentage: 15, color: "bg-orange-500" },
    { name: "Educación", percentage: 10, color: "bg-purple-500" },
  ];

  const recentActivity = [
    { id: 1, vecino: "Juan Perez", comercio: "Casa Guau", ahorro: "$2,500", fecha: "Hoy, 14:30" },
    { id: 2, vecino: "Maria Soto", comercio: "Clínica del Sol", ahorro: "$12,000", fecha: "Hoy, 12:15" },
    { id: 3, vecino: "Pedro Jara", comercio: "Panadería El Sol", ahorro: "$800", fecha: "Hoy, 09:45" },
    { id: 4, vecino: "Ana Lopez", comercio: "Otto Fritz", ahorro: "$5,400", fecha: "Ayer, 21:20" },
    { id: 5, vecino: "Carlos Ruiz", comercio: "Farmacia Ibiza", ahorro: "$3,200", fecha: "Ayer, 18:10" },
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {/* Cabecera */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Reportes y Estadísticas</h2>
          <p className="text-slate-500 text-sm">Análisis del impacto social y económico en Padre Hurtado</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
            <Calendar size={16} /> Últimos 30 días
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/10">
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
            {topCategories.map((cat, i) => (
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
          <h4 className="text-xl font-bold">Meta de Impacto Mensual</h4>
          <p className="text-blue-100 text-sm mt-1">Estamos al 85% del objetivo de ahorro vecinal para Agosto</p>
        </div>
        <div className="flex gap-8">
          <div className="text-center">
            <p className="text-3xl font-black">$12.4M</p>
            <p className="text-[10px] uppercase font-bold text-blue-200">Logrado</p>
          </div>
          <div className="h-12 w-px bg-white/20 hidden md:block" />
          <div className="text-center">
            <p className="text-3xl font-black text-white/50">$15.0M</p>
            <p className="text-[10px] uppercase font-bold text-blue-200">Objetivo</p>
          </div>
        </div>
      </div>
    </div>
  );
}
