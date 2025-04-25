// routes/paypal.js
import express from "express";
import paypal from "@paypal/checkout-server-sdk";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

// Configuración del cliente PayPal
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
// ⚠️ En producción, cambiar a:
// const environment = new paypal.core.LiveEnvironment(...);

const client = new paypal.core.PayPalHttpClient(environment); 

// Crear orden de PayPal
router.post("/crear-orden", async (req, res) => {
  const { precio, descripcion, cursos } = req.body;


  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");

  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: precio,
        },
        description: `Compra: ${cursos.join(",")}`, // 👈 clave
      },
    ],
  });
  

  try {
    const order = await client.execute(request);
    res.json({ id: order.result.id });
  } catch (error) {
    console.error("❌ Error al crear orden de PayPal:", error);
    res.status(500).json({ mensaje: "Error al generar la orden" });
  }
});


// Capturar una orden
router.post("/capturar-orden", async (req, res) => {
    const { orderID } = req.body;
  
    const request = new paypal.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});
  
    try {
      const capture = await client.execute(request);
      console.log("💸 Orden capturada:", capture.result);
  
      res.json({ mensaje: "Pago capturado con éxito", datos: capture.result });
    } catch (error) {
      console.error("❌ Error al capturar orden:", error);
      res.status(500).json({ mensaje: "Error al capturar el pago" });
    }
  });
  

export default router;
