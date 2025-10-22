import { Fornecedores } from "../models/fornecedores.js";

export const criarFornecedores = async (req, res) => {
  const {
    fornecedor, email, telefone, cnpj, cep, cidade,
    estado, bairro, logradouro, numero, status
  } = req.body;

  if (!fornecedor || !email || !telefone || !cnpj || !cep || !cidade ||
      !estado || !bairro || !logradouro || numero === undefined || numero === '' ||
      status === undefined || status === null) {
    return res.status(400).json({ message: "Preencha todos os campos." });
  }

  const statusBanco = status === true ? 'ativa' : 'inativa';

  try {
    const insertId = await Fornecedores.create({
      fornecedor, email, telefone, cnpj, cep, cidade,
      estado, bairro, logradouro, numero, status: statusBanco
    });

    return res.status(201).json({ message: "Fornecedor cadastrado com sucesso!", id: insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao cadastrar Fornecedor." });
  }
};

export const listarFornecedores = async (req, res) => {
  try {
    const fornecedores = await Fornecedores.getAll();

    // ✅ Convertendo status string ("ativa"/"inativa") para booleano
    const fornecedoresConvertidos = fornecedores.map((f) => ({
      ...f,
      status: f.status === "ativa"
    }));

    return res.status(200).json(fornecedoresConvertidos);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao listar Fornecedores." });
  }
};

export const editarFornecedor = async (req, res) => {
  const { id } = req.params;
  const {
    fornecedor, email, telefone, cnpj, cep, cidade,
    estado, bairro, logradouro, numero, status
  } = req.body;

  if (!fornecedor || !email || !telefone || !cnpj || !cep || !cidade ||
      !estado || !bairro || !logradouro || numero === undefined || numero === '' ||
      status === undefined || status === null) {
    return res.status(400).json({ message: "Preencha todos os campos." });
  }

  const statusBanco = status === true ? 'ativa' : 'inativa';

  try {
    const updated = await Fornecedores.update(id, {
      fornecedor, email, telefone, cnpj, cep, cidade,
      estado, bairro, logradouro, numero, status: statusBanco
    });

    if (!updated) {
      return res.status(404).json({ message: "Fornecedor não encontrado." });
    }

    return res.status(200).json({ message: "Fornecedor atualizado com sucesso!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao atualizar Fornecedor." });
  }
};

export const excluirFornecedor = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Fornecedores.delete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Fornecedor não encontrado." });
    }

    return res.status(200).json({ message: "Fornecedor excluído com sucesso!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao excluir Fornecedor." });
  }
};
