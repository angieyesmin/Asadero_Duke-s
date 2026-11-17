import { Request, Response } from "express";
import { pool } from "../config/database";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RowDataPacket } from "mysql2";

interface Usuario extends RowDataPacket {
    id_usuario: number;
    nombre: string;
    correo: string;
    password: string;
    rol: string;
    estado: string;
}

export const iniciarSesion = async (
    req: Request,
    res: Response
) => {
    try {
        const { correo, password, rol } = req.body;

        if (!correo || !password || !rol) {
            return res.status(400).json({
                mensaje: "Completa todos los campos."
            });
        }

        const [usuarios] = await pool.execute<Usuario[]>(
            `SELECT id_usuario, nombre, correo, password, rol, estado
             FROM usuarios
             WHERE correo = ?`,
            [correo.trim()]
        );

        if (usuarios.length === 0) {
            return res.status(401).json({
                mensaje: "Correo o contraseña incorrectos."
            });
        }

        const usuario = usuarios[0];

        if (usuario.estado !== "Activo") {
            return res.status(403).json({
                mensaje: "Tu cuenta se encuentra inactiva."
            });
        }

        const rolesPermitidos: Record<string, string> = {
            admin: "Administrador",
            mesero: "Mesero",
            cocina: "Cocina"
        };

        if (usuario.rol !== rolesPermitidos[rol]) {
            return res.status(403).json({
                mensaje: "No tienes permisos para este acceso."
            });
        }

        const passwordCorrecta = await bcrypt.compare(
            password,
            usuario.password
        );

        if (!passwordCorrecta) {
            return res.status(401).json({
                mensaje: "Correo o contraseña incorrectos."
            });
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error("No está configurado JWT_SECRET.");
        }

        const token = jwt.sign(
            {
                id: usuario.id_usuario,
                correo: usuario.correo,
                rol: rol
            },
            secret,
            {
                expiresIn: "8h"
            }
        );

        return res.json({
            mensaje: "Inicio de sesión exitoso.",
            token,
            usuario: {
                id: usuario.id_usuario,
                nombre: usuario.nombre,
                correo: usuario.correo,
                role: rol
            }
        });

    } catch (error) {
        console.error("Error al iniciar sesión:", error);

        return res.status(500).json({
            mensaje: "Error interno al iniciar sesión."
        });
    }
};