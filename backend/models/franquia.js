import {create, readAll, read, update, deleteRecord} from '../config/database.js';


//criar usuario
const criarUnidade= async (FranquiaData) => {
    try {
        return await create('unidade', FranquiaData)
    } catch(error) {
        console.error('Erro ao criar franquia: ', error);
        throw error;
    }
}


//listar usuario
const listarUnidades = async () => {
    try {
        return await readAll('unidade');
    } catch (error) {
       console.error('Erro ao listar unidade: ', error);
        throw error;
    }
}


//obter usuario
const obterunidadeId = async (id)=> {
    try {
        return await read('unidade', `id = ${id}`)
    } catch (error) {
        console.error('Erro ao obter unidade por id: ', error);
        throw error;
    }
};


//atualizar usuario
const atualizarUnidade = async (id, atualizarUnidade) => {
  try {
    return await update('unidade', atualizarUnidade, `id = ${id}`);
  } catch (error) {
    console.error('Erro ao atualizar unidade por id:', error);
    throw error;
  }
};

//deletar o usuario
const deletarUnidade = async (id) => {
    try {
        return await deleteRecord('unidade', `id = '${id}'`);
    } catch (error) {
        console.error('Erro ao excluir unidade: ', error);
        throw error;
    }
    
};


//atualizar status do unidade (ativo ou inativo)
const mudarStatusUnidade = async (id, novoStatus) => {
    try {
        const dadosParaAtualizar = { status: novoStatus };
        const unidadeId = `id = ${id}`;
        return await update('usuarios', dadosParaAtualizar, unidadeId);
    } catch (error) {
        console.error('Erro ao mudar status do funcionário:', error);
        throw error;
    }
};



export { criarUnidade, listarUnidade, obterunidadeId, atualizarUnidade, deletarUnidade, mudarStatusUnidade };
