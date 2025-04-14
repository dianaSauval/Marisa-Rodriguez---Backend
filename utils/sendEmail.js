// utils/sendEmail.js
import nodemailer from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_USER || !EMAIL_PASS) {
  throw new Error("❌ Faltan EMAIL_USER o EMAIL_PASS en las variables de entorno.");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // 👈 ESTA LÍNEA ES LA CLAVE
  },
});

export const sendRecoveryEmail = async (to, token) => {
  const recoveryLink = `http://localhost:5173/reset-password/${token}`; // Cambiar en producción

  const html = `
    <div style="background-color:#2e1a3d;padding:30px 20px;font-family:sans-serif;text-align:center;color:#fefefe">
      <h2 style="color:#f6c16d;">¿Olvidaste tu contraseña?</h2>
      <p style="margin-bottom: 16px;">Hacé clic en el botón para generar una nueva contraseña:</p>
      <a href="${recoveryLink}" style="display:inline-block;padding:12px 24px;background-color:#e67cbf;color:#fff;text-decoration:none;font-weight:bold;border-radius:8px;font-size:1rem">
        Recuperar contraseña
      </a>
      <p style="font-size:0.9rem;margin-top:20px;color:#e3cde6;">Si no solicitaste este cambio, ignorá este mensaje.</p>
      <p style="font-size:0.8rem;margin-top:30px;">Marisa Rodríguez - Todos los derechos reservados</p>
    </div>
  `;

  try {
    console.log("✉️ Enviando email de recuperación a:", to);

    await transporter.sendMail({
      from: `"Marisa Rodríguez" <${EMAIL_USER}>`,
      to,
      subject: "Recuperá tu contraseña - Marisa Rodríguez",
      html,
    });

    console.log("✅ Email enviado correctamente.");
  } catch (error) {
    console.error("🚨 Error al enviar el correo:", error.message);
    throw new Error("No se pudo enviar el correo de recuperación.");
  }
};
