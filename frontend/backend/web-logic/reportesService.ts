import { supabase } from './supabase';
import * as XLSX from 'xlsx';

export const getColorForCategory = (cat: string) => {
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

export const fetchReportData = async () => {
  const { data, error } = await supabase
    .from('solicitudes_canje')
    .select(`
        *,
        comercios(nombre_fantasia, categoria),
        beneficios(titulo)
    `)
    .order('fecha_solicitud', { ascending: false });

  if (error) throw error;

  const totalCanjes = data.length;
  const aprobados = data.filter((d: any) => d.estado === 'Aprobado').length;
  const vecinosUnicos = new Set(data.map((d: any) => d.vecino_nombre)).size;
  const ahorroEstimado = aprobados * 3000;

  const catMap: any = {};
  data.forEach((d: any) => {
    const cat = d.comercios?.categoria || 'Otros';
    catMap[cat] = (catMap[cat] || 0) + 1;
  });

  const processedCats = Object.keys(catMap).map(key => ({
    name: key,
    percentage: totalCanjes > 0 ? Math.round((catMap[key] / totalCanjes) * 100) : 0,
    color: getColorForCategory(key)
  })).sort((a, b) => b.percentage - a.percentage);

  const stats = [
    { title: "Total Canjes", value: totalCanjes.toLocaleString(), trend: "+10%", isUp: true, color: "bg-blue-50" },
    { title: "Ahorro Comunal", value: `$${(ahorroEstimado / 1000000).toFixed(1)}M`, trend: "+5%", isUp: true, color: "bg-green-50" },
    { title: "Vecinos Activos", value: vecinosUnicos.toLocaleString(), trend: "+15%", isUp: true, color: "bg-purple-50" },
    { title: "Canjes Aprobados", value: aprobados.toLocaleString(), trend: "Real", isUp: true, color: "bg-orange-50" },
  ];

  const recentActivity = data.slice(0, 6).map((d: any) => ({
    id: d.id,
    vecino: d.vecino_nombre,
    comercio: d.comercios?.nombre_fantasia,
    ahorro: d.estado === 'Aprobado' ? "$3.000*" : "---",
    fecha: new Date(d.fecha_solicitud).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
    estado: d.estado
  }));

  return {
    stats,
    processedCats,
    recentActivity,
    ahorroEstimado
  };
};

export const exportToExcel = (data: any[]) => {
  const dataToExport = data.map(act => ({
    'Vecino': act.vecino,
    'Comercio': act.comercio,
    'Ahorro': act.ahorro,
    'Fecha': act.fecha,
    'Estado': act.estado
  }));

  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte Canjes");

  const columnWidths = [
    { wch: 30 }, { wch: 30 }, { wch: 15 }, { wch: 25 }, { wch: 15 },
  ];
  worksheet['!cols'] = columnWidths;

  XLSX.writeFile(workbook, "reporte_canjes_miph.xlsx");
};
