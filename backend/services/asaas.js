const axios = require('axios');
require('dotenv').config();

const asaasApi = axios.create({
  baseUrl: 'https://sandbox.asaas.com/api/',
  Headers: {
    'content-Type': 'application/json',
    'access_token': process.env.ASAAS_API_KEY,
  },
});

module.exports = asaasApi;