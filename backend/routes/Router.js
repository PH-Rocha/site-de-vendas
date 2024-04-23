let express = require('express');
let router = express.Router();

const verifyToken = require('../middlewares/Auth');
const clientes = require('../controllers/ClienteController');
const funcionarios = require('../controllers/funcionarioController');
const usuarios = require('../controllers/UsuarioController');

router.post('/api/cliente', verifyToken, clientes.createCliente);
router.get('/api/cliente/:id', verifyToken, clientes.getClientes);
router.get('/api/clientes', verifyToken, clientes.Clientes);
router.put('/api/cliente', verifyToken, clientes.updateCliente);
router.delete('/api/cliente/:id', verifyToken, clientes.deleteCliente);

router.post('/api/usuario', usuarios.createUsuario);
router.delete('/api/usuario/:id', verifyToken, usuarios.deleteUsuario);
router.put('/api/usuario', verifyToken, usuarios.updateUsuario);
router.get('/api/usuarios', verifyToken, usuarios.Usuarios);
router.get('/api/usuario/:id', verifyToken, usuarios.getUsuario);
router.post('/api/usuario/modify/:id', verifyToken, usuarios.modifyPassword);
router.post('/api/usuario/login', usuarios.loginUsuario);

router.post('/api/funcionario', verifyToken, funcionarios.createFuncionario);
router.get('/api/funcionario/:id', verifyToken, funcionarios.getFuncionario);
router.get('/api/funcionarios', verifyToken, funcionarios.Funcionarios);
router.delete('/api/funcionario/:id', verifyToken, funcionarios.deleteFuncionario);
router.put('/api/funcionario', verifyToken, funcionarios.updateFuncionario);

module.exports = router;