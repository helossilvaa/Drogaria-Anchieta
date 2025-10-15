import express from 'express';
import { criarLoteMatrizController, listarLotesMatrizController, obterLoteMatrizPorIdController, atualizarLoteMatrizController, deletarLoteMatrizController } from '../controllers/lotesMatrizController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, criarLoteMatrizController)
router.get('/', authMiddleware, listarLotesMatrizController);
router.get('/:id', authMiddleware, obterLoteMatrizPorIdController);
router.put('/:id', authMiddleware, atualizarLoteMatrizController);
router.delete('/:id', authMiddleware, deletarLoteMatrizController);

router.options('/', (req, res) => {
    res.setHeader('Allow', 'POST, GET');
    res.status(204).send();
});

router.options('/:id', (req, res) => {
    res.setHeader('Allow', 'GET, PUT, DELETE');
    res.status(204).send();
});

export default router;