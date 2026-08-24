"use client";
import React from 'react';
import { Home, Store, FileText, Handshake, MapPin, ChartColumn, Settings, LogOut, CheckCircle2, UserCog } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Sidebar = () => {
  const router = useRouter();

  const handleLogout = () => {
    // Limpiamos los datos de sesión (ajusta el nombre del key si usas otro)
    localStorage.removeItem('miph_municipal_session');
    router.push('/login');
  };

  const menuItems = [
    { icon: <Home size={20} />, label: 'Dashboard', href: '/' },
    { icon: <Store size={20} />, label: 'Comercios', href: '/comercios' },
    { icon: <FileText size={20} />, label: 'Contratos', href: '/contratos' },
    { icon: <Handshake size={20} />, label: 'Convenios', href: '/convenios' },
    { icon: <CheckCircle2 size={20} />, label: 'Aprobar Convenio', href: '/aprobar-convenio' },
    { icon: <UserCog size={20} />, label: 'Administradores', href: '/administradores' },
    { icon: <MapPin size={20} />, label: 'Sucursales', href: '/sucursales' },
    { icon: <ChartColumn size={20} />, label: 'Reportes', href: '/reportes' },
  ];

  return (
    <aside className="w-64 h-screen bg-primary text-white flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight uppercase">Mi Padre Hurtado</h1>
        <p className="text-xs text-white/60">Portal de Funcionario Municipal</p>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-4">
        {menuItems.map((item, index) => (
          <Link key={index} href={item.href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors">
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10 space-y-2">
        <Link href="/configuracion" className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/10 transition-colors text-white/80 text-left">
          <Settings size={20} />
          <span className="font-medium">Configuración</span>
        </Link>
        <button onClick={handleLogout} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-red-500/20 text-red-300 transition-colors text-left">
          <LogOut size={20} />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
