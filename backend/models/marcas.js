import { create, deleteRecord, read, readAll, update } from "../config/database.js";

const criarMarca = async (marcaData) => {
    try {
        return await create ('Marca', marcaData);
    }catch (error) {
        console.error('Erro ao criar marca: ', error);
        throw error;
    }
};

const listarMarca = async ()=>{
    try{
        return await readAll ('marca');
    }catch (error){
        console.error('Erro ao listar marca: ', error);
        throw error;
    }
};

const obterMarcaPorID = async (id) => {
    try{
        return await read ('marca', `id = ${id}`);

    }catch (error) {
        console.error('Erro ao obter marca por id: ', error);
        throw error;
    }
};

const atualizarMarca = async (id, marcaData) => {
    try{
        return await update ('marca', marcaData, `id = ${id}`);
    }catch (error) {
        console.error('Error ao atualizar marca: ', error);
        throw error;
    }
};

const deletarMarca = async (id) => {
    try{
        return await deleteRecord ('marca', `id = ${id}`);
    }catch (error) {
        console.error('Erro ao deletar marca: ', error);
        throw error;
    }
};

export{criarMarca, atualizarMarca, listarMarca, deletarMarca, obterMarcaPorID};