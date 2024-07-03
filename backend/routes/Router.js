let express = require('express');
let router = express.Router();

const verifyToken = require('../middlewares/Auth');
const clientes = require('../controllers/ClienteController');
const funcionarios = require('../controllers/funcionarioController');
const usuarios = require('../controllers/UsuarioController');
const pedido = require('../controllers/PedidoController');
const produto = require('../controllers/ProdutoController');
const pedidoitem = require('../controllers/PedidoItemController');
const transacao = require('../controllers/TransacaoController');

router.post('/api/cliente',clientes.createCliente);
router.get('/api/cliente/:id', clientes.getClientes);
router.get('/api/clientes',clientes.Clientes);
router.put('/api/cliente',  clientes.updateCliente);
router.delete('/api/cliente/:id',  clientes.deleteCliente);

router.post('/api/usuario', usuarios.createUsuario);
router.delete('/api/usuario/:id',  usuarios.deleteUsuario);
router.put('/api/usuario',  usuarios.updateUsuario);
router.get('/api/usuarios',  usuarios.Usuarios);
router.get('/api/usuario/:id',  usuarios.getUsuario);
router.post('/api/usuario/modify/:id', usuarios.modifyPassword);
router.post('/api/usuario/login', usuarios.login);

router.post('/api/funcionario',  funcionarios.createFuncionario);
router.get('/api/funcionario/:id',  funcionarios.getFuncionario);
router.get('/api/funcionarios',  funcionarios.Funcionarios);
router.delete('/api/funcionario/:id',  funcionarios.deleteFuncionario);
router.put('/api/funcionario',  funcionarios.updateFuncionario);

router.post('/api/pedido', pedido.createPedido);
router.delete('/api/pedido/:id', pedido.deletePedido);
router.get('/api/pedido/:id', pedido.getPedido);

router.post('/api/produto', produto.createProduto);
router.get('/api/produtos', produto.Produtos);
router.get('/api/produto/:id', produto.getProdutos);
router.put('/api/produto', produto.updateProduto);
router.put('/api/produto/:id/estoque', produto.addEstoque);
router.put('/api/produto/:id/removeEstoque', produto.removeEstoque);
router.delete('/api/produto/:id', produto.deleteProduto);

router.post('/api/pedidoItem', pedidoitem.addProduto);
router.delete('/api/pedidoItem/:id', pedidoitem.removeProduto);
router.get('/api/pedidoItem', pedidoitem.listPedido);

module.exports = router;
