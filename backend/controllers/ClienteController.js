const db = require('../config/db.config');
const asaasApi = require('../services/asaas');
const Cliente = db.Cliente;

exports.createCliente = async (req, res) => {
  let cliente = {};

  try {
    cliente.nome = req.body.nome;
    cliente.idade = req.body.idade;
    cliente.email = req.body.email;
    cliente.cpfCnpj = req.body.cpfCnpj.replace(/[^\d]/g, '');
    cliente.telefone = req.body.telefone.replace(/[^\d]/g, '');
    cliente.endereco = req.body.endereco;
    cliente.numero = req.body.numero;
    cliente.complemento = req.body.complemento;
    cliente.bairro = req.body.bairro;
    cliente.cep = req.body.cep.replace(/[^\d]/g, '');
    cliente.id_usuario = req.body.id_usuario;

    if (cliente.cpfCnpj.length !== 11 && cliente.cpfCnpj.length !== 14) {
      return res.status(400).json({ error: "CPF/CNPJ inválido. Deve ter 11 ou 14 digitos" });
    }

    if (cliente.cep.length !== 8) {
      return res.status(400).json({ error: "CEP inválido. Deve ter 8 digitos" });
    }

    if (cliente.telefone.length !== 11) {
      return res.status(400).json({ error: "Telefone inválido" });
    }
    const result = await Cliente.create(cliente,
      { attributes: ['id', 'nome', 'idade', 'email', 'cpfCnpj', 'telefone', 'endereco', 'numero', 'complemento', 'cep', 'id_usuario'] });

    console.log("cliente criado: ", result);
    
    const asaasCliente = {
      name: cliente.nome,
      cpfCnpj: cliente.cpfCnpj,
      email: cliente.email,
      mobilePhone: cliente.telefone,
      address: cliente.endereco,
      addressNumber: cliente.numero,
      complement: cliente.complemento,
      province: cliente.bairro,
      postalCode: cliente.cep,
      externalReference: result.id
    };

    try {
      const asaasRes = await asaasApi.post('/v3/customers', asaasCliente);

      console.log("Resposta da Api: ", asaasRes.data);

      if (asaasRes.data && asaasRes.data.id){
        await result.update({
          referenciaExterna: result.id, 
          asaasId: asaasRes.data.id
        })
        
        console.log("Cliente atualizado no banco: ", result)
        return res.status(201).json(result);
      } else {
        throw new Error("ID do Asaas não retornado na resposta");
      }


    } catch (error) {
      console.error("Erro ao criar cliente no Asaas: ", error.response?.data || error.message);
      return res.status(500).json({ error: "Erro ao criar cliente no Asaas" })
    }
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao criar cliente",
      error: error.message
    })
  }
}

exports.deleteCliente = async (req, res) => {
  try {
    const clienteId = req.params.id;
    const codigoExclusao = req.params.codigoExclusao;

    const cliente = await Cliente.findByPk(clienteId);

    if (!cliente) {
      return res.status(404).json({
        message: "Cliente não encontrado com o ID fornecido",
        error: "404"
      });
    }

    const codigoEsperado = cliente.codigoExclusao;

    if (codigoEsperado != codigoExclusao) {
      return res.status(401).json({
        message: "Código de exclusão incorreto. A exclusão requer o código correto",
        error: "401"
      });
    }

    await cliente.destroy();

    return res.status(200).json({
      message: "Cliente deletado com sucesso"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao deletar o cliente",
      error: error.message
    })
  }
}

exports.updateCliente = async (req, res) => {
  try {
    let cliente = await Cliente.findByPk(req.body.id);

    if (!cliente) {
      return res.status(404).json({
        message: "Cliente não encontrado com o ID fornecido",
        error: "404"
      });
    } else {
      let updateObject = {
        nome: req.body.nome,
        idade: req.body.idade
      }
      let result = await Cliente.update(updateObject,
        {
          returning: true,
          where: { id: req.body.id },
          attributes: ['id', 'nome', 'idade', 'id_usuario']
        }
      );

      if (!result) {
        return res.status(500).json({
          message: "Erro ao atualizar cliente:" + req.params.id,
          error: "500"
        });
      }

      return res.status(200).json(result);
    }
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao atualizar o cliente",
      error: error.message
    })
  }
}

exports.Clientes = (req, res) => {
  try {
    Cliente.findAll({ attributes: ['id', 'nome', 'idade', 'id_usuario'] })
      .then(clientes => {
        res.status(200).json(clientes);
      });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar os clientes",
      error: error.message
    });
  }
}

exports.getClientes = (req, res) => {
  try {
    Cliente.findByPk(req.params.id,
      { attributes: ['id', 'nome', 'idade', 'id_usuario'] })
      .then(cliente => {
        res.status(200).json(cliente);
      });
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar o cliente",
      error: error.message
    })
  }
}