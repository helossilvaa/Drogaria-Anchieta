import { Conta } from "../models/contasFilial.js";

// 📤 Criar nova conta
export const criarConta = async (req, res) => {
  const { nomeConta, dataPostada, dataVencimento, valor, conta_pdf, status } = req.body;

  // Validação
  if (
    !nomeConta ||
    !dataPostada ||
    !dataVencimento ||
    !valor ||
    status === undefined ||
    status === null
  ) {
    return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
  }

  // Converte o status booleano para string do banco
  const statusBanco = status === true ? "pendente" : "paga";

  try {
    const insertId = await Conta.create({
      nomeConta,
      dataPostada,
      dataVencimento,
      valor,
      conta_pdf: conta_pdf ? Buffer.from(conta_pdf, "base64") : null,
      status: statusBanco,
    });

    return res
      .status(201)
      .json({ message: "Conta cadastrada com sucesso!", id: insertId });
  } catch (err) {
    console.error("Erro ao cadastrar conta:", err);
    return res.status(500).json({ message: "Erro ao cadastrar conta." });
  }
};

// 📥 Listar todas as contas
export const listarConta = async (req, res) => {
  try {
    const contas = await Conta.getAll();

    // Converte Buffer / ArrayBuffer → Base64 para o frontend exibir o PDF
    const contasConvertidas = contas.map((f) => {
      let conta_pdf_base64 = null;

      if (f.conta_pdf) {
        try {
          // Caso venha como Buffer (Node)
          if (Buffer.isBuffer(f.conta_pdf)) {
            conta_pdf_base64 = f.conta_pdf.toString("base64");
          }
          // Caso venha como ArrayBuffer (MySQL2 ou outros drivers)
          else if (f.conta_pdf instanceof ArrayBuffer || f.conta_pdf?.buffer) {
            conta_pdf_base64 = Buffer.from(f.conta_pdf).toString("base64");
          }
        } catch (e) {
          console.error("Erro ao converter PDF:", e);
        }
      }

      return {
        ...f,
        status: f.status === "pendente", // converte para booleano
        conta_pdf: conta_pdf_base64,
      };
    });

    return res.status(200).json(contasConvertidas);
  } catch (err) {
    console.error("Erro ao listar contas:", err);
    return res.status(500).json({ message: "Erro ao listar contas." });
  }
};

// ✏️ Editar conta existente
export const editarConta = async (req, res) => {
  const { id } = req.params;
  const { nomeConta, dataPostada, dataVencimento, valor, conta_pdf, status } = req.body;

  if (
    !nomeConta ||
    !dataPostada ||
    !dataVencimento ||
    !valor ||
    status === undefined ||
    status === null
  ) {
    return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
  }

  const statusBanco = status === true ? "pendente" : "paga";

  try {
    const updated = await Conta.update(id, {
      nomeConta,
      dataPostada,
      dataVencimento,
      valor,
      status: statusBanco,
      ...(conta_pdf ? { conta_pdf: Buffer.from(conta_pdf, "base64") } : {}), // PDF opcional
    });

    if (!updated) {
      return res.status(404).json({ message: "Conta não encontrada." });
    }

    return res.status(200).json({ message: "Conta atualizada com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar conta:", err);
    return res.status(500).json({ message: "Erro ao atualizar conta." });
  }
};

// 🗑️ Excluir conta
export const excluirConta = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await Conta.delete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Conta não encontrada." });
    }

    return res.status(200).json({ message: "Conta excluída com sucesso!" });
  } catch (err) {
    console.error("Erro ao excluir conta:", err);
    return res.status(500).json({ message: "Erro ao excluir conta." });
  }
};
