import express from 'express';
import { 
  criarFornecedores, 
  listarFornecedores,
  editarFornecedor,
  excluirFornecedor
} from "../controllers/fornecedoresController.js";

const router = express.Router();

router.get('/fornecedores', listarFornecedores);
router.post('/fornecedores', criarFornecedores);
router.put('/fornecedores/:id', editarFornecedor);     
router.delete('/fornecedores/:id', excluirFornecedor);    

export default router;
