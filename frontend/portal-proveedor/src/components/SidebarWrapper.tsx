"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    const session = localStorage.getItem('miph_comercio_session');

    if (!session && pathname !== '/login') {
      router.push('/login');
      setIsAuth(false);
    } else {
      setIsAuth(true);
    }
  }, [pathname, router]);

  if (pathname === '/login') return <>{children}</>;
  if (isAuth === null) return null; // Evitar parpadeo

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <main className="flex-1 ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}
