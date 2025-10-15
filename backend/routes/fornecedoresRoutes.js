import express from 'express';
import { criarFornecedores, listarFornecedores } from "../controllers/fornecedoresController.js";

const router = express.Router();

router.get('/fornecedores', listarFornecedores);
router.post('/fornecedores', criarFornecedores);

export default router;