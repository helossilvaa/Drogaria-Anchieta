import { Parcerias } from "../models/parceria.js";

//Lista todos os descontos
export const listarParcerias = async (req, res) => {
  try {
    const parcerias = await Parcerias.getAll();
    return res.status(200).json(parcerias);
  } catch (err) {
    console.error("Erro ao listar parcerias:", err);
    return res.status(500).json({ message: "Erro ao listar parcerias." });
  }
};

// Função para criar uma nova parceria
export const criarParceria = async (req, res) => {
  const { parceiro, porcentagem } = req.body;

  if (!parceiro || !porcentagem) {
    return res.status(400).json({ message: "Dados inválidos" });
  }

  try {
    // Verificar se já existe um parceiro com o mesmo nome
    const parceiroExistente = await Parcerias.getAll();
    if (parceiroExistente.some(p => p.parceiro.toLowerCase() === parceiro.toLowerCase())) {
      return res.status(400).json({ message: "Já existe uma parceria com este nome." });
    }

    // Criar a nova parceria
    const novaParceria = await Parcerias.create({ parceiro, porcentagem });
    return res.status(201).json(novaParceria);

  } catch (err) {
    console.error("Erro ao criar parceria:", err);
    return res.status(500).json({ message: "Erro ao criar parceria." });
  }
};