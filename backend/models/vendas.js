import { create, read, readAll, update } from "../config/database.js";

const criarVenda = async (VendaData) => {
    try {
        return await create ('Venda', VendaData);
    }catch (error) {
        console.error('Erro ao criar venda: ', errr);
        throw error;
    }
};

const listarVenda = async ()=>{
    try{
        return await readAll ('Venda');
    }catch (error){
        console.error('Erro ao listar venda: ', error);
        throw error;
    }
};

const obterVendaPorID = async (id) => {
    try{
        return await read ('Venda', `id = ${id}`);

    }catch (error) {
        console.error('Erro ao obter venda por id: ', error);
        throw error;
    }
};

const atualizarVenda = async (id, VendaData) => {
    try{
        return await update ('Venda', VendaData, `id = ${id}`);
    }catch (error) {
        console.error('Error ao atualizar: ', error);
        throw error;
    }
};


export{criarVenda, atualizarVenda, listarVenda, obterVendaPorID};