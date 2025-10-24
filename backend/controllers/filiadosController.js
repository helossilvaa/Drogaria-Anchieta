import { Filiado } from "../models/filiados.js";

export const criarFiliado = async (req, res) => {
  console.log("Dados recebidos do frontend:", req.body);

  try {
    const {
      nome,
      cpf,
      data_nascimento,
      email,
      telefone,
      cep,
      cidade,
      estado,
      bairro,
      logradouro,
      numero,
      tipodesconto
    } = req.body;
    
    //Verificação de campos obrigatórios
    const camposObrigatorios = {
      nome,
      cpf,
      data_nascimento,
      email,
      telefone,
      cep,
      cidade,
      estado,
      bairro,
      logradouro,
      numero,
      tipodesconto
    };

    const camposVazios = Object.entries(camposObrigatorios)
      .filter(([_, valor]) => !valor || valor === "")
      .map(([campo]) => campo);

    if (camposVazios.length > 0) {
      return res.status(400).json({
        message: `Preencha todos os campos. Campos vazios: ${camposVazios.join(", ")}`
      });
    }

    //Verifica se já existe CPF cadastrado
    const existente = await Filiado.getByCPF(cpf);
    if (existente) {
      return res
        .status(400)
        .json({ message: "Usuário já cadastrado com este CPF." });
    }

    // Cria o novo registro
    const id = await Filiado.create({
      nome,
      cpf,
      data_nascimento,
      email,
      telefone,
      cep,
      cidade,
      estado,
      bairro,
      logradouro,
      numero,
      tipodesconto
    });
    return res
      .status(201)
      .json({ message: "Usuário cadastrado com sucesso!", id });
  } catch (err) {
    console.error("Erro no cadastro:", err);
    return res.status(500).json({
      message: "Erro ao cadastrar usuário.",
      erro: err.message
    });
  }
};
//Lista todos os filiados
export const listarFiliados = async (req, res) => {
  try {
    const filiados = await Filiado.getAll();
    return res.status(200).json(filiados);
  } catch (err) {
    console.error("Erro ao listar filiados:", err);
    return res.status(500).json({ message: "Erro ao listar usuários." });
  }
};
//Atualiza um filiado pelo ID
export const atualizarFiliado = async (req, res) => {
  const { id } = req.params;
  const dados = req.body;

  try {
    const atualizado = await Filiado.update(id, dados);

    if (atualizado === 0) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    return res.status(200).json({ message: "Usuário atualizado com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar:", err);
    return res.status(500).json({ message: "Erro ao atualizar usuário." });
  }
};

//Deleta um filiado pelo ID
export const deletarFiliado = async (req, res) => {
  const { id } = req.params;

  try {
    const deletado = await Filiado.delete(id);

    if (deletado === 0) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    return res.status(200).json({ message: "Usuário excluído com sucesso!" });
  } catch (err) {
    console.error("Erro ao excluir:", err);
    return res.status(500).json({ message: "Erro ao excluir usuário." });
  }
};
