import express from 'express';
import {
    criarTipoDeMedicamentoController,
    listarTiposDeMedicamentosController,
    obterTiposDeMedicamentosPorIdController,
    atualizarEquipamentoController,
    deletarTipoDeMedicamentoController
} from '../controllers/tipoMedicamentosController.js'
import authMiddleware from '../middlewares/authMiddleware.js';


const router = express.Router();

router.post('/', authMiddleware, criarTipoDeMedicamentoController)
router.get('/', authMiddleware, listarTiposDeMedicamentosController);
router.get('/:id', authMiddleware, obterTiposDeMedicamentosPorIdController);
router.put('/:id', authMiddleware, atualizarEquipamentoController);
router.delete('/:id', authMiddleware, deletarTipoDeMedicamentoController);

router.options('/', (req, res) => {
    res.setHeader('Allow', 'POST, GET');
    res.status(204).send();
});

router.options('/:id', (req, res) => {
    res.setHeader('Allow', 'GET, PUT, DELETE');
    res.status(204).send();
});

export default router;