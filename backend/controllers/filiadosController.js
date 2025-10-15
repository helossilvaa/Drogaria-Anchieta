import { Filiado } from "../models/filiados.js";

export const criarFiliado = async (req, res) => {
  const { nome, cpf, data_nascimento, email, telefone, cep, cidade, estado, bairro, logradouro, numero } = req.body;

  if (!nome || !cpf || !data_nascimento || !email || !telefone || !cep || !cidade || !estado || !bairro || !logradouro || !numero) {
    return res.status(400).json({ message: "Preencha todos os campos." });
  }

  // Validar estado - deve ser sigla de 2 letras maiúsculas
  if (!/^[A-Z]{2}$/.test(estado)) {
    return res.status(400).json({ message: "Estado deve ser uma sigla de 2 letras maiúsculas." });
  }

  // Validar CEP - exatamente 8 dígitos numéricos
  if (!/^\d{8}$/.test(cep)) {
    return res.status(400).json({ message: "CEP deve conter exatamente 8 dígitos numéricos." });
  }

  // Validar telefone - exatamente 9 dígitos numéricos
  if (!/^\d{9}$/.test(telefone)) {
    return res.status(400).json({ message: "Telefone deve conter exatamente 9 dígitos numéricos." });
  }

  // Validar CPF - exatamente 11 dígitos numéricos
  if (!/^\d{11}$/.test(cpf)) {
    return res.status(400).json({ message: "CPF deve conter exatamente 11 dígitos numéricos." });
  }


  try {
    // Verificar se já existe usuário com esse CPF
    const existente = await Filiado.getByCPF(cpf);
    if (existente) {
      return res.status(400).json({ message: "Usuário já cadastrado com este CPF." });
    }

    const insertId = await Filiado.create({ nome, cpf, data_nascimento, email, telefone, cep, cidade, estado, bairro, logradouro, numero });
    return res.status(201).json({ message: "Usuário cadastrado com sucesso!", id: insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao cadastrar usuário." });
  }
};

export const listarFiliados = async (req, res) => {
  try {
    const filiados = await Filiado.getAll();
    return res.status(200).json(filiados);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao listar usuários." });
  }
};