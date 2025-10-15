import{
    listarEstoque,
    obterEstoquePorID,
    atualizarEstoque,
    deletarEstoque,
    criarEstoque
} from "../models/estoque_Matriz.js";

const criarEstoqueController = async (req, res) => {
    try{
        const {id, produto_id, quantidade, estoque_minimo, estoque_maximo, locolizacao, lote_id, data_atualizacao} = req.body;
        const estoqueData = {id, produto_id, quantidade, estoque_minimo, estoque_maximo, locolizacao, lote_id, data_atualizacao};

        await criarEstoque (estoqueData);
        res.status(201).json({mensagem: 'Estoque matriz criada com sucesso!'});
    }catch (error){
        console.error('Erro ao criar estoque metriz: ', error);
        res.status(500).json({mensagem: 'Erro ao criar estoque matriz'});
    }
}

const listarEstoqueController = async (req, res) => {
    try {
        const estoque = await listarEstoque();
        res.status(200).json(estoque);
    }catch (error) {
        console.error('Erro ao listar estoque matriz: ', error);
        res.status(500).json({mensagem: 'Erro ao listar estoque matriz'});
    }
};

const obterEstoquePorIDController = async (req, res) => {
    try{
        const {id} = req.params;
        const estoque = await obterEstoquePorID(id);

        if (!estoque){
            return res.status(404).json({mensagem: 'Estoque matriz não encontrada'});
        }

        res.status(200).json(estoque);
    }catch (error){
        console.error ('Erro ao onter estoque matriz por ID: ', error);
        res.status(500).json({mensagem:'Erro ao obter estoque matriz'});
    }
};

const deletarEstoqueController = async (req, res) => {
    try{
        const {id} = req.params;
        const estoque = await obterEstoquePorID(id);

        if(!estoque){
            return res.status(404).json({mensagem: 'Estoque matriz não encontrado'});
        }
        await deletarEstoque(id);
        res.status(200).json({mensagem: 'Estoque matriz deletada com sucesso!'});
    }catch (error){
        console.error('Erro ao deletar estoque matriz: ', error);
        res.status(500).json({mensagem: 'Erro ao deletar estoque matriz'});
    }
};

const atualizarEstoqueController = async (req, res) =>{
    try{
        const {id} = req.params;
        const {produto_id, quantidade, estoque_minimo, estoque_maximo, locolizacao, lote_id, data_atualizacao} = req.body;

        const estoqueExistir = await obterEstoquePorID(id);
        if (!estoqueExistir){
            return res.status(404).json({mensagem: 'Estoque matriz não encontrada'});
        }
        const estoqueData = {id, produto_id, quantidade, estoque_minimo, estoque_maximo, locolizacao, lote_id, data_atualizacao};

        await atualizarEstoque (id, estoqueData);
        res.status(200).json({mensagem:'estoque matriz atualizada'});
    }catch (error) {
        console.error('Erro ao atualizar: ', error);
        res.status(500).json({mensagem: 'Erro ao atualizar'});
    }
};

export{
    criarEstoqueController,
    listarEstoqueController,
    obterEstoquePorIDController,
    deletarEstoqueController,
    atualizarEstoqueController
};