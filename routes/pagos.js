// routes/pagos.js
import mongoose from "mongoose";
import express from "express";
import mercadopago from "../config/mercadoPago.cjs";
import { verificarToken } from "../middleware/authMiddleware.js";
import Curso from "../models/Curso.js";
import Usuario from "../models/Usuario.js";


const router = express.Router();

router.post("/crear-preferencia", verificarToken, async (req, res) => {
  const { cursos } = req.body;

  try {
    const cursosData = await Curso.find({ _id: { $in: cursos } });

    const items = cursosData.map((curso) => ({
      title: curso.titulo,
      unit_price: curso.precioAr,
      quantity: 1,
    }));

    const preference = {
      items,
      back_urls: {
        success: `${process.env.FRONTEND_URL}/pago-exitoso`,
        failure: `${process.env.FRONTEND_URL}/pago-fallido`,
        pending: `${process.env.FRONTEND_URL}/pago-pendiente`,
      },
      auto_return: "approved",
       // 👇 Agregamos esto
  metadata: {
    cursos: cursos.map((id) => id.toString()), // Array de strings
  },
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (error) {
    console.error("❌ Error al crear preferencia:", error);
    res.status(500).json({ mensaje: "Error al generar el pago" });
  }
});

// routes/pagos.js

router.post("/confirmar-compra", verificarToken, async (req, res) => {
  const { cursos } = req.body;
  const usuarioId = req.usuario._id;

  try {
    const usuario = await Usuario.findById(usuarioId);

    if (!Array.isArray(cursos)) {
      return res.status(400).json({ mensaje: "Formato de cursos inválido" });
    }

    // 👇 Convertimos a ObjectId para asegurarnos que son válidos
    const cursosObjectId = cursos.map((id) => new mongoose.Types.ObjectId(id));

    // 📚 Buscamos en la base de datos solo los cursos válidos
    const cursosValidos = await Curso.find({ _id: { $in: cursosObjectId } });

    const nuevosCursos = cursosValidos
      .map((curso) => curso._id.toString())
      .filter((id) => !usuario.cursosComprados.includes(id));

    // 🧩 Agregamos solo los nuevos
    usuario.cursosComprados.push(...nuevosCursos);
    await usuario.save();

    res.json({ mensaje: "Cursos agregados con éxito" });
  } catch (error) {
    console.error("❌ Error al confirmar compra:", error);
    res.status(500).json({ mensaje: "Error al agregar los cursos" });
  }
});

router.get("/preferencia/:id", verificarToken, async (req, res) => {
  try {
    const { id } = req.params;
    const pref = await mercadopago.preferences.get(id);
    res.json(pref.body);
  } catch (error) {
    console.error("❌ Error al obtener preferencia:", error);
    res.status(500).json({ mensaje: "No se pudo obtener la preferencia" });
  }
});



export default router;
