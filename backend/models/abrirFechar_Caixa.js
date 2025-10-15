import { create, read, readAll, update } from "../config/database.js";

const criarCaixa = async (CaixaData) => {
    try {
        return await create ('Caixa', CaixaData);
    }catch (error) {
        console.error('Erro ao criar item: ', error);
        throw error;
    }
};

const listarCaixa = async ()=>{
    try{
        return await readAll ('Caixa');
    }catch (error){
        console.error('Erro ao listar: ', error);
        throw error;
    }
};

const obterCaixaPorID = async (id) => {
    try{
        return await read ('Caixa', `id = ${id}`);

    }catch (error) {
        console.error('Erro ao obter caixa por id: ', error);
        throw error;
    }
};

const atualizarCaixa = async (id, CaixaData) => {
    try{
        return await update ('Caixa', CaixaData, `id = ${id}`);
    }catch (error) {
        console.error('Error ao atualizar: ', error);
        throw error;
    }
};

const mudarStatusCaixa = async (id, novoStatus) => {
    try {
        const dadosParaAtualizar = { status: novoStatus };
        const caixa_id = `id = ${id}`;
        return await update('usuarios', dadosParaAtualizar, caixa_id);
    } catch (error) {
        console.error('Erro ao mudar status do caixa:', error);
        throw error;
    }
};

export{criarCaixa, atualizarCaixa, listarCaixa, obterCaixaPorID, mudarStatusCaixa};