// routes/auth.js
import express from "express";
import { forgotPassword, resetPassword, verificarTokenResetPassword } from "../controllers/authController.js";

const router = express.Router();

router.post("/forgot-password", forgotPassword); // Enviar email
router.post("/reset-password/:token", resetPassword); // Cambiar contraseña con token
router.get("/verificar-token/:token", verificarTokenResetPassword);
  

export default router;
