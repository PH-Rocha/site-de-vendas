const { where } = require('sequelize');
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

      if (asaasRes.data && asaasRes.data.id) {
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
    const { id: clienteId, codigoExclusao } = req.params;


    const cliente = await Cliente.findByPk(clienteId);

    if (!cliente) {
      return res.status(404).json({
        message: "Cliente não encontrado com o ID fornecido",
        error: "404"
      });
    }

    if (!cliente.asaasId) {
      return res.status(400).json({
        message: "Cliente não possui ID no asaas"
      });
    }

    if (cliente.codigoExclusao !== codigoExclusao) {
      return res.status(401).json({
        message: "Código de exclusão incorreto. A exclusão requer o código correto",
        error: "401"
      });
    }

    try {
      const asaasRes = await asaasApi.delete('/v3/customers/{cliente.asaasId}', cliente.asaasId);

      console.log("Resposta da Api: ", asaasRes.data);

      if (asaasRes.status !== 200) {
        return res.status(400).json({
          message: "Erro ao deletar o cliente no asaas"
        });
      }
    } catch (error) {
      console.error("Erro ao deletar cliente no Asaas: ", error.response?.data || error.message);
      return res.status(500).json({ error: "Erro ao deletar cliente no Asaas" })
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
  const { nome, idade, email, cpfCnpj, telefone, endereco, numero, complemento, bairro, cep } = req.body;
  try {
    const cliente = await Cliente.findByPk(req.body.id);

    if (!cliente) {
      return res.status(404).json({
        message: "Cliente não encontrado com o ID fornecido",
        error: "404"
      });
    }

    if (!cliente.asaasId) {
      return res.status(400).json({
        message: "Cliente não possui ID no asaas"
      });
    }

    let updateObject = {
      nome,
      idade,
      email,
      cpfCnpj,
      telefone,
      endereco,
      numero,
      complemento,
      bairro,
      cep
    };

    try {
      const asaasRes = await asaasApi.put('/v3/customers/{cliente.asaasId}', updateObject);

      console.log("Resposta da Api: ", asaasRes.data);

      if (asaasRes.status !== 200) {
        return res.status(400).json({
          message: "Erro ao atualizar o cliente no asaas"
        });
      }
    } catch (error) {
      console.error("Erro ao atualizar cliente no Asaas: ", error.response?.data || error.message);
      return res.status(500).json({ error: "Erro ao atualizar cliente no Asaas" })
    }

    const [updatedCount, updatedRows] = await Cliente.update(updateObject, {
      where: { id },
      returning: true
    });

    if (updatedCount == 0) {
      return res.status(500).json({
        message: "Erro ao atualizar o usuário"
      });
    }

    return res.status(200).json(updatedRows[0]);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao atualizar o cliente",
      error: error.message
    })
  }
}

exports.Clientes = async (req, res) => {
  try {
    const clientes = await Cliente.findAll();

    res.status(200).json(clientes);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar os clientes",
      error: error.message
    });
  }
}

exports.getClientes = async (req, res) => {
  const { id } = req.params;
  try {
    if (!id || isNaN(id)) {
      return res.status(400).json({
        message: "ID inválido. Insira um ID numérico válido."
      });
    };

    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({
        message: "Cliente não encontrado com o ID fornecido."
      });
    }

    res.status(200).json(cliente);
  } catch (error) {
    return res.status(500).json({
      message: "Erro ao buscar o cliente",
      error: error.message
    })
  }
}