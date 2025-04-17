// backend/config/paypalClient.js
const paypal = require('@paypal/checkout-server-sdk');

const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

const environment = new paypal.core.SandboxEnvironment(clientId, clientSecret);
// Usar LiveEnvironment para producción

const client = new paypal.core.PayPalHttpClient(environment);

module.exports = client;
