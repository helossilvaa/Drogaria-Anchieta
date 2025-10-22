import{criarEstoqueMatriz, listarEstoqueMatriz, obterEstoqueMatrizPorID, atualizarEstoqueMatriz, deletarEstoqueMatriz} from "../models/estoqueMatriz.js";

const criarEstoqueMatrizController = async (req, res) => {
    try{
        const {id, produto_id, quantidade, estoque_minimo, estoque_maximo, locolizacao, lote_id, data_atualizacao} = req.body;
        const estoqueMatrizData = {id, produto_id, quantidade, estoque_minimo, estoque_maximo, locolizacao, lote_id, data_atualizacao};

        await criarEstoqueMatriz (estoqueMatrizData);
        res.status(201).json({mensagem: 'Estoque matriz criada com sucesso!'});
    }catch (error){
        console.error('Erro ao criar estoque metriz: ', error);
        res.status(500).json({mensagem: 'Erro ao criar estoque matriz'});
    }
}

const listarEstoqueMatrizController = async (req, res) => {
    try {
        const estoqueMatriz = await listarEstoqueMatriz();
        res.status(200).json(estoqueMatriz);
    }catch (error) {
        console.error('Erro ao listar estoque matriz: ', error);
        res.status(500).json({mensagem: 'Erro ao listar estoque matriz'});
    }
};

const obterEstoqueMatrizPorIDController = async (req, res) => {
    try{
        const {id} = req.params;
        const estoqueMatriz = await obterEstoqueMatrizPorID(id);

        if (!estoqueMatriz){
            return res.status(404).json({mensagem: 'Estoque matriz não encontrado'});
        }

        res.status(200).json(estoqueMatriz);
    }catch (error){
        console.error ('Erro ao onter estoque matriz por ID: ', error);
        res.status(500).json({mensagem:'Erro ao obter estoque matriz'});
    }
};

const deletarEstoqueMatrizController = async (req, res) => {
    try{
        const {id} = req.params;
        const estoqueMatriz = await obterEstoqueMatrizPorID(id);

        if(!estoqueMatriz){
            return res.status(404).json({mensagem: 'Estoque matriz não encontrado'});
        }
        await deletarEstoqueMatriz(id);
        res.status(200).json({mensagem: 'Estoque matriz deletada com sucesso!'});
    }catch (error){
        console.error('Erro ao deletar estoque matriz: ', error);
        res.status(500).json({mensagem: 'Erro ao deletar estoque matriz'});
    }
};

const atualizarEstoqueMatrizController = async (req, res) =>{
    try{
        const {id} = req.params;
        const {produto_id, quantidade, estoque_minimo, estoque_maximo, locolizacao, lote_id, data_atualizacao} = req.body;

        const estoqueMatrizExistente = await obterEstoqueMatrizPorID(id);
        if (!estoqueMatrizExistente){
            return res.status(404).json({mensagem: 'Estoque matriz não encontrada'});
        }
        const estoqueMatrizData = {id, produto_id, quantidade, estoque_minimo, estoque_maximo, locolizacao, lote_id, data_atualizacao};

        await atualizarEstoqueMatriz (id, estoqueMatrizData);
        res.status(200).json({mensagem:'estoque matriz atualizada'});
    }catch (error) {
        console.error('Erro ao atualizar: ', error);
        res.status(500).json({mensagem: 'Erro ao atualizar'});
    }
};

export{
    criarEstoqueMatrizController,
    listarEstoqueMatrizController,
    obterEstoqueMatrizPorIDController,
    deletarEstoqueMatrizController,
    atualizarEstoqueMatrizController
};