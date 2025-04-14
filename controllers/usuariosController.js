import Usuario from "../models/Usuario.js";
import Curso from "../models/Curso.js";
import ClaseVivo from "../models/ClaseVivo.js"; // o como lo hayas llamado
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


// Función para generar el token
const generarToken = (usuario) => {
  return jwt.sign(
    { id: usuario._id, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// 📝 Registro
export const registrarUsuario = async (req, res) => {
  const { nombre, apellido, email, password } = req.body;

  try {
    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ mensaje: "El email ya está registrado." });
    }

    const nuevoUsuario = new Usuario({ nombre, apellido, email, password });
    await nuevoUsuario.save();

    const token = generarToken(nuevoUsuario);
    res.status(201).json({
      usuario: {
        id: nuevoUsuario._id,
        nombre: nuevoUsuario.nombre,
        email: nuevoUsuario.email,
        rol: nuevoUsuario.rol,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al registrar el usuario." });
  }
};

// 🔐 Login
export const loginUsuario = async (req, res) => {
  const { email, password } = req.body;
  console.log("Llegó al backend:", email, password);
  try {
    const usuario = await Usuario.findOne({ email });
    
    if (!usuario) return res.status(400).json({ mensaje: "email incorrecto" });

    const passwordValido = await bcrypt.compare(password, usuario.password);
    
    console.log("Contraseña hasheada guardada:", usuario.password);
    console.log("🤔 Comparando:", password, "VS", usuario.password);

    if (!passwordValido) return res.status(401).json({ mensaje: "Contraseña incorrecta" });

    const token = generarToken(usuario);

    res.json({
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al iniciar sesión." });
  }
};

// GET /usuarios/mis-cursos
export const obtenerMisCursosGrabados = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).populate("cursosComprados");

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json(usuario.cursosComprados);
  } catch (error) {
    console.error("❌ Error al obtener cursos comprados:", error);
    res.status(500).json({ mensaje: "Error al obtener los cursos comprados" });
  }
};

// GET /usuarios/mis-clases
export const obtenerMisClasesEnVivo = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).populate("clasesCompradas");

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json(usuario.clasesCompradas);
  } catch (error) {
    console.error("❌ Error al obtener clases compradas:", error);
    res.status(500).json({ mensaje: "Error al obtener las clases en vivo compradas" });
  }
};

