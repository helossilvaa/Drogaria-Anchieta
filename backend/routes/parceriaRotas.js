import express from "express";
import {listarParcerias, criarParceria} from "../controllers/parceriaController.js";

const router = express.Router();

router.get("/parcerias", listarParcerias);
router.post("/parcerias", criarParceria);

export default router;