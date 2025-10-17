import { create, deleteRecord, read, readAll, update } from "../config/database.js";

const criarMarca = async (marcaData) => {
    try {
        return await create ('marcas', marcaData);
    }catch (error) {
        console.error('Erro ao criar marca: ', error);
        throw error;
    }
};

const listarMarca = async ()=>{
    try{
        return await readAll ('marcas');
    }catch (error){
        console.error('Erro ao listar marca: ', error);
        throw error;
    }
};

const obterMarcaPorID = async (id) => {
    try{
        return await read ('marcas', `id = ${id}`);

    }catch (error) {
        console.error('Erro ao obter marca por id: ', error);
        throw error;
    }
};

const atualizarMarca = async (id, marcaData) => {
    try{
        return await update ('marcas', marcaData, `id = ${id}`);
    }catch (error) {
        console.error('Error ao atualizar marca: ', error);
        throw error;
    }
};

const deletarMarca = async (id) => {
    try{
        return await deleteRecord ('marcas', `id = ${id}`);
    }catch (error) {
        console.error('Erro ao deletar marca: ', error);
        throw error;
    }
};

export{criarMarca, atualizarMarca, listarMarca, deletarMarca, obterMarcaPorID};