import { create, readAll, read, update, deleteRecord } from "../config/database";

const criarLoteMatriz = async (loteMatrizData) => {
    try {
        return await create('lotes_matriz', loteMatrizData)
    } catch (error) {
        console.error('Erro ao criar lote: ', error);
        throw error;
    }
};

const listarLotesMatriz = async () => {
    try {
        return await readAll('lotes_matriz');
    } catch (error) {
        console.error('Erro ao listar lotes: ', error)
    }
};
const obterLoteMatrizPorId = async (id) => {
    try {
        return await read('lotes_matriz', `id = ${id}`)
    } catch (error) {
        console.error('Erro ao obter o lote por id: ', error);
        throw error;
    }
};

const atualizarLoteMatriz = async (id, loteMatrizData) => {
    try {
        return await update('lotes_matriz', `id = ${id}`, loteMatrizData)
    } catch (error) {
        console.error('Erro ao atualizar o lote: ', error)
    }
};

const deletarLoteMatriz = async (id) =>{
    try{
        return await deleteRecord ('lotes_matriz', `id = ${id}`);
    } catch (error){
        console.error('Erro ao deletar lote: ', error);
        throw error;
    }
}

export {criarLoteMatriz, listarLotesMatriz, obterLoteMatrizPorId, atualizarLoteMatriz, deletarLoteMatriz };
