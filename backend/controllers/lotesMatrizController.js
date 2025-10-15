import {
    criarLoteMatriz, listarLotesMatriz, obterLoteMatrizPorId, atualizarLoteMatriz, deletarLoteMatriz
} from "../models/produtos.js";

const criarLoteMatrizController = async (req, res) => {
    try {
        const { id, produto_id, numero_lote, data_validade, quantidade, data_entrada, fornecedor_id } = req.body;
        const loteMatrizData = { id, produto_id, numero_lote, data_validade, quantidade, data_entrada, fornecedor_id };
        await criarLoteMatriz(loteMatrizData);
        res.status(201).json({ mensagem: 'Produto criado com sucesso!' });

    } catch (error) {
        console.error('Erro ao criar produto: ', error);
        res.status(500).json({ mensagem: 'Erro ao criar produto' });
    }
};

const listarLotesMatrizController = async (req, res) => {
    try {
        const loteMatriz = await listarLotesMatriz();
        res.status(200).json(loteMatriz);
    } catch (error) {
        console.error('Erro ao listar produtos: ', error);
        res.status(500).json({ mensagem: 'Erro ao listar produtos' });
    }
};

const obterLoteMatrizPorIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const loteMatriz = await obterLoteMatrizPorId(id);

        if (!loteMatriz) {
            return res.status(404).json({ mensagem: 'Produto não encontrado' });
        }
        res.status(200).json(loteMatriz);
    } catch (error) {
        console.error('Erro ao obter equipamento por patrimônio: ', error);
        res.status(500).json({ mensagem: 'Erro ao obter produto!!!' });
    }
};

const atualizarLoteMatrizController = async (req, res) => {
    try {
        const { id } = req.params;
        const { produto_id, numero_lote, data_validade, quantidade, data_entrada, fornecedor_id } = req.body;
        const loteMatrizExistente = await obterLoteMatrizPorId(id);

        if (!loteMatrizExistente) {
            return res.status(404).json({ mensagem: 'Produto não encontrado!!!' });
        }

        const loteMatrizData = { produto_id, numero_lote, data_validade, quantidade, data_entrada, fornecedor_id };
        await atualizarProduto(id, loteMatrizData);
        res.status(200).json({ mensagem: 'Produto atualizado com sucesso!!!' });

    } catch (error) {
        console.error('Erro ao atualizar produto: ', error);
        res.status(500).json({ mensagem: 'Erro ao atualizar produto!!!' });
    }
};

const deletarLoteMatrizController = async (req, res) => {
    try {
        const { id } = req.params;
        const loteMatriz = await obterLoteMatrizPorId(id);

        if (!loteMatriz) {
            return res.status(404).json({ mensagem: 'Produto não encontrado' });
        }
        await deletarLoteMatriz(id);
        res.status(200).json({ mensagem: 'Produto deletado com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar produto: ', error);
        res.status(500).json({ mensagem: 'Erro ao deletar produto' });
    }
};


export {
  criarLoteMatrizController, listarLotesMatrizController, obterLoteMatrizPorIdController, atualizarLoteMatrizController, deletarLoteMatrizController
}