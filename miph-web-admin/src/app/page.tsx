import StatCard from "@/components/StatCard";
import { Users, Store, AlertCircle, CheckCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="p-8 space-y-8">
      {/* Encabezado */}
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Panel de Control</h2>
          <p className="text-slate-500">Resumen general de la actividad comunal</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-400 uppercase">Hoy es</p>
          <p className="text-lg font-bold text-primary">Martes 11 de Agosto</p>
        </div>
      </header>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Vecinos Registrados"
          value="1,248"
          icon={<Users size={24} />}
          description="+12 nuevos esta semana"
        />
        <StatCard
          title="Comercios Activos"
          value="42"
          icon={<Store size={24} />}
          description="8 convenios por renovar"
        />
        <StatCard
          title="Reportes SOS"
          value="15"
          icon={<AlertCircle size={24} />}
          description="3 urgencias sin atender"
          color="bg-red-50/30"
        />
        <StatCard
          title="Canjes de Beneficios"
          value="312"
          icon={<CheckCircle size={24} />}
          description="Total acumulado del mes"
        />
      </div>

      {/* Sección Inferior - Tablas o Gráficos Simulados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Últimos Comercios Registrados */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Solicitudes Recientes de Comercio</h3>
          <div className="space-y-4">
            {[
              { name: "Panadería El Sol", date: "Hace 2h", status: "Pendiente" },
              { name: "Farmacia Ibiza", date: "Hace 5h", status: "Aprobado" },
              { name: "Ferretería Central", date: "Ayer", status: "Aprobado" },
              { name: "Botillería PH", date: "Ayer", status: "Rechazado" },
            ].map((item, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div>
                  <p className="font-bold text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.date}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  item.status === 'Aprobado' ? 'bg-green-100 text-green-700' :
                  item.status === 'Pendiente' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {item.status}
                </span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm font-bold text-primary hover:bg-slate-50 rounded-lg transition-colors border border-dashed border-slate-200">
            Ver todas las solicitudes
          </button>
        </div>

        {/* Alertas de Seguridad */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Alertas SOS en Curso</h3>
          <div className="space-y-4">
            {[
              { type: "Luminaria apagada", location: "Villa Los Silos", priority: "Baja" },
              { type: "Basura acumulada", location: "Av. San Ignacio", priority: "Media" },
              { type: "Microbasural", location: "Cmo. Melipilla", priority: "Alta" },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start p-3 rounded-lg border border-slate-50">
                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                  item.priority === 'Alta' ? 'bg-red-500' :
                  item.priority === 'Media' ? 'bg-orange-500' :
                  'bg-blue-500'
                }`} />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="font-bold text-slate-800 text-sm">{item.type}</p>
                    <span className="text-[10px] text-slate-400 font-medium uppercase">{item.priority}</span>
                  </div>
                  <p className="text-xs text-slate-500">{item.location}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">
            Ir al mapa de incidencias
          </button>
        </div>
      </div>
    </div>
  );
}
