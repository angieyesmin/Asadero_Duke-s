import { Request, Response } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import { pool } from "../config/database";

// ======================================
// OBTENER TODOS LOS PRODUCTOS
// ======================================

export const obtenerProductos = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const [productos] = await pool.query<RowDataPacket[]>(`
            SELECT
                p.id_producto,
                p.id_categoria,
                p.nombre,
                p.descripcion,
                p.precio,
                p.imagen,
                p.estado,
                p.fecha_creacion,
                c.nombre AS categoria
            FROM productos p
            LEFT JOIN categorias c
                ON p.id_categoria = c.id_categoria
            ORDER BY p.id_producto DESC
        `);

        res.status(200).json(productos);

    } catch (error) {
        console.error("Error al obtener productos:", error);

        res.status(500).json({
            mensaje: "Error al obtener los productos."
        });
    }
};

// ======================================
// OBTENER PRODUCTO POR ID
// ======================================

export const obtenerProductoPorId = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        const [productos] = await pool.query<RowDataPacket[]>(
            `
            SELECT
                p.id_producto,
                p.id_categoria,
                p.nombre,
                p.descripcion,
                p.precio,
                p.imagen,
                p.estado,
                p.fecha_creacion,
                c.nombre AS categoria
            FROM productos p
            LEFT JOIN categorias c
                ON p.id_categoria = c.id_categoria
            WHERE p.id_producto = ?
            `,
            [id]
        );

        if (productos.length === 0) {
            res.status(404).json({
                mensaje: "Producto no encontrado."
            });
            return;
        }

        res.status(200).json(productos[0]);

    } catch (error) {
        console.error("Error al obtener producto:", error);

        res.status(500).json({
            mensaje: "Error al obtener el producto."
        });
    }
};

// ======================================
// REGISTRAR PRODUCTO
// ======================================

export const crearProducto = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const {
            id_categoria,
            nombre,
            descripcion,
            precio,
            imagen
        } = req.body;

        if (
            !id_categoria ||
            !nombre ||
            precio === undefined ||
            precio === null
        ) {
            res.status(400).json({
                mensaje: "La categoría, el nombre y el precio son obligatorios."
            });
            return;
        }

        const precioNumerico = Number(precio);

        if (!Number.isFinite(precioNumerico) || precioNumerico < 0) {
            res.status(400).json({
                mensaje: "El precio debe ser un número válido."
            });
            return;
        }

        const [categorias] = await pool.query<RowDataPacket[]>(
            `
            SELECT id_categoria
            FROM categorias
            WHERE id_categoria = ?
            AND estado = 'Activo'
            `,
            [id_categoria]
        );

        if (categorias.length === 0) {
            res.status(400).json({
                mensaje: "La categoría no existe o está inactiva."
            });
            return;
        }

        const [resultado] = await pool.query<ResultSetHeader>(
            `
            INSERT INTO productos
            (
                id_categoria,
                nombre,
                descripcion,
                precio,
                imagen
            )
            VALUES (?, ?, ?, ?, ?)
            `,
            [
                id_categoria,
                nombre.trim(),
                descripcion || null,
                precioNumerico,
                imagen || null
            ]
        );

        res.status(201).json({
            mensaje: "Producto registrado correctamente.",
            id_producto: resultado.insertId
        });

    } catch (error) {
        console.error("Error al registrar producto:", error);

        res.status(500).json({
            mensaje: "Error al registrar el producto."
        });
    }
};

// ======================================
// ACTUALIZAR PRODUCTO
// ======================================

export const actualizarProducto = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        const {
            id_categoria,
            nombre,
            descripcion,
            precio,
            imagen
        } = req.body;

        if (
            !id_categoria ||
            !nombre ||
            precio === undefined ||
            precio === null
        ) {
            res.status(400).json({
                mensaje: "La categoría, el nombre y el precio son obligatorios."
            });
            return;
        }

        const precioNumerico = Number(precio);

        if (!Number.isFinite(precioNumerico) || precioNumerico < 0) {
            res.status(400).json({
                mensaje: "El precio debe ser un número válido."
            });
            return;
        }

        const [producto] = await pool.query<RowDataPacket[]>(
            `
            SELECT id_producto
            FROM productos
            WHERE id_producto = ?
            `,
            [id]
        );

        if (producto.length === 0) {
            res.status(404).json({
                mensaje: "Producto no encontrado."
            });
            return;
        }

        const [categorias] = await pool.query<RowDataPacket[]>(
            `
            SELECT id_categoria
            FROM categorias
            WHERE id_categoria = ?
            AND estado = 'Activo'
            `,
            [id_categoria]
        );

        if (categorias.length === 0) {
            res.status(400).json({
                mensaje: "La categoría no existe o está inactiva."
            });
            return;
        }

        await pool.query(
            `
            UPDATE productos
            SET
                id_categoria = ?,
                nombre = ?,
                descripcion = ?,
                precio = ?,
                imagen = ?
            WHERE id_producto = ?
            `,
            [
                id_categoria,
                nombre.trim(),
                descripcion || null,
                precioNumerico,
                imagen || null,
                id
            ]
        );

        res.status(200).json({
            mensaje: "Producto actualizado correctamente."
        });

    } catch (error) {
        console.error("Error al actualizar producto:", error);

        res.status(500).json({
            mensaje: "Error al actualizar el producto."
        });
    }
};

// ======================================
// CAMBIAR ESTADO DEL PRODUCTO
// ======================================

export const cambiarEstadoProducto = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        if (!["Activo", "Inactivo"].includes(estado)) {
            res.status(400).json({
                mensaje: "El estado debe ser Activo o Inactivo."
            });
            return;
        }

        const [resultado] = await pool.query<ResultSetHeader>(
            `
            UPDATE productos
            SET estado = ?
            WHERE id_producto = ?
            `,
            [estado, id]
        );

        if (resultado.affectedRows === 0) {
            res.status(404).json({
                mensaje: "Producto no encontrado."
            });
            return;
        }

        res.status(200).json({
            mensaje: `Producto ${estado.toLowerCase()} correctamente.`
        });

    } catch (error) {
        console.error("Error al cambiar estado:", error);

        res.status(500).json({
            mensaje: "Error al cambiar el estado del producto."
        });
    }
};