import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // 👈 esta línea permite certificados autofirmados
  },
});

transporter.sendMail({
  from: `"Test Formulario" <${process.env.EMAIL_USER}>`,
  to: process.env.DEFAULT_RECEIVER,
  subject: "🎉 ¡Prueba de correo exitosa!",
  html: `<p>Esto es una prueba del servidor de correos.</p>`,
})
.then(() => console.log("✅ Correo enviado con éxito"))
.catch((err) => console.error("❌ Error al enviar correo:", err));
