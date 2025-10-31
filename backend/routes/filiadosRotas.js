import express from "express";
import { criarFiliado, listarFiliados, atualizarFiliado, deletarFiliado, obterFiliadoPorCPFController } from "../controllers/filiadosController.js";

const router = express.Router();

router.post("/filiados", criarFiliado);
router.get("/filiados", listarFiliados);
router.put("/filiados/:id", atualizarFiliado);
router.delete("/filiados/:id", deletarFiliado); 
router.get('/cpf/:cpf', obterFiliadoPorCPFController);

export default router;
