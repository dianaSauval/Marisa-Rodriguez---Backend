import express from "express";
import { registrarUsuario, loginUsuario, obtenerMisCursosGrabados, obtenerMisClasesEnVivo } from "../controllers/usuariosController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/registro", registrarUsuario);
router.post("/login", loginUsuario);
router.get("/mis-cursos", verificarToken, obtenerMisCursosGrabados);
router.get("/mis-clases", verificarToken, obtenerMisClasesEnVivo);

export default router;
