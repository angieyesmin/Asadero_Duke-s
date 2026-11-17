import { Router } from "express";

import {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    cambiarEstadoProducto
} from "../controllers/productos.controller";

const router = Router();

// ======================================
// RUTAS DE PRODUCTOS
// ======================================

// Obtener todos los productos
router.get("/", obtenerProductos);

// Obtener producto por ID
router.get("/:id", obtenerProductoPorId);

// Registrar producto
router.post("/", crearProducto);

// Actualizar producto
router.put("/:id", actualizarProducto);

// Activar o desactivar producto
router.patch("/:id/estado", cambiarEstadoProducto);

export default router;