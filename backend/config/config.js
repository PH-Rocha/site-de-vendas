require('dotenv').config();

if(!process.env.JWT_SECRET) {
  throw new Error("Erro crítico: JWT_SECRET não está definido no ambiente!");
}

module.exports = {
  secretKey: process.env.JWT_SECRET
};