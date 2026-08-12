"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Download, Printer, QrCode, ChevronRight } from 'lucide-react';
import QRCode from 'react-qr-code';

export default function GeneracionQRPage() {
  const router = useRouter();
  const [datos, setDatos] = useState<any>(null);
  const [sucursales, setSucursales] = useState<any[]>([]);

  useEffect(() => {
    const d = localStorage.getItem('miph_nuevo_comercio_borrador');
    const s = localStorage.getItem('miph_sucursales_borrador');

    if (d) setDatos(JSON.parse(d));
    if (s) setSucursales(JSON.parse(s));
  }, []);

  if (!datos) return <div className="p-20 text-center">Cargando sucursales...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <Link href="/comercios/nuevo/sucursales" className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-medium">
        <ArrowLeft size={16} />
        Volver a sucursales
      </Link>

      <div>
        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-black uppercase rounded-full tracking-wider">
          Paso 8: Identificadores Únicos
        </span>
        <h2 className="text-3xl font-bold text-slate-900 mt-4">Generación de QR por sucursal</h2>
        <p className="text-slate-500 text-sm">Cada local tiene su propio código para validar beneficios</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
        {sucursales.map((sucursal) => (
          <div key={sucursal.id} className="bg-white p-8 rounded-[3rem] border border-slate-200 shadow-xl flex flex-col items-center space-y-6 text-center animate-in zoom-in duration-300">
            <div className="space-y-4 w-full">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-white mx-auto shadow-lg shadow-blue-900/20">
                <QrCode size={32} />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900 uppercase leading-tight">{sucursal.nombre}</h3>
                <p className="text-xs text-slate-400 font-bold italic">{datos.nombre}</p>
              </div>
            </div>

            {/* QR CODE PREMIUM CON COLOR INSTITUCIONAL */}
            <div className="p-4 bg-slate-50 rounded-[2.5rem] border-4 border-white shadow-inner">
              <QRCode
                value={`miph-app://comercio/${sucursal.id}`}
                size={180}
                fgColor="#1e3a8a" // Azul institucional
                level="H"
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              />
            </div>

            <div className="flex gap-2 w-full">
              <button onClick={() => window.print()} className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-xs font-black text-slate-600 transition-colors uppercase tracking-widest">
                <Printer size={14} /> Imprimir
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-xs font-black text-slate-600 transition-colors uppercase tracking-widest">
                <Download size={14} /> Descargar
              </button>
            </div>

            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
              Identificador Único Municipal
            </p>
          </div>
        ))}
      </div>

      <div className="pt-10 flex justify-center">
        <button
          onClick={() => router.push('/comercios/nuevo/beneficios')}
          className="bg-primary text-white px-12 py-4 rounded-2xl font-black text-lg hover:bg-blue-800 transition-all shadow-xl shadow-blue-900/20 flex items-center gap-3 uppercase tracking-tighter"
        >
          Continuar a Registro de Beneficios <ChevronRight size={24} />
        </button>
      </div>
    </div>
  );
}
