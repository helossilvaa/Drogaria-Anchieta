import express from 'express';
import { 
  listarUsuariosController,
  obterUsuarioIdController,
  mudarStatusFuncionarioController,
  deletarUsuarioController,
  atualizarUsuarioController
} from '../controllers/usuarioController.js';

import {
     cadastroUsuarioController 
} from '../controllers/authController.js';


import authMiddleware from '../middlewares/authMiddleware.js';
 
const router = express.Router();
 

router.put('/:id/status', authMiddleware, mudarStatusFuncionarioController);

router.options(':id/status', (req, res) => {
    res.setHeader('Allow', 'PUT, OPTIONS');
    res.status(204).send();
});
 

router.get('/:id', authMiddleware, obterUsuarioIdController);
router.options('/:id', (req, res) => {
    res.setHeader('Allow', 'GET, OPTIONS');
    res.status(204).send();
});

router.post('/', authMiddleware, cadastroUsuarioController);
router.delete('/', authMiddleware, deletarUsuarioController);

router.put('/', authMiddleware, atualizarUsuarioController);

router.get('/', authMiddleware, listarUsuariosController);
router.options('/', (req, res) => {
    res.setHeader('Allow', 'POST, GET, DELETE, PUT, OPTIONS');
    res.status(204).send();
});
 
export default router;