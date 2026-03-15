// routes/pagos.js
import mongoose from "mongoose";
import express from "express";
import mercadopago from "../config/mercadoPago.cjs";
import Curso from "../models/Curso.js";
import ClaseVivo from "../models/ClaseVivo.js";
import { verificarToken } from "../middleware/authMiddleware.js";
import Usuario from "../models/Usuario.js";


const router = express.Router();

router.post("/crear-preferencia", async (req, res) => {
  const { cursos } = req.body;

  try {
    console.log("🟢 IDs recibidos:", cursos);

    const objectIds = cursos.map((id) => new mongoose.Types.ObjectId(id));

    // Buscar en ambas colecciones
    const cursosData = await Curso.find({ _id: { $in: objectIds } });
    const clasesData = await ClaseVivo.find({ _id: { $in: objectIds } });

    console.log("📘 Cursos encontrados:", cursosData);
    console.log("📙 Clases encontradas:", clasesData);

    const itemsCursos = cursosData.map((curso) => ({
      title: curso.titulo,
      unit_price: curso.precioAr,
      quantity: 1,
    }));

    const itemsClases = clasesData.map((clase) => ({
      title: clase.titulo,
      unit_price: clase.precioAr,
      quantity: 1,
    }));

    const items = [...itemsCursos, ...itemsClases];

    if (items.length === 0) {
      return res.status(400).json({ mensaje: "No se encontraron elementos válidos para el pago" });
    }

    const preference = {
      items,
      back_urls: {
        success: `${process.env.FRONTEND_URL}/pago-exitoso`,
        failure: `${process.env.FRONTEND_URL}/pago-fallido`,
        pending: `${process.env.FRONTEND_URL}/pago-pendiente`,
      },
      auto_return: "approved",
      metadata: {
        cursos: cursos.map((id) => id.toString()),
      },
    };

    console.log("📦 Preference final:", preference);

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
  const usuarioId = req.usuario?.id || req.usuario?._id;

  if (!usuarioId) {
    return res.status(401).json({ mensaje: "Usuario no autenticado" });
  }

  try {
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    if (!Array.isArray(cursos)) {
      return res.status(400).json({ mensaje: "Formato de cursos inválido" });
    }

    console.log("✅ Confirmación recibida del usuario:", req.usuario.email);
    console.log("📦 Cursos a guardar:", cursos);
    console.log("🧑‍💻 Usuario:", usuario._id);
    console.log("🎓 Cursos ya comprados:", usuario.cursosComprados);
    console.log("🎥 Clases ya compradas:", usuario.clasesCompradas);
    console.log("📩 Body recibido:", req.body);

    const cursosObjectId = cursos.map((id) => new mongoose.Types.ObjectId(id));

    const cursosValidos = await Curso.find({ _id: { $in: cursosObjectId } });
    const clasesValidas = await ClaseVivo.find({ _id: { $in: cursosObjectId } });

    console.log("📚 Cursos válidos encontrados:", cursosValidos.map(c => c._id.toString()));
    console.log("🌀 Clases válidas encontradas:", clasesValidas.map(c => c._id.toString()));

    const cursosCompradosIds = usuario.cursosComprados.map(id => id.toString());
    const clasesCompradasIds = usuario.clasesCompradas.map(id => id.toString());

    const nuevosCursos = cursosValidos
      .map((curso) => curso._id.toString())
      .filter((id) => !cursosCompradosIds.includes(id));

    const nuevasClases = clasesValidas
      .map((clase) => clase._id.toString())
      .filter((id) => !clasesCompradasIds.includes(id));

    if (nuevosCursos.length === 0 && nuevasClases.length === 0) {
      return res.status(400).json({
        mensaje: "Estos cursos o clases ya fueron comprados anteriormente.",
        cursosYaComprados: cursosCompradosIds,
        clasesYaCompradas: clasesCompradasIds,
        cursosSolicitados: cursosObjectId.map(id => id.toString()),
      });
    }

    if (nuevosCursos.length > 0) {
      usuario.cursosComprados.push(...nuevosCursos);
    }

    if (nuevasClases.length > 0) {
      usuario.clasesCompradas.push(...nuevasClases);
    }

    await usuario.save();

    res.json({
      mensaje: "Compra confirmada con éxito",
      nuevosCursos,
      nuevasClases,
    });
  } catch (error) {
    console.error("❌ Error al confirmar compra:", error);
    res.status(500).json({ mensaje: "Error al agregar los cursos o clases" });
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
