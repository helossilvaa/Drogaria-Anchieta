import express from 'express';
import { listarTipoPagamentoController } from '../controllers/tipoPagamentoControllers.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMiddleware, listarTipoPagamentoController);

router.options('/', (req, res) =>{
    res.setHeader('Allow', 'GET');
    res.status(204).send();
});

export default router;

