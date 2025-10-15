import{
    listarCaixa,
    obterCaixaPorID,
    atualizarCaixa,
    criarCaixa,
    mudarStatusCaixa
} from "../models/abrirFechar_Caixa.js";

const criarCaixaController = async (req, res) => {
    try{

        const {id} = req.params;
        const caixa = await obterCaixaPorID(id);

        if (!caixa){
            return res.status(500).json({mensagem: 'Caixa já existe!'});
        }  else {
            const {id, status, usuario_id, saldo_inicial, unidade_id} = req.body;
            const CaixaData = {id, status, usuario_id, saldo_inicial, unidade_id};

        await criarCaixa(CaixaData);
        res.status(201).json({mensagem: 'Caixa criado com sucesso!'});
        }
        
    }catch (error){
        console.error('Erro ao criar caixa: ', error);
        res.status(500).json({mensagem: 'Erro ao criar caixa'});
    }
}

const listarCaixaController = async (req, res) => {
    try {
        const Caixa = await listarCaixa();
        res.status(200).json(Caixa);
    }catch (error) {
        console.error('Erro ao listar: ', error);
        res.status(500).json({mensagem: 'Erro ao listar'});
    }
};

const obterCaixaPorIDController = async (req, res) => {
    try{
        const {id} = req.params;
        const caixa = await obterCaixaPorID(id);

        if (!caixa){
            return res.status(404).json({mensagem: 'Caixa não encontrado'});
        }

        res.status(200).json(caixa);
    }catch (error){
        console.error ('Erro ao obter caixa por ID: ', error);
        res.status(500).json({mensagem:'Erro ao obter'});
    }
};

const atualizarCaixaController = async (req, res) =>{
    try{
        const {id} = req.params;
        const {status, usuario_id, saldo_inicial, unidade_id} = req.body;

        const CaixaExistir = await obterCaixaPorID(id);

        if (!CaixaExistir){
            return res.status(404).json({mensagem: 'Caixa não encontrado'});
        }
        const CaixaData = {id, status, usuario_id, saldo_inicial, unidade_id};

        await atualizarCaixa (id, CaixaData);
        res.status(200).json({mensagem:'Caixa atualizado'});
    }catch (error) {
        console.error('Erro ao atualizar: ', error);
        res.status(500).json({mensagem: 'Erro ao atualizar'});
    }
};


const atualizarStatusCaixaController = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (status !== 'aberto' && status !== 'fechado') {
            return res.status(400).json({ mensagem: 'Status inválido. Use "Aberto" ou "Fechado".' });
        }

        await mudarStatusCaixa(id, status);
        res.status(200).json({ mensagem: `Status do caixa alterado para ${status} com sucesso!` });

        
    } catch (error) {
        console.error('Erro ao atualizar o status do caixa: ', error);
        res.status(500).json({mensagem: 'Erro ao atualizar status'});
    }
}

export{
    criarCaixaController,
    listarCaixaController,
    obterCaixaPorIDController,
    atualizarCaixaController,
    atualizarStatusCaixaController
};