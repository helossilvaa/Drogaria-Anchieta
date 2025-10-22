import { readAll } from "../config/database.js";

export const listarTiposDescontos = async (req, res) => {
  try {
    const result = await readAll("tiposdescontos");
    res.status(200).json(result);
  } catch (err) {
    console.error("Erro ao listar tipos de desconto:", err);
    res.status(500).json({ message: "Erro ao listar tipos de desconto." });
  }
};