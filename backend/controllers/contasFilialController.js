// controllers/contasFilialController.js

import { Conta } from "../models/contasFilial.js";

export const criarConta = async (req, res) => {
  const {
    id, nomeConta, dataPostada, dataVencimento, valor, conta_pdf, status
  } = req.body;

  if (!id || !nomeConta || !dataPostada || !dataVencimento || !valor || !conta_pdf ||
    status === undefined || status === null) {
    return res.status(400).json({ message: "Preencha todos os campos." });
  }

  const statusBanco = status === true ? 'pendente' : 'pago';

  try {
    const insertId = await Conta.create({
      id, nomeConta, dataPostada, dataVencimento, valor, conta_pdf, status: statusBanco
    });

    return res.status(201).json({ message: "Conta cadastrada com sucesso!", id: insertId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao cadastrar Conta." });
  }
};

export const listarConta = async (req, res) => {
  try {
    const contas = await Conta.getAll();

    const contasConvertidas = contas.map((f) => ({
      ...f,
      status: f.status === "pendente"
    }));

    return res.status(200).json(contasConvertidas);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao listar contas." });
  }
};

export const editarConta = async (req, res) => {
  const { id } = req.params;
  const {
    nomeConta, dataPostada, dataVencimento, valor, conta_pdf, status
  } = req.body;

  if (!id || !nomeConta || !dataPostada || !dataVencimento || !valor || !conta_pdf ||
    status === undefined || status === null) {
    return res.status(400).json({ message: "Preencha todos os campos." });
  }

  // ✅ CORRETO: Converte boolean (do frontend) para string ('pendente'/'pago' no DB)
  const statusBanco = status === true ? 'pendente' : 'pago';

  try {
    // Removido 'id' do objeto de update, pois o ID já está nos parâmetros (req.params)
    const updated = await Conta.update(id, {
      nomeConta, dataPostada, dataVencimento, valor, conta_pdf, status: statusBanco
    });

    if (!updated) {
      return res.status(404).json({ message: "Conta não encontrada." });
    }

    return res.status(200).json({ message: "Conta atualizada com sucesso!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao atualizar conta." });
  }
};

export const excluirConta = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Conta.delete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Conta não encontrado." });
    }

    return res.status(200).json({ message: "Conta excluído com sucesso!" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Erro ao excluir conta." });
  }
};