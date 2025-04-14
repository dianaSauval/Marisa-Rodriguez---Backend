// models/TokenRecuperacion.js
import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  usuarioId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiracion: {
    type: Date,
    required: true,
  },
});

const TokenRecuperacion = mongoose.model("TokenRecuperacion", tokenSchema);
export default TokenRecuperacion;
