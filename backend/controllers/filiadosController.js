import { Filiado } from "../models/filiados.js";
import { TipoDesconto } from "../models/tiposdesconto.js";

export const criarFiliado = async (req, res) => {
  const { nome, cpf, data_nascimento, email, telefone, cep, cidade, estado, bairro, logradouro, numero, tiposdescontos } = req.body;

  if (!nome || !cpf || !data_nascimento || !email || !telefone || !cep || !cidade || !estado || !bairro || !logradouro || !numero || !tiposdescontos) {
    return res.status(400).json({ message: "Preencha todos os campos." });
  }

  if (!/^[A-Z]{2}$/.test(estado)) {
    return res.status(400).json({ message: "Estado deve ser uma sigla de 2 letras maiúsculas." });
  }
  if (!/^\d{8}$/.test(cep)) {
    return res.status(400).json({ message: "CEP deve conter exatamente 8 dígitos numéricos." });
  }
  if (!/^\d{9}$/.test(telefone)) {
    return res.status(400).json({ message: "Telefone deve conter exatamente 9 dígitos numéricos." });
  }
  if (!/^\d{11}$/.test(cpf)) {
    return res.status(400).json({ message: "CPF deve conter exatamente 11 dígitos numéricos." });
  }

  try {
    const existente = await Filiado.getByCPF(cpf);
    if (existente) {
      return res.status(400).json({ message: "Usuário já cadastrado com este CPF." });
    }

  const tiposDescontoDisponiveis = await TipoDesconto.getAll();
    console.log("Tipos de Desconto disponíveis:", tiposDescontoDisponiveis);

    console.log("Dados recebidos para cadastro:", req.body);

    const insertId = await Filiado.create({
      nome, cpf, data_nascimento, email, telefone, cep, cidade, estado, bairro, logradouro, numero, tiposdescontos
    });

    console.log("Usuário cadastrado com ID:", insertId);

    return res.status(201).json({ message: "Usuário cadastrado com sucesso!", id: insertId });

  } catch (err) {
    console.error("Erro no cadastro:", err); 
    return res.status(500).json({ message: "Erro ao cadastrar usuário.", erro: err.message });
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

export const atualizarFiliado = async (req, res) => {
  const { id } = req.params;
  const dados = req.body;
  try {
   await Filiado.update(id, dados);
    res.status(200).json({ message: "Usuário atualizado com sucesso!" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar usuário." });
  }
};

export const deletarFiliado = async (req, res) => {
  const { id } = req.params;
  try {
    await Filiado.delete(id);
    res.status(200).json({ message: "Usuário excluído com sucesso!" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao excluir usuário." });
  }
};