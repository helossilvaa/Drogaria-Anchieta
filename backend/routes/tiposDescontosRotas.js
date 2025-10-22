import express from "express";
import { listarTiposDescontos } from "../controllers/tiposDescontosController.js";

const router = express.Router();

router.get("/tiposdescontos", listarTiposDescontos);

export default router;