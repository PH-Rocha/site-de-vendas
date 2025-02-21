let express = require('express');
let router = express.Router();

const verifyToken = require('../middlewares/Auth');
const clientes = require('../controllers/ClienteController');
const funcionarios = require('../controllers/funcionarioController');
const usuarios = require('../controllers/UsuarioController');
const pedido = require('../controllers/PedidoController');
const produto = require('../controllers/ProdutoController');
const pedidoitem = require('../controllers/PedidoItemController');

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
router.post('/api/usuario/login', usuarios.login);

router.post('/api/funcionario', verifyToken, funcionarios.createFuncionario);
router.get('/api/funcionario/:id', verifyToken, funcionarios.getFuncionario);
router.get('/api/funcionarios', verifyToken, funcionarios.Funcionarios);
router.delete('/api/funcionario/:id', verifyToken, funcionarios.deleteFuncionario);
router.put('/api/funcionario', verifyToken, funcionarios.updateFuncionario);

router.post('/api/pedido', verifyToken, pedido.createPedido);
router.delete('/api/pedido/:id', verifyToken, pedido.deletePedido);
router.get('/api/pedido/:id', verifyToken, pedido.getPedido);

router.post('/api/produto', verifyToken, produto.createProduto);
router.get('/api/produtos', produto.Produtos);
router.get('/api/produto/:id', verifyToken, produto.getProdutos);
router.put('/api/produto', verifyToken, produto.updateProduto);
router.put('/api/produto/:id/estoque', verifyToken, produto.addEstoque);
router.put('/api/produto/:id/removeEstoque', verifyToken, produto.removeEstoque);
router.delete('/api/produto/:id', verifyToken, produto.deleteProduto);

router.post('/api/pedidoitem', verifyToken, pedidoitem.addProduto);
router.delete('/api/pedidoitem/:id', verifyToken, pedidoitem.deletePedidoItem);
router.put('/api/pedidoitem/:id/remover', verifyToken, pedidoitem.removeProduto);
router.get('/api/pedidoitem', verifyToken, pedidoitem.listPedido);

module.exports = router;
