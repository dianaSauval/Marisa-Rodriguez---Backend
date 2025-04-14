import mongoose from "mongoose";
import bcrypt from "bcrypt";

const usuarioSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    apellido: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Formato de email inválido"],
    },
    password: {
      type: String,
      required: true,
      minlength: [6, "La contraseña debe tener al menos 6 caracteres"],
    },
    rol: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    resetToken: String,
    resetTokenExpire: Date,

    // 🎥 Cursos grabados
    cursosComprados: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Curso",
      },
    ],

    // 🔮 Clases en vivo
    clasesCompradas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClaseVivo", // Asegurate de que el modelo se llame así o ajustalo
      },
    ],
  },
  {
    timestamps: true,
  }
);

// 🔒 Encriptar contraseña antes de guardar
usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

// 🔐 Método para comparar contraseñas (útil al loguearse)
usuarioSchema.methods.compararPassword = async function (passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;
