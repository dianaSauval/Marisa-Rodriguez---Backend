// controllers/claseVivoController.js
import ClaseVivo from "../models/ClaseVivo.js";
import { eliminarImagenDeCloudinary } from "../config/cloudinary.js";

// ✅ Obtener todas las clases en vivo
export const obtenerTodas = async (req, res) => {
  try {
    const clases = await ClaseVivo.find();
    res.json(clases);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener las clases" });
  }
};

// ✅ Obtener clases por categoría
export const obtenerPorCategoria = async (req, res) => {
  const { categoria } = req.params;
  try {
    const clases = await ClaseVivo.find({ categoria });
    res.json(clases);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener clases por categoría" });
  }
};

// ✅ Obtener clase por ID
export const obtenerPorId = async (req, res) => {
  const { id } = req.params;
  try {
    const clase = await ClaseVivo.findById(id);
    if (!clase) return res.status(404).json({ mensaje: "Clase no encontrada" });
    res.json(clase);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener clase" });
  }
};

// ✅ Crear nueva clase (sólo admin)
export const crearClase = async (req, res) => {
  try {
    if (req.usuario.rol !== "admin") {
      return res.status(403).json({ mensaje: "Acceso denegado" });
    }

    const nuevaClase = new ClaseVivo(req.body);

    if (
      typeof req.body.precioAr !== "number" ||
      typeof req.body.precioUsd !== "number"
    ) {
      return res.status(400).json({
        mensaje: "Debés especificar ambos precios: en ARS y en USD (como números).",
      });
    }
    
    await nuevaClase.save();
    res.status(201).json(nuevaClase);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear la clase" });
  }
};

// ✅ Editar clase (sólo admin)
export const editarClase = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.usuario.rol !== "admin") {
      return res.status(403).json({ mensaje: "Acceso denegado" });
    }

    if (
      typeof req.body.precioAr !== "number" ||
      typeof req.body.precioUsd !== "number"
    ) {
      return res.status(400).json({
        mensaje: "Debés especificar ambos precios: en ARS y en USD (como números).",
      });
    }
    

    const clase = await ClaseVivo.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    
    if (!clase) return res.status(404).json({ mensaje: "Clase no encontrada" });
    res.json(clase);
  } catch (error) {
    console.error("❌ Error real al editar la clase:", error);
    res.status(500).json({ mensaje: "Error al editar la clase", error: error.message });
  }
  
};

// ✅ Eliminar clase (sólo admin)
export const eliminarClase = async (req, res) => {
  const { id } = req.params;
  try {
    if (req.usuario.rol !== "admin") {
      return res.status(403).json({ mensaje: "Acceso denegado" });
    }
  
    

    const clase = await ClaseVivo.findByIdAndDelete(id);
    if (!clase) return res.status(404).json({ mensaje: "Clase no encontrada" });

     // 🔥 NUEVO: eliminamos la imagen si tiene public_id
  if (clase.imagen?.public_id) {
    await eliminarImagenDeCloudinary(clase.imagen.public_id);
  }

    res.json({ mensaje: "Clase eliminada correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar la clase" });
  }
};

// 🌟 Obtener todas las clases visibles (para usuarios)
export const obtenerClasesVisibles = async (req, res) => {
  try {
    const clasesVisibles = await ClaseVivo.find({ visible: true });
    res.json(clasesVisibles);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener clases visibles" });
  }
};


// 🌟 Obtener clases visibles por categoría
export const obtenerClasesVisiblesPorCategoria = async (req, res) => {
  const { categoria } = req.params;
  try {
    const clases = await ClaseVivo.find({ categoria, visible: true });
    res.json(clases);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener clases por categoría visible" });
  }
};
