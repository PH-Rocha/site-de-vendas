const axios = require('axios');
require('dotenv').config();

const asaasApi = axios.create({
  baseURL: 'https://sandbox.asaas.com/api/',
  headers: {
    'content-Type': 'application/json',
    'access_token': process.env.ASAAS_API_KEY,
  },
});

module.exports = asaasApi;