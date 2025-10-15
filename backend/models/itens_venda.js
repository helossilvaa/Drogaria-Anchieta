import { create, deleteRecord, read, readAll, update } from "../config/database.js";

const criarItemVenda = async (itemVendaData) => {
    try {
        return await create ('itemVenda', itemVendaData);
    }catch (error) {
        console.error('Erro ao criar item: ', errr);
        throw error;
    }
};

const listarItemVenda = async ()=>{
    try{
        return await readAll ('itemVenda');
    }catch (error){
        console.error('Erro ao listar item: ', error);
        throw error;
    }
};

const obterItemVendaPorID = async (id) => {
    try{
        return await read ('itemVenda', `id = ${id}`);

    }catch (error) {
        console.error('Erro ao obter item por id: ', error);
        throw error;
    }
};

const atualizarItemVenda = async (id, itemVendaData) => {
    try{
        return await update ('itemVenda', itemVendaData, `id = ${id}`);
    }catch (error) {
        console.error('Error ao atualizar: ', error);
        throw error;
    }
};

const deletarItemVenda = async (id) => {
    try{
        return await deleteRecord ('itemVenda', `id = ${id}`);
    }catch (error) {
        console.error('Erro ao deletar: ', error);
        throw error;
    }
};

export{criarItemVenda, atualizarItemVenda, listarItemVenda, deletarItemVenda, obterItemVendaPorID};