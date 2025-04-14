// routes/clasesVivo.js
import express from "express";
import {
  obtenerTodas,
  obtenerPorCategoria,
  obtenerPorId,
  crearClase,
  editarClase,
  eliminarClase,
  obtenerClasesVisiblesPorCategoria,
  obtenerClasesVisibles
} from "../controllers/ClaseVivoController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🟢 Públicas
router.get("/visibles/:categoria", obtenerClasesVisiblesPorCategoria); // más específica primero
router.get("/visibles", obtenerClasesVisibles); // después la general
router.get("/", obtenerTodas);
router.get("/categoria/:categoria", obtenerPorCategoria);
router.get("/:id", obtenerPorId);

// 🔒 Protegidas (solo admin)
router.post("/", verificarToken, crearClase);
router.put("/:id", verificarToken, editarClase);
router.delete("/:id", verificarToken, eliminarClase);

export default router;
