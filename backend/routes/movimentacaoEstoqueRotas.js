import express from 'express';
import { criarMovimentacaoController, listarMovimentacoesController, obterMovimentacaoPorIdController, atualizarMovimentacaoController, deletarMovimentacaoController } from '../controllers/movimentacaoEstoqueController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, criarMovimentacaoController)
router.get('/', authMiddleware, listarMovimentacoesController);
router.get('/:id', authMiddleware, obterMovimentacaoPorIdController);
router.put('/:id', authMiddleware, atualizarMovimentacaoController);
router.delete('/:id', authMiddleware, deletarMovimentacaoController);

router.options('/', (req, res) => {
    res.setHeader('Allow', 'POST, GET');
    res.status(204).send();
});

router.options('/:id', (req, res) => {
    res.setHeader('Allow', 'GET, PUT, DELETE');
    res.status(204).send();
});

export default router;