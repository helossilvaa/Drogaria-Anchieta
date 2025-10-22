import {
    criarTipoDeMedicamento,
    listarTiposDeMedicamentos,
    obterTiposDeMedicamentosPorId,
    atualizarTipoDeMedicamento,
    deletarTipoDeMedicamento
} from "../models/tipoMedicamento.js"

const criarTipoDeMedicamentoController = async (req, res) => {
    try {
        const { id, tarja } = req.body;
        const medicamentoData = { id, tarja };
        await criarTipoDeMedicamento(medicamentoData);

        res.status(201).json({ mensagem: 'Medicamento criado com sucesso!!!' });

    } catch (error) {
        console.error('Erro ao criar este tipo de medicamento no sistema: ', error);
        res.status(500).json({ mensagem: 'Erro ao criar este tipo de medicamento no sistema' });
    }
};

const listarTiposDeMedicamentosController = async (req, res) => {
    try {
        const equipamentos = await listarTiposDeMedicamentos();
        res.status(200).json(equipamentos);
    } catch (error) {
        console.error('Erro ao listar medicamentos no sistema: ', error);
        res.status(500).json({ mensagem: 'Erro ao listar medicamentos no sistema' });
    }
};

const obterTiposDeMedicamentosPorIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const medicamento = await obterTiposDeMedicamentosPorId(id);

        if (!medicamento) {
            return res.status(404).json({ mensagem: 'Este tipo de medicamento não foi encontrado no sistema' });
        }

        res.status(200).json(medicamento);

    } catch (error) {
        console.error('Erro ao obter este tipo de medicamento: ', error);
        res.status(500).json({ mensagem: 'Erro ao obter este tipo de medicamento no sistema' });
    }
};


const atualizarTipoDeMedicamentoController = async (req, res) => {
    try {
        const { id } = req.params;
        const { tarja } = req.body;

        const medicamentoExistente = await obterTiposDeMedicamentosPorId(id);

        if (!medicamentoExistente) {
            return res.status(404).json({ mensagem: 'Este tipo de medicamento não foi encontrado no sistema' });
        }

        const medicamentoData = { id, tarja };

        await atualizarTipoDeMedicamento(id, medicamentoData);
        res.status(200).json({ mensagem: 'Este tipo de medicamento foi atualizado com sucesso no sistema!!!' });

    } catch (error) {
        console.error('Erro ao atualizar o medicamento no sistema: ', error);
        res.status(500).json({ mensagem: 'Erro ao atualizar o medicamento no sistema' });
    }
};


const deletarTipoDeMedicamentoController = async (req, res) => {
    try {
        const { id } = req.params;

        const medicamento = await obterTiposDeMedicamentosPorId(id);

        if (!medicamento) {
            return res.status(404).json({ mensagem: 'Este tipo de medicamento não foi encontrado no sistema' });
        }

        await deletarTipoDeMedicamento(id);
        res.status(200).json({ mensagem: 'Medicamento deletado com sucesso!!!' });

    } catch (error) {
        console.error('Erro ao deletar medicamento: ', error);
        res.status(500).json({ mensagem: 'Erro ao deletar medicamento' });
    }
};


export { criarTipoDeMedicamentoController, listarTiposDeMedicamentosController, obterTiposDeMedicamentosPorIdController, atualizarTipoDeMedicamentoController, deletarTipoDeMedicamentoController};