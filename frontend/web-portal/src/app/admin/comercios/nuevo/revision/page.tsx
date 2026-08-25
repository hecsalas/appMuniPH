"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle2, XCircle, FileSearch, Info, Loader2, Mail, Copy, ExternalLink, ShieldAlert } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function RevisionPage() {
  const router = useRouter();
  const [datos, setDatos] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [credencialesGeneradas, setCredencialesGeneradas] = useState<any>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  useEffect(() => {
    const borrador = localStorage.getItem('miph_nuevo_comercio_borrador');
    if (borrador) setDatos(JSON.parse(borrador));
  }, []);

  const generarPasswordTemporal = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let pass = "PH-";
    for (let i = 0; i < 6; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const handleDecision = async (aprobado: boolean) => {
    setIsProcessing(true);
    try {
      if (aprobado) {
        const tempPass = generarPasswordTemporal();
        const activationLink = `https://miph.cl/activar-cuenta?token=${Math.random().toString(36).substring(7)}`;

        // 1. Actualizar estado del comercio
        if (datos.id && datos.id !== 'Nuevo') {
          const { error } = await supabase
            .from('comercios')
            .update({ estado: 'Vigente' })
            .eq('id', datos.id);
          if (error) throw error;
        }

        // 2. Registrar/Actualizar Administrador en Supabase
        const { error: errAdmin } = await supabase.from('administradores_comercios').upsert({
          rut: datos.rutRepresentante,
          nombre: datos.representante,
          email: datos.email,
          comercio_id: datos.id !== 'Nuevo' ? datos.id : null,
          estado: 'Pendiente',
          password_temporal: tempPass,
          enlace_activacion: activationLink
        }, { onConflict: 'rut' });

        if (errAdmin) throw errAdmin;

        // 3. Sincronizar con LocalStorage para la página de confirmación
        const adminsActuales = JSON.parse(localStorage.getItem('miph_administradores_db') || '[]');
        const nuevoAdminLocal = {
          id: Date.now(),
          rut: datos.rutRepresentante,
          nombre: datos.representante,
          email: datos.email,
          comercioId: datos.id || 'Nuevo',
          comercioNombre: datos.nombre,
          estado: 'Pendiente primer acceso',
          fechaCreacion: new Date().toISOString()
        };
        localStorage.setItem('miph_administradores_db', JSON.stringify([...adminsActuales, nuevoAdminLocal]));

        // Guardar como administrador ACTIVO para evitar desincronización en la siguiente pantalla
        localStorage.setItem('miph_current_active_admin', JSON.stringify(nuevoAdminLocal));

        // 4. ENVIAR EMAIL REAL VIA API
        setIsSendingEmail(true);
        try {
          const res = await fetch('/admin/api/send-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: datos.email,
              nombre: datos.representante,
              tempPass: tempPass,
              activationLink: activationLink
            })
          });

          if (!res.ok) {
            const errorData = await res.json();
            console.error("Detalle error email:", errorData);
            throw new Error(errorData.error?.message || 'Error al enviar email');
          }

          console.log("Email enviado satisfactoriamente");
        } catch (e: any) {
          console.error("Fallo envío de email:", e);
          alert(`El convenio se aprobó, pero el correo falló: ${e.message}\n\nRECUERDA: Si usas el dominio gratuito de Resend, solo puedes enviarte correos a TI MISMO.`);
        } finally {
          setIsSendingEmail(false);
        }

        setCredencialesGeneradas({
          email: datos.email,
          pass: tempPass,
          link: activationLink
        });

        setShowEmailModal(true);
      } else {
        const motivo = window.prompt("Indique el motivo del rechazo:");
        if (motivo) {
          if (datos.id && datos.id !== 'Nuevo') {
            await supabase.from('comercios').update({ estado: 'Rechazado' }).eq('id', datos.id);
          }
          alert("Comercio rechazado. Se notificará al proveedor.");
          router.push('/admin/comercios');
        }
      }
    } catch (error) {
      console.error("Error en decisión:", error);
      alert("Hubo un error al procesar la solicitud.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!datos) return <div className="p-20 text-center text-slate-400 italic">Cargando antecedentes del comercio...</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-6">
      {/* MODAL DE VISTA PREVIA DE EMAIL (POST-APROBACIÓN) */}
      {showEmailModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in duration-300">
            <div className="bg-primary p-8 text-white flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter">Notificación Enviada</h3>
                  <p className="text-xs text-white/70">Credenciales de activación generadas con éxito</p>
                </div>
              </div>
              <ShieldAlert size={32} className="text-white/30" />
            </div>

            <div className="p-10 space-y-8">
              <div className="space-y-4">
                <p className="text-sm text-slate-500 font-medium">
                  {isSendingEmail ? (
                    <span className="flex items-center gap-2 text-primary font-bold">
                      <Loader2 className="animate-spin" size={16} /> Enviando correo real a la bandeja...
                    </span>
                  ) : (
                    <>El siguiente mensaje ha sido enviado a <span className="font-bold text-slate-900">{credencialesGeneradas?.email}</span>:</>
                  )}
                </p>

                <div className="bg-slate-50 rounded-3xl border border-slate-100 p-8 space-y-6">
                   <div className="space-y-1">
                      <h4 className="text-xl font-bold text-slate-800">¡Bienvenido al Portal de Comercios PH!</h4>
                      <p className="text-sm text-slate-500">Su convenio ha sido aprobado por la Municipalidad.</p>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
                         <p className="text-[10px] font-black text-slate-400 uppercase">Usuario / Email</p>
                         <p className="text-sm font-bold text-primary">{credencialesGeneradas?.email}</p>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
                         <p className="text-[10px] font-black text-slate-400 uppercase">Contraseña Temporal</p>
                         <p className="text-sm font-mono font-black text-secondary">{credencialesGeneradas?.pass}</p>
                      </div>
                   </div>

                   <div className="bg-blue-600 p-4 rounded-2xl text-center">
                      <p className="text-white text-sm font-black uppercase tracking-widest">ACTIVAR MI CUENTA AHORA</p>
                   </div>

                   <p className="text-[10px] text-slate-400 text-center italic">
                     Este enlace caduca en 48 horas. Se le solicitará cambiar su contraseña al primer ingreso.
                   </p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => router.push('/admin/comercios/nuevo/administrador')}
                  className="flex-1 bg-slate-900 text-white py-5 rounded-2xl font-black text-sm hover:bg-black transition-all shadow-xl shadow-slate-900/20 uppercase tracking-widest"
                >
                  Continuar con Registro
                </button>
                <button
                  onClick={() => alert('Copiado al portapapeles')}
                  className="px-8 flex items-center justify-center gap-2 border-2 border-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-50 transition-all"
                >
                  <Copy size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase rounded-full tracking-wider">
            Estado: Pendiente de revisión
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">Revisión de Antecedentes</h2>
          <p className="text-slate-500 text-sm">Confirma que la información y los documentos coincidan con el decreto</p>
        </div>
        <FileSearch size={40} className="text-slate-300" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUMNA IZQUIERDA: RESUMEN */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest">Resumen del Comercio</h3>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">Razón Social</p>
                <p className="font-bold text-slate-800">{datos.razonSocial}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase">RUT Empresa</p>
                <p className="font-bold text-slate-800">{datos.rut}</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Representante Legal</p>
                <p className="font-bold text-slate-800">{datos.representante} (RUT: {datos.rutRepresentante})</p>
              </div>
              <div className="col-span-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Dirección Principal</p>
                <p className="text-sm text-slate-600">{datos.direccion}</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex gap-4">
            <Info className="text-blue-500 shrink-0" />
            <p className="text-xs text-blue-800 leading-relaxed">
              Verifique que el archivo PDF adjunto en el paso anterior sea legible y contenga las firmas correspondientes de la municipalidad y el representante legal.
            </p>
          </div>
        </div>

        {/* COLUMNA DERECHA: DECISIÓN */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Observaciones</h3>
            <textarea
              placeholder="Escriba observaciones si es necesario..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm h-32 focus:ring-2 focus:ring-primary/20 outline-none"
            />

            <div className="space-y-3 pt-4">
              <button
                onClick={() => handleDecision(true)}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 bg-secondary text-white py-4 rounded-xl font-black hover:bg-green-700 transition-all shadow-lg shadow-green-900/20 disabled:bg-slate-200"
              >
                {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                APROBAR CONVENIO
              </button>

              <button
                onClick={() => handleDecision(false)}
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-2 border-2 border-red-100 text-red-500 py-4 rounded-xl font-bold hover:bg-red-50 transition-all disabled:text-slate-300 disabled:border-slate-100"
              >
                <XCircle size={20} />
                RECHAZAR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}