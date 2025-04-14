import mongoose from "mongoose";

const fechaSchema = new mongoose.Schema(
  {
    cantidadClases: {
      type: Number,
      required: true,
    },
    duracionClase: {
      type: String, // Ej: "2 horas", "1h 30m"
      required: false,
    },
    fechaInicio: {
      type: Date,
      required: true,
    },
    horario: {
      type: String, // Ej: "11:00"
      required: true,
    },
    diaSemana: {
      type: String, // Ej: "miércoles"
      required: false, // Por si lo quiere completar, pero no obligatorio
    },
  },
  { _id: false }
);

const claseVivoSchema = new mongoose.Schema(
  {
    titulo: {
      type: String,
      required: true,
    },
    descripcion: String,
    // Precios diferenciados
    precioAr: { type: Number, required: true },
    precioUsd: { type: Number, required: true },
    imagen: {
      url: { type: String },
      public_id: { type: String },
    },
    grupoWhatsapp: {
      type: String,
      match: [
        /https?:\/\/(www\.)?chat\.whatsapp\.com\/[A-Za-z0-9]+/,
        "Link inválido de grupo de WhatsApp",
      ],
    },
    categoria: {
      type: String,
      enum: ["reiki", "tarot", "luzYEnergia", "terapiasIntegrativas"],
      required: true,
    },
    fechas: fechaSchema, // 👈 ya no es array porque será un solo objeto por clase
    contenido: {
      type: [String], // array de temas
      default: [],
    },
    visible: {
      type: Boolean,
      default: true,
    },
    esPropio: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ClaseVivo = mongoose.model("ClaseVivo", claseVivoSchema);
export default ClaseVivo;
