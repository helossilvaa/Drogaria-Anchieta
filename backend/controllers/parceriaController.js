import { Parcerias } from "../models/parceria.js";

// Lista todas as parcerias
export const listarParcerias = async (req, res) => {
  try {
    const parcerias = await Parcerias.getAll();
    return res.status(200).json(parcerias);
  } catch (err) {
    console.error("Erro ao listar parcerias:", err);
    return res.status(500).json({ message: "Erro ao listar parcerias." });
  }
};

// Criar nova parceria
export const criarParceria = async (req, res) => {
  try {
    const { parceiro, porcentagem } = req.body;

    if (!parceiro || !porcentagem) {
      return res.status(400).json({ message: "Dados inválidos." });
    }

    // Verifica duplicidade de nome (case insensitive)
    const parceiroExistente = await Parcerias.getByNome(parceiro);
    if (
      parceiroExistente &&
      parceiroExistente.parceiro.toLowerCase() === parceiro.toLowerCase()
    ) {
      return res.status(400).json({ message: "Já existe uma parceria com este nome." });
    }

    const novaParceria = await Parcerias.create({ parceiro, porcentagem });
    return res.status(201).json(novaParceria);
  } catch (err) {
    console.error("Erro ao criar parceria:", err);
    return res.status(500).json({ message: "Erro ao criar parceria." });
  }
};

// Atualizar parceria existente
export const atualizarParceria = async (req, res) => {
  try {
    const { id } = req.params;
    const { parceiro, porcentagem } = req.body;

    if (!parceiro || !porcentagem) {
      return res.status(400).json({ message: "Dados inválidos." });
    }

    // Verifica se a parceria existe
    const parceriaExistente = await Parcerias.getAll();
    const parceria = parceriaExistente.find(p => p.id === parseInt(id));
    if (!parceria) {
      return res.status(404).json({ message: "Parceria não encontrada." });
    }

    // Atualiza no banco
    await Parcerias.update(id, { parceiro, porcentagem });
    return res.status(200).json({ message: "Parceria atualizada com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar parceria:", err);
    return res.status(500).json({ message: "Erro ao atualizar parceria." });
  }
};

// Excluir parceria
export const excluirParceria = async (req, res) => {
  const { id } = req.params;
  try {
    const parceria = await Parcerias.getAll();
    const parceriaExistente = parceria.find(p => p.id === parseInt(id));

    if (!parceriaExistente) {
      return res.status(404).json({ message: "Parceria não encontrada." });
    }

    await Parcerias.delete(id);
    return res.status(200).json({ message: "Parceria excluída com sucesso." });
  } catch (err) {
    console.error("Erro ao excluir parceria:", err);
    return res.status(500).json({ message: "Erro ao excluir parceria." });
  }
};