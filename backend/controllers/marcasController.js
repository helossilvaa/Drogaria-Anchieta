import{
    listarMarca,
    obterMarcaPorID,
    atualizarMarca,
    deletarMarca,
    criarMarca
} from "../models/marcas.js";

const criarMarcaController = async (req, res) => {
    try{
        const {id, marca} = req.body;
        const marcaData = {id, marca};

        await criarMarca (marcaData);
        res.status(201).json({mensagem: 'Marca criada com sucesso!'});
    }catch (error){
        console.error('Erro ao criar marca: ', error);
        res.status(500).json({mensagem: 'Erro ao criar marca'});
    }
}

const listarMarcaController = async (req, res) => {
    try {
        const marca = await listarMarca();
        res.status(200).json(marca);
    }catch (error) {
        console.error('Erro ao listar marca: ', error);
        res.status(500).json({mensagem: 'Erro ao listar marca'});
    }
};

const obterMarcaPorIDController = async (req, res) => {
    try{
        const {id} = req.params;
        const marca = await obterMarcaPorID(id);

        if (!marca){
            return res.status(404).json({mensagem: 'Marca não encontrada'});
        }

        res.status(200).json(marca);
    }catch (error){
        console.error ('Erro ao onter marca por ID: ', error);
        res.status(500).json({mensagem:'Erro ao obter marca'});
    }
};

const deletarMarcaController = async (req, res) => {
    try{
        const {id} = req.params;
        const marca = await obterMarcaPorID(id);

        if(!marca){
            return res.status(404).json({mensagem: 'Marca não encontrado'});
        }
        await deletarMarca(id);
        res.status(200).json({mensagem: 'Marca deletada com sucesso!'});
    }catch (error){
        console.error('Erro ao deletar marca: ', error);
        res.status(500).json({mensagem: 'Erro ao deletar marca'});
    }
};

const atualizarMarcaController = async (req, res) =>{
    try{
        const {id} = req.params;
        const {marca} = req.body;

        const marcaExistir = await obterMarcaPorID(id);
        if (!marcaExistir){
            return res.status(404).json({mensagem: 'Marca não encontrada'});
        }
        const marcaData = {id, marca};

        await atualizarMarca (id, marcaData);
        res.status(200).json({mensagem:'marca atualizada'});
    }catch (error) {
        console.error('Erro ao atualizar: ', error);
        res.status(500).json({mensagem: 'Erro ao atualizar'});
    }
};

export{
    criarMarcaController,
    listarMarcaController,
    obterMarcaPorIDController,
    deletarMarcaController,
    atualizarMarcaController
};