import crypto from "crypto";
import bcrypt from "bcrypt";
import Usuario from "../models/Usuario.js";
import { sendRecoveryEmail } from "../utils/sendEmail.js";



export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Usuario.findOne({ email });
    if (!user) return res.status(404).json({ error: "No se encontró un usuario con ese email." });

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpire = Date.now() + 1000 * 60 * 30; // 30 minutos

    user.resetToken = resetToken;
    user.resetTokenExpire = resetTokenExpire;
    await user.save();
    await user.save();
console.log("🧾 Token guardado en DB:", user.resetToken);


    console.log("📨 Preparando envío de email a:", user.email);
    await sendRecoveryEmail(user.email, resetToken);
    console.log("✅ Email enviado");

    res.json({ message: "Correo de recuperación enviado correctamente." });
  } catch (error) {
    console.error("🛑 Error en forgotPassword:", error.message);
    console.error(error);
    
    res.status(500).json({ error: "Error en el servidor." });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    const user = await Usuario.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: "Token inválido o expirado." });
    }

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 6 caracteres." });
    }

    user.password = newPassword; // 👉 importante: en texto plano
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save(); // 👉 el hash se hace solo en el pre("save")

    console.log("🔒 Password (texto plano) recibido:", newPassword);
    console.log("🔒 Password hasheado guardado:", user.password);

    res.json({ message: "Contraseña actualizada correctamente." });
  } catch (error) {
    console.error("Error en resetPassword:", error);
    res.status(500).json({ error: "Error en el servidor." });
  }
};


// controllers/authController.js
export const verificarTokenResetPassword = async (req, res) => {
  const { token } = req.params;
  try {
    const user = await Usuario.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (user) {
      return res.json({ valido: true });
    } else {
      return res.json({ valido: false });
    }
  } catch (error) {
    console.error("Error al verificar token:", error);
    res.status(500).json({ valido: false });
  }
};
