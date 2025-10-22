import express from 'express';
import { 
  criarConta, 
  listarConta,
  editarConta,
  excluirConta
} from "../controllers/contasFilialController.js";

const router = express.Router();

router.get('/conta', listarConta);
router.post('/conta', criarConta);
router.put('/conta/:id', editarConta);     
router.delete('/conta/:id', excluirConta);    

export default router;
