import { create, deleteRecord, read, readAll, update } from "../config/database.js";

const criarEstoqueMatriz = async (estoqueMatrizData) => {
    try {
        return await create ('estoque_matriz', estoqueMatrizData);
    }catch (error) {
        console.error('Erro ao criar estoque matriz: ', error);
        throw error;
    }
};

const listarEstoqueMatriz = async ()=>{
    try{
        return await readAll ('estoque_matriz');
    }catch (error){
        console.error('Erro ao listar estoque matriz: ', error);
        throw error;
    }
};

const obterEstoqueMatrizPorID = async (id) => {
    try{
        return await read ('estoque_matriz', `id = ${id}`);

    }catch (error) {
        console.error('Erro ao obter estoque matriz por id: ', error);
        throw error;
    }
};

const atualizarEstoqueMatriz = async (id, estoqueMatrizData) => {
    try{
        return await update ('estoque_matriz', estoqueMatrizData, `id = ${id}`);
    }catch (error) {
        console.error('Error ao atualizar estoque matriz: ', error);
        throw error;
    }
};

const deletarEstoqueMatriz = async (id) => {
    try{
        return await deleteRecord ('estoque_matriz', `id = ${id}`);
    }catch (error) {
        console.error('Erro ao deletar estoque matriz: ', error);
        throw error;
    }
};

export{criarEstoqueMatriz, listarEstoqueMatriz, obterEstoqueMatrizPorID, atualizarEstoqueMatriz, deletarEstoqueMatriz};