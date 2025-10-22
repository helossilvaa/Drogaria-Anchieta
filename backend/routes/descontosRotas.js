import express from "express";
import {listarDescontos, criarDesconto} from "../controllers/descontosController.js";

const router = express.Router();

router.get("/descontos", listarDescontos);
router.post("/descontos", criarDesconto);

export default router;