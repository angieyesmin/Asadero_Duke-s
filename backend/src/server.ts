import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import { pool } from "./config/database";

// ======================================
// IMPORTAR RUTAS
// ======================================

import authRoutes from "./routes/auth.routes";
import productosRoutes from "./routes/productos.routes";
import categoriasRoutes from "./routes/categorias.routes";
import usuariosRoutes from "./routes/usuarios.routes";
import pedidosRoutes from "./routes/pedidos.routes";
import cajaRoutes from "./routes/caja.routes";
import reportesRoutes from "./routes/reportes.routes";

// ======================================
// CONFIGURACIÓN INICIAL
// ======================================

dotenv.config();

const app = express();

// ======================================
// MIDDLEWARES
// ======================================

app.use(
    cors({
        origin: "http://localhost:5173"
    })
);

app.use(express.json());

// ======================================
// RUTAS DE LA API
// ======================================

// Autenticación
app.use("/api/auth", authRoutes);

// Productos
app.use("/api/productos", productosRoutes);

// Categorías
app.use("/api/categorias", categoriasRoutes);

// Usuarios
app.use("/api/usuarios", usuariosRoutes);

// Pedidos
app.use("/api/pedidos", pedidosRoutes);

// Caja
app.use("/api/caja", cajaRoutes);

// Reportes
app.use("/api/reportes", reportesRoutes);

// ======================================
// RUTA PRINCIPAL
// ======================================

app.get("/", (req: Request, res: Response) => {
    res.json({
        mensaje: "Backend de Asadero Duke's funcionando correctamente"
    });
});

// ======================================
// COMPROBAR CONEXIÓN MYSQL
// ======================================

app.get("/api/estado", async (req: Request, res: Response) => {
    let connection;

    try {
        connection = await pool.getConnection();
        await connection.ping();

        res.json({
            conectado: true,
            mensaje: "Conexión con MySQL exitosa",
            baseDatos: process.env.DB_NAME
        });

    } catch (error) {
        console.error("Error de conexión:", error);

        res.status(500).json({
            conectado: false,
            mensaje: "Error al conectar con MySQL"
        });

    } finally {
        if (connection) {
            connection.release();
        }
    }
});

// ======================================
// RUTA PARA ENDPOINTS NO ENCONTRADOS
// ======================================

app.use((req: Request, res: Response) => {
    res.status(404).json({
        mensaje: "Ruta no encontrada",
        ruta: req.originalUrl
    });
});

// ======================================
// INICIAR SERVIDOR
// ======================================

const PORT = Number(process.env.PORT) || 3000;

app.listen(PORT, () => {
    console.log(
        `Servidor Asadero Duke's ejecutándose en http://localhost:${PORT}`
    );
});