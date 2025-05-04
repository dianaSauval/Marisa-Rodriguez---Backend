// models/Curso.js

import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  url: { type: String, required: true },
});

const pdfSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  url: { type: String, required: true },
}, { _id: false }); // ⚠️ Importante: _id desactivado para evitar que mongoose le agregue uno innecesario

const cursoSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    duracion: { type: String, required: true },
    precioAr: { type: Number, required: true },
    precioUsd: { type: Number, required: true },
    contenido: [{ type: String }],
    video: { type: videoSchema, required: true },
    pdfs: { type: [pdfSchema], default: [] },
    imagen: {
      url: { type: String },
      public_id: { type: String }
    },
    categoria: {
      type: String,
      enum: ["tarot", "reiki", "luzYEnergia", "terapiasIntegrativas"],
      required: true,
    },
    visible: { type: Boolean, default: true },
    esPropio: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Curso", cursoSchema);
