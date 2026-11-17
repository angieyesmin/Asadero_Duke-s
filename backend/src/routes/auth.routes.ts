import { Router } from "express";
import { iniciarSesion } from "../controllers/auth.controller";

const router = Router();

router.post("/login", iniciarSesion);

export default router;