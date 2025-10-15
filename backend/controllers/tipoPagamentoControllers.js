import{
    listarTipoPagamento
}from "../models/tipoPagamento.js";

const listarTipoPagamentoController = async(req, res) =>{
    try{
        const pagamentos = await listarTipoPagamento();
        res.status(200).json(pagamentos);
    }catch (error){
        console.error('Erro ao listar tipo de pagamento: ', error);
        res.status(500).json({mensagem: 'Erro ao listar tipo de pagamento'})
    }
};

export{
    listarTipoPagamentoController
};