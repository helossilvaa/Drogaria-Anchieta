import express from "express";
import {listarDescontos, criarDesconto, atualizarDesconto, excluirDesconto} from "../controllers/descontosController.js";

const router = express.Router();

router.get("/descontos", listarDescontos);
router.post("/descontos", criarDesconto);
router.put("/descontos/:id", atualizarDesconto);
router.delete("/descontos/:id", excluirDesconto);

export default router;