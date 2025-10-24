import express from "express";
import {listarParcerias, criarParceria, atualizarParceria, excluirParceria} from "../controllers/parceriaController.js";

const router = express.Router();

router.get("/parcerias", listarParcerias);
router.post("/parcerias", criarParceria);
router.put("/parcerias/:id", atualizarParceria);
router.delete("/parcerias/:id", excluirParceria);

export default router;