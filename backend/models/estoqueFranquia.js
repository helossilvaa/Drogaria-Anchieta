import { create, deleteRecord, read, readAll, update } from "../config/database.js";

const criarEstoqueFranquia = async (estoqueFranquiaData) => {
    try {
        return await create('estoque_franquia', estoqueFranquiaData);
    } catch (error) {
        console.error('Erro ao criar estoque da franquia: ', error);
        throw error;
    }
};

const listarEstoqueFranquia = async () => {
    try {
        return await readAll('estoque_franquia');
    } catch (error) {
        console.error('Erro ao listar estoque da franquia: ', error);
        throw error;
    }
};

const obterEstoqueFranquiaPorId = async (id) => {
    try {
        return await read('estoque_franquia', `id = ${id}`);

    } catch (error) {
        console.error('Erro ao obter estoque da franquia por id: ', error);
        throw error;
    }
};

const atualizarEstoqueFranquia = async (id, estoqueFranquiaData) => {
    try {
        return await update('estoque_franquia', estoqueFranquiaData, `id = ${id}`);
    } catch (error) {
        console.error('Error ao atualizar estoque da franquia: ', error);
        throw error;
    }
};

const deletarEstoqueFranquia = async (id) => {
    try {
        return await deleteRecord('estoque_franquia', `id = ${id}`);
    } catch (error) {
        console.error('Erro ao deletar estoque da franquia: ', error);
        throw error;
    }
};

export { criarEstoqueFranquia, listarEstoqueFranquia, obterEstoqueFranquiaPorId, atualizarEstoqueFranquia, deletarEstoqueFranquia };