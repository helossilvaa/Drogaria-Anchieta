import { Descontos } from "../models/descontos.js";

// Lista todos os descontos
export const listarDescontos = async (req, res) => {
  try {
    const descontos = await Descontos.getAll();
    return res.status(200).json(descontos);
  } catch (err) {
    console.error("Erro ao listar os descontos:", err);
    return res.status(500).json({ message: "Erro ao listar os descontos." });
  }
};

// Criar novo desconto
export const criarDesconto = async (req, res) => {
  try {
    const { tipodesconto_id, nome, desconto } = req.body;

    if (typeof nome !== "string" || nome.trim() === "") {
      return res.status(400).json({ message: "Nome do desconto é inválido." });
    }

    const descontoExistente = await Descontos.getByNome(nome);
    if (
      descontoExistente &&
      descontoExistente.nome.toLowerCase() === nome.toLowerCase()
    ) {
      return res.status(400).json({ message: "Já existe um desconto com esse nome." });
    }

    const novoDesconto = { tipodesconto_id, nome, desconto };
    const descontoCriado = await Descontos.create(novoDesconto);

    return res.status(201).json(descontoCriado);
  } catch (err) {
    console.error("Erro ao criar desconto:", err);
    return res.status(500).json({ message: "Erro ao criar desconto." });
  }
};

// Atualizar desconto existente
export const atualizarDesconto = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipodesconto_id, nome, desconto } = req.body;

    if (!nome || !desconto || !tipodesconto_id) {
      return res.status(400).json({ message: "Dados inválidos." });
    }

    const descontos = await Descontos.getAll();
    const descontoExistente = descontos.find(d => d.id === parseInt(id));

    if (!descontoExistente) {
      return res.status(404).json({ message: "Desconto não encontrado." });
    }

    const duplicado = descontos.find(
      d => d.nome.toLowerCase() === nome.toLowerCase() && d.id !== parseInt(id)
    );

    if (duplicado) {
      return res.status(400).json({ message: "Já existe um desconto com esse nome." });
    }

    await Descontos.update(id, { tipodesconto_id, nome, desconto });

    return res.status(200).json({ message: "Desconto atualizado com sucesso." });
  } catch (err) {
    console.error("Erro ao atualizar desconto:", err);
    return res.status(500).json({ message: "Erro ao atualizar desconto." });
  }
};

// Excluir desconto
export const excluirDesconto = async (req, res) => {
  try {
    const { id } = req.params;
    const descontoExistente = await Descontos.getAll();
    const desconto = descontoExistente.find(d => d.id === parseInt(id));

    if (!desconto) {
      return res.status(404).json({ message: "Desconto não encontrado." });
    }

    await Descontos.delete(id);
    return res.status(200).json({ message: "Desconto excluído com sucesso." });
  } catch (err) {
    console.error("Erro ao excluir desconto:", err);
    return res.status(500).json({ message: "Erro ao excluir desconto." });
  }
};
