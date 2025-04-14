import express from "express";
import {
  obtenerCursos,
  obtenerCursosPorCategoria,
  obtenerCursoPorId,
  crearCurso,
  editarCurso,
  eliminarCurso,
  cambiarVisibilidadCurso,
  obtenerCursosVisibles, 
  obtenerCursosVisiblesPorCategoria
} from "../controllers/cursosController.js";
import { verificarToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/visibles/:categoria", obtenerCursosVisiblesPorCategoria);
router.get("/visibles", obtenerCursosVisibles); // 👈 esto antes que el get("/:id")

router.get("/categoria/:categoria", obtenerCursosPorCategoria);
router.get("/:id", obtenerCursoPorId);
router.get("/", obtenerCursos);


// Solo admin
router.post("/", verificarToken, crearCurso);
router.put("/:id", verificarToken, editarCurso);
router.delete("/:id", verificarToken, eliminarCurso);
router.patch("/visibilidad/:id", verificarToken, cambiarVisibilidadCurso);

export default router;
