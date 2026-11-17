    import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { pool } from "../config/database";

dotenv.config();

async function crearAdministrador() {
    try {
        const nombre = process.env.ADMIN_NAME;
        const correo = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!nombre || !correo || !password) {
            throw new Error(
                "Configura ADMIN_NAME, ADMIN_EMAIL y ADMIN_PASSWORD en .env"
            );
        }

        if (password.length < 12) {
            throw new Error(
                "La contraseña debe tener al menos 12 caracteres."
            );
        }

        const [existentes] = await pool.execute<any[]>(
            "SELECT id_usuario, rol FROM usuarios WHERE correo = ?",
            [correo]
        );

        if (existentes.length > 0) {
            if (existentes[0].rol === "Administrador") {
                console.log("El administrador ya está registrado.");
                return;
            }

            throw new Error(
                "Ese correo ya está registrado con otro rol."
            );
        }

        const passwordHash = await bcrypt.hash(password, 12);

        await pool.execute(
            `INSERT INTO usuarios
            (nombre, correo, password, rol, estado)
            VALUES (?, ?, ?, 'Administrador', 'Activo')`,
            [nombre, correo, passwordHash]
        );

        console.log("Administrador registrado correctamente.");
        console.log("Correo:", correo);

    } catch (error) {
        console.error("Error al crear administrador:", error);

    } finally {
        await pool.end();
    }
}

crearAdministrador();