import express from "express";
import { criarFiliado, listarFiliados } from "../controllers/filiadosController.js";

const router = express.Router();

router.post("/filiados", criarFiliado);
router.get("/filiados", listarFiliados);

export default router;
