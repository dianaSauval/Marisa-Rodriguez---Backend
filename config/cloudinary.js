// config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config(); // Asegura que cargue las variables del .env

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Función para eliminar una imagen de Cloudinary
export const eliminarImagenDeCloudinary = async (public_id) => {
    if (!public_id) return;
    try {
      await cloudinary.uploader.destroy(public_id);
      console.log("🗑 Imagen eliminada de Cloudinary:", public_id);
    } catch (error) {
      console.error("❌ Error al eliminar imagen:", error);
    }
  };

export default cloudinary;
