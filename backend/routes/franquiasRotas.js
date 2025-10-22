import express from 'express';
import { criarUnidadeController, listarUnidadesController, obterunidadeIdcontroller, atualizarUnidadeController, deletarUnidadeController } from '../controllers/franquiaController.js';


import authMiddleware from '../middlewares/authMiddleware.js';
 
const router = express.Router();
 

router.post('/', authMiddleware, criarUnidadeController);

router.get('/', authMiddleware, listarUnidadesController);

router.get('/:id', authMiddleware, obterunidadeIdcontroller);

router.put('/:id', authMiddleware, atualizarUnidadeController);

router.delete('/:id', authMiddleware, deletarUnidadeController);

router.options('/', (req, res) => {
    res.setHeader('Allow', 'POST, GET, OPTIONS');
    res.status(204).send();
});

router.options(':id/status', (req, res) => {
    res.setHeader('Allow', 'GET, PUT, DELETE, OPTIONS');
    res.status(204).send();
});

 
export default router;