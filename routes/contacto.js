import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

router.post("/", async (req, res) => {
  const { nombre, email, mensaje } = req.body;

  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ error: "Faltan datos obligatorios." });
  }

  try {
    await transporter.sendMail({
      from: `"Formulario Web" <${process.env.EMAIL_USER}>`,
      to: process.env.DEFAULT_RECEIVER,
      subject: "📩 Nuevo mensaje desde el sitio",
      html: `
        <p><strong>Nombre:</strong> ${nombre}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong><br/>${mensaje}</p>
      `,
    });

    res.status(200).json({ mensaje: "Mensaje enviado correctamente." });
  } catch (error) {
    console.error("❌ Error al enviar:", error);
    res.status(500).json({ error: "Ocurrió un error al enviar el mensaje." });
  }
});

export default router;
