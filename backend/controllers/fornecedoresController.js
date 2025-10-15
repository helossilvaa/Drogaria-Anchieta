import { Fornecedores } from "../models/fornecedores.js";
 
export const criarFornecedores = async (req, res) => {
  const { fornecedor, email, telefone, cnpj, cep, cidade, estado, endereco, status } = req.body;
 
  if (!fornecedor || !email || !telefone || !cnpj || !cep || !cidade || !estado || !endereco ||  status === undefined || status === null ) {
    return res.status(400).json({ message: "Preencha todos os campos." });
  }
 
  try {
    const insertId = await Fornecedores.create({ fornecedor, email, telefone, cnpj, cep, cidade, estado, endereco, status  });
    return res.status(201).json({ message: "Fornecedor cadastrado com sucesso!", id: insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao cadastrar Fornecedor." });
  }
};
 
export const listarFornecedores = async (req, res) => {
  try {
    const fornecedores = await Fornecedores.getAll();
    return res.status(200).json(fornecedores);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao listar Fornecedores." });
  }
};