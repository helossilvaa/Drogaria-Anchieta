import { create, deleteRecord, read, readAll, update } from "../config/database.js";

const criarCategoria = async (categoriaData) => {
    try {
        return await create ('Categoria', categoriaData);
    }catch (error) {
        console.error('Erro ao categoria: ', error);
        throw error;
    }
};

const listarCategoria = async ()=>{
    try{
        return await readAll ('categoria');
    }catch (error){
        console.error('Erro ao listar categoria: ', error);
        throw error;
    }
};

const obterCategoriaPorID = async (id) => {
    try{
        return await read ('categoria', `id = ${id}`);

    }catch (error) {
        console.error('Erro ao obter categoria por id: ', error);
        throw error;
    }
};

const atualizarCategoria = async (id, categoriaData) => {
    try{
        return await update ('categoria', categoriaData, `id = ${id}`);
    }catch (error) {
        console.error('Error ao atualizar categoria: ', error);
        throw error;
    }
};

const deletarCategoria = async (id) => {
    try{
        return await deleteRecord ('categoria', `id = ${id}`);
    }catch (error) {
        console.error('Erro ao deletar categoria: ', error);
        throw error;
    }
};

export{criarCategoria, atualizarCategoria, listarCategoria, deletarCategoria, obterCategoriaPorID};