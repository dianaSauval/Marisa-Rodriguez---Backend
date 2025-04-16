// server.js
// server.js
import "./config.js"; // <-- debe estar antes de cualquier import que use variables de entorno
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cursosRoutes from "./routes/cursos.js";
import usuariosRoutes from "./routes/usuarios.js";
import clasesVivoRoutes from "./routes/clasesVivo.js";
import authRoutes from "./routes/auth.js";
import pagosRoutes from "./routes/pagos.js";





const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
const allowedOrigins = [
  "http://localhost:5173",
  "https://marisarodriguezterapiasholisticas.com"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No autorizado por CORS"));
    }
  },
  credentials: true, // si usás cookies o headers de autenticación
}));

app.use(express.json());

// Rutas
app.use("/api/cursos", cursosRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/clases-vivo", clasesVivoRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/pagos", pagosRoutes);




// Conexión a la DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("📡 Conectado a MongoDB");
    app.listen(PORT, () =>
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("Error al conectar MongoDB:", err));
