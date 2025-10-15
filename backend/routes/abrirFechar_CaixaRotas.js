import express from 'express';
import { criarCaixaController, listarCaixaController, atualizarCaixaController, atualizarStatusCaixaController, obterCaixaPorIDController} from '../controllers/abrirFechar_CaixaController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, criarCaixaController);
router.get('/', authMiddleware, listarCaixaController);
router.get('/:id', authMiddleware, obterCaixaPorIDController);
router.put('/:id', authMiddleware, atualizarCaixaController);
router.put('/:id', authMiddleware, atualizarStatusCaixaController);
router.put ('/:id/status', authMiddleware, atualizarStatusCaixaController);

router.options('/:id/status', (req, res) => {
    res.setHeader('Allow', '´PUT, OPTIONS');
    res.status(204).send();
})

router.options('/', (req, res) => {
    res.setHeader('Allow', 'POST, GET');
    res.status(204).send();
});

router.options('/:id', (req, res) => {
    res.setHeader('Allow', 'GET, PUT, DELETE');
    res.status(204).send();
});

export default router;