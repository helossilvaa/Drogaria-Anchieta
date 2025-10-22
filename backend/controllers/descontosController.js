import { Descontos } from "../models/descontos.js";

//Lista todos os descontos
export const listarDescontos = async (req, res) => {
  try {
    const descontos = await Descontos.getAll();
    return res.status(200).json(descontos);
  } catch (err) {
    console.error("Erro ao listar os descontos:", err);
    return res.status(500).json({ message: "Erro ao listar os descontos." });
  }
};

//Função para criar desconto
export const criarDesconto = async (req, res) => {
  try {
    const { tipodesconto_id, nome, desconto } = req.body;

    if (typeof nome !== "string" || nome.trim() === "") {
      return res.status(400).json({ message: "Nome do desconto é inválido." });
    }

    const descontoExistente = await Descontos.getByNome(nome);
    if (descontoExistente) {
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