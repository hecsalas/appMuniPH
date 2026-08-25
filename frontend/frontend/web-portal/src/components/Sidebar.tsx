"use client";
import React from 'react';
import { Home, Store, FileText, Handshake, MapPin, ChartColumn, Settings, LogOut, CheckCircle2, UserCog, Ticket, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isSocio = pathname?.startsWith('/socio');

  const handleLogout = () => {
    const sessionKey = isSocio ? 'miph_comercio_session' : 'miph_municipal_session';
    localStorage.removeItem(sessionKey);
    router.push(isSocio ? '/socio/login' : '/admin/login');
  };

  const adminItems = [
    { icon: <Home size={20} />, label: 'Dashboard', href: '/admin' },
    { icon: <Store size={20} />, label: 'Comercios', href: '/admin/comercios' },
    { icon: <FileText size={20} />, label: 'Contratos', href: '/admin/contratos' },
    { icon: <Handshake size={20} />, label: 'Convenios', href: '/admin/convenios' },
    { icon: <CheckCircle2 size={20} />, label: 'Aprobar Convenio', href: '/admin/aprobar-convenio' },
    { icon: <UserCog size={20} />, label: 'Administradores', href: '/admin/administradores' },
    { icon: <MapPin size={20} />, label: 'Sucursales', href: '/admin/sucursales' },
    { icon: <ChartColumn size={20} />, label: 'Reportes', href: '/admin/reportes' },
  ];

  const socioItems = [
    { icon: <Ticket size={20} />, label: 'Monitor Canjes', href: '/socio/canjes' },
    { icon: <TrendingUp size={20} />, label: 'Estadísticas', href: '/socio/reportes' },
    { icon: <Handshake size={20} />, label: 'Mis Convenios', href: '/socio/convenios' },
  ];

  const menuItems = isSocio ? socioItems : adminItems;

  return (
    <aside className="w-64 h-screen bg-primary text-white flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-xl font-bold tracking-tight uppercase">Mi Padre Hurtado</h1>
        <p className="text-xs text-white/60">
          {isSocio ? 'Portal del Socio' : 'Portal de Funcionario'}
        </p>
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
        <Link href={isSocio ? "/socio/configuracion" : "/admin/configuracion"} className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-white/10 transition-colors text-white/80 text-left">
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
