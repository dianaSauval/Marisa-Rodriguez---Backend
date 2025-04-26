// backend/config/paypalClient.js
const paypal = require('@paypal/checkout-server-sdk');

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

let environment;

// ✅ Elegimos ambiente dinámicamente
if (process.env.NODE_ENV === "production") {
  environment = new paypal.core.LiveEnvironment(clientId, clientSecret);
} else {
  environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
}

const client = new paypal.core.PayPalHttpClient(environment);

module.exports = client;

