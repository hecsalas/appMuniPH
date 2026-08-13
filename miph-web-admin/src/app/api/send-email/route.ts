import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email, nombre, tempPass, activationLink } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'Mi Padre Hurtado <onboarding@resend.dev>', // Usamos el dominio de prueba de Resend por defecto
      to: [email],
      subject: '¡Bienvenido al Portal de Comercios Mi Padre Hurtado!',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 20px; overflow: hidden;">
          <div style="background-color: #1e3a8a; padding: 40px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">Mi Padre Hurtado</h1>
            <p style="opacity: 0.8; margin-top: 5px;">Portal de Comercio Adherido</p>
          </div>
          <div style="padding: 40px; color: #333; line-height: 1.6;">
            <h2 style="color: #1e3a8a;">¡Hola ${nombre}!</h2>
            <p>Nos complace informarle que su convenio de beneficios ha sido <strong>aprobado</strong> exitosamente por la Municipalidad de Padre Hurtado.</p>
            <p>Ya puede acceder al portal administrativo de su comercio para gestionar sus ofertas y sucursales utilizando las siguientes credenciales:</p>

            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 15px; padding: 25px; margin: 30px 0; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold;">Usuario (Email)</p>
              <p style="margin: 5px 0 20px 0; font-size: 18px; font-weight: bold; color: #1e3a8a;">${email}</p>

              <p style="margin: 0; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold;">Contraseña Temporal</p>
              <p style="margin: 5px 0; font-size: 24px; font-weight: bold; color: #16a34a; letter-spacing: 2px;">${tempPass}</p>
            </div>

            <div style="text-align: center; margin: 40px 0;">
              <a href="${activationLink}" style="background-color: #1e3a8a; color: white; padding: 18px 35px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;">ACTIVAR MI CUENTA AHORA</a>
            </div>

            <p style="font-size: 12px; color: #94a3b8; text-align: center; font-style: italic;">
              Este enlace de activación caduca en 48 horas. Se le solicitará establecer una nueva contraseña permanente en su primer ingreso.
            </p>
          </div>
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
            <p>© 2026 Municipalidad de Padre Hurtado. Todos los derechos reservados.</p>
          </div>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ message: 'Email enviado con éxito', data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
