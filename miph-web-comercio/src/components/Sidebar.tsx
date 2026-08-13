"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, MonitorPlay, Handshake, BarChart3, LogOut, Store } from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Inicio', href: '/' },
    { icon: <MonitorPlay size={20} />, label: 'Monitor de Canjes', href: '/canjes' },
    { icon: <Handshake size={20} />, label: 'Mis Convenios', href: '/convenios' },
    { icon: <BarChart3 size={20} />, label: 'Estadísticas', href: '/reportes' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('miph_comercio_session');
    router.push('/login');
  };

  return (
    <aside className="w-64 h-screen bg-slate-900 text-white flex flex-col fixed left-0 top-0 z-50">
      <div className="p-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl">
            <Store size={24} />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tighter uppercase leading-none">MiPH</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Socio Adherido</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2 mt-6">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 p-4 rounded-2xl transition-all ${
                isActive
                ? 'bg-primary text-white shadow-lg shadow-blue-900/40'
                : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-bold text-sm uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full p-4 rounded-2xl text-red-400 hover:bg-red-500/10 transition-colors font-bold uppercase tracking-wider text-xs"
        >
          <LogOut size={20} />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
