import { create, deleteRecord, read, readAll, update } from "../config/database.js";

const criarEstoque = async (estoqueData) => {
    try {
        return await create ('Estoque', estoqueData);
    }catch (error) {
        console.error('Erro ao criar estoque matriz: ', error);
        throw error;
    }
};

const listarEstoque = async ()=>{
    try{
        return await readAll ('estoque');
    }catch (error){
        console.error('Erro ao listar estoque matriz: ', error);
        throw error;
    }
};

const obterEstoquePorID = async (id) => {
    try{
        return await read ('estoque', `id = ${id}`);

    }catch (error) {
        console.error('Erro ao obter estoque matriz por id: ', error);
        throw error;
    }
};

const atualizarEstoque = async (id, estoqueData) => {
    try{
        return await update ('estoque', estoqueData, `id = ${id}`);
    }catch (error) {
        console.error('Error ao atualizar estoque matriz: ', error);
        throw error;
    }
};

const deletarEstoque = async (id) => {
    try{
        return await deleteRecord ('estoque', `id = ${id}`);
    }catch (error) {
        console.error('Erro ao deletar estoque matriz: ', error);
        throw error;
    }
};

export{criarEstoque, atualizarEstoque, listarEstoque, deletarEstoque, obterEstoquePorID};