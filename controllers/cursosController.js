// controllers/cursosController.js

import Curso from "../models/Curso.js";

import { eliminarImagenDeCloudinary } from "../config/cloudinary.js";


// 🌀 Obtener todos los cursos (admin)
export const obtenerCursos = async (req, res) => {
  try {
    const cursos = await Curso.find();
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los cursos" });
  }
};

// 🎯 Obtener cursos por categoría (admin)
export const obtenerCursosPorCategoria = async (req, res) => {
  try {
    const { categoria } = req.params;
    const cursos = await Curso.find({ categoria });
    res.json(cursos);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los cursos por categoría" });
  }
};

// 🔍 Obtener curso por ID
export const obtenerCursoPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const curso = await Curso.findById(id);
    if (!curso) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }
    res.json(curso);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener el curso" });
  }
};

// ➕ Crear nuevo curso (solo admin)
export const crearCurso = async (req, res) => {
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
    

    const nuevoCurso = new Curso(req.body);
    await nuevoCurso.save();
    res.status(201).json(nuevoCurso);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al crear el curso" });
  }
};

// 📝 Editar curso (solo admin)
export const editarCurso = async (req, res) => {
  try {
    if (req.usuario.rol !== "admin") {
      return res.status(403).json({ mensaje: "Acceso denegado" });
    }
    console.log("📥 Datos recibidos en editarCurso:", req.body);

    const { id } = req.params;
    const cursoActualizado = await Curso.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
      overwrite: false
    });

    if (!cursoActualizado) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }

    res.json(cursoActualizado);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al editar el curso" });
  }
};

// 🗑️ Eliminar curso (solo admin)
export const eliminarCurso = async (req, res) => {
  try {
    if (req.usuario.rol !== "admin") {
      return res.status(403).json({ mensaje: "Acceso denegado" });
    }
    

    const { id } = req.params;
    const cursoEliminado = await Curso.findByIdAndDelete(id);

    if (!cursoEliminado) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }
  // 🔥 NUEVO: eliminamos la imagen si tiene public_id
  if (cursoEliminado.imagen?.public_id) {
    await eliminarImagenDeCloudinary(cursoEliminado.imagen.public_id);
  }
    
    res.json({ mensaje: "Curso eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al eliminar el curso" });
  }
};

// 👁️ Cambiar visibilidad del curso (solo admin)
export const cambiarVisibilidadCurso = async (req, res) => {
  try {
    if (req.usuario.rol !== "admin") {
      return res.status(403).json({ mensaje: "Acceso denegado" });
    }

    const { id } = req.params;

    const curso = await Curso.findById(id);
    if (!curso) {
      return res.status(404).json({ mensaje: "Curso no encontrado" });
    }

    const cursoActualizado = await Curso.findByIdAndUpdate(
      id,
      { visible: !curso.visible },
      { new: true }
    );

    res.json({
      mensaje: `Visibilidad actual: ${cursoActualizado.visible}`,
      curso: cursoActualizado,
    });
  } catch (error) {
    console.error("❌ Error real:", error);
    res.status(500).json({ mensaje: "Error al cambiar la visibilidad" });
  }
};

// 🌟 Obtener todos los cursos visibles (para usuarios)
export const obtenerCursosVisibles = async (req, res) => {
  try {
    const cursosVisibles = await Curso.find({ visible: true });
    res.json(cursosVisibles);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener los cursos visibles" });
  }
};

// 🔮 Obtener cursos visibles por categoría (para usuarios)
export const obtenerCursosVisiblesPorCategoria = async (req, res) => {
  try {
    const { categoria } = req.params;
    const cursos = await Curso.find({ categoria, visible: true });
    res.json(cursos);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al obtener los cursos visibles por categoría",
    });
  }
};
