import express from 'express';
import { criarMarcaController, listarMarcaController, atualizarMarcaController, deletarMarcaController, obterMarcaPorIDController } from '../controllers/marcasController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, criarMarcaController);
router.get('/', authMiddleware, listarMarcaController);
router.get('/:id', authMiddleware, obterMarcaPorIDController);
router.put('/:id', authMiddleware, atualizarMarcaController);
router.delete('/:id', authMiddleware, deletarMarcaController);

router.options('/', (req, res) => {
    res.setHeader('Allow', 'POST, GET');
    res.status(204).send();
});

router.options('/:id', (req, res) => {
    res.setHeader('Allow', 'GET, PUT, DELETE');
    res.status(204).send();
});

export default router;