import { create, readAll, read, update, deleteRecord } from "../config/database";

const criarProduto = async (produtoData) => {
    try {
        return await create('produtos', produtoData)
    } catch (error) {
        console.error('Erro ao criar produto: ', error);
        throw error;
    }
};

const listarProdutos = async () => {
    try {
        return await readAll('produtos');
    } catch (error) {
        console.error('Erro ao listar produtos: ', error)
    }
};
const obterProdutoPorId = async (id) => {
    try {
        return await read('produtos', `id = ${id}`)
    } catch (error) {
        console.error('Erro ao obter produto por id: ', error);
        throw error;
    }
};

const atualizarProduto = async (id, produtoData) => {
    try {
        return await update('produtos', `id = ${id}`, produtoData)
    } catch (error) {
        console.error('Erro ao atualizar produto: ', error)
    }
};

const deletarProduto = async (id) =>{
    try{
        return await deleteRecord ('produtos', `id = ${id}`);
    } catch (error){
        console.error('Erro ao deletar produto: ', error);
        throw error;
    }
}

export { criarProduto, listarProdutos, obterProdutoPorId, atualizarProduto, deletarProduto };