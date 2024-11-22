import { pool } from "../db.js";

// Obtener todas las ventas con productos, cliente y usuario relacionados
export const getSales = async (req, res) => {
    try {
        const response = await pool.query(`
            SELECT v.*, 
                json_agg(json_build_object(
                        'productosid_producto', vp.productosid_producto,
                        'cantidad', vp.cantidad
                )) AS productos,
                json_build_object(
                        'id_cliente', c.id_cliente,
                        'nombre_cliente', c.nombre,
                        'apellido_cliente', c.apellidos,
                        'email_cliente', c.email
                ) AS cliente,
                json_build_object(
                        'id_usuario', u.id_usuario,
                        'nombre_usuario', u.nombre,
                        'email_usuario', u.email
                ) AS usuario
            FROM ventas v
            LEFT JOIN ventas_productos vp ON v.id_venta = vp.ventasid_venta
            LEFT JOIN cliente c ON v.clienteid_cliente = c.id_cliente
            LEFT JOIN usuario u ON v.usuarioid_usuario = u.id_usuario
            GROUP BY v.id_venta, c.id_cliente, u.id_usuario
            ORDER BY v.id_venta ASC
        `);
        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener una venta por ID con productos, cliente y usuario relacionados
export const getSaleById = async (req, res) => {
    try {
        const id_venta = parseInt(req.params.id_venta);
        const response = await pool.query(`
            SELECT v.*, 
                json_agg(json_build_object(
                        'productosid_producto', vp.productosid_producto,
                        'cantidad', vp.cantidad
                )) AS productos,
                json_build_object(
                        'id_cliente', c.id_cliente,
                        'nombre_cliente', c.nombre,
                        'apellido_cliente', c.apellidos,
                        'email_cliente', c.email
                ) AS cliente,
                json_build_object(
                        'id_usuario', u.id_usuario,
                        'nombre_usuario', u.nombre,
                        'email_usuario', u.email
                ) AS usuario
            FROM ventas v
            LEFT JOIN ventas_productos vp ON v.id_venta = vp.ventasid_venta
            LEFT JOIN cliente c ON v.clienteid_cliente = c.id_cliente
            LEFT JOIN usuario u ON v.usuarioid_usuario = u.id_usuario
            WHERE v.id_venta = $1
            GROUP BY v.id_venta, c.id_cliente, u.id_usuario
        `, [id_venta]);

        if (response.rows.length === 0) {
            return res.status(404).json({ message: "Sale not found" });
        }

        res.json(response.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear una nueva venta con productos relacionados
export const createSale = async (req, res) => {
    const client = await pool.connect();
    try {
        const { fecha, cantidad_vendida, subtotal, total, usuarioid_usuario, clienteid_cliente, productos } = req.body;

        await client.query('BEGIN');

        // Insertar la venta en la tabla 'ventas'
        const { rows } = await client.query(
            `INSERT INTO ventas (fecha, cantidad_vendida, subtotal, total, usuarioid_usuario, clienteid_cliente) 
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [fecha, cantidad_vendida, subtotal, total, usuarioid_usuario, clienteid_cliente]
        );

        const id_venta = rows[0].id_venta;

        // Insertar productos relacionados en la tabla 'ventas_productos'
        for (const producto of productos) {
            const { productosid_producto, cantidad } = producto;
            await client.query(
                `INSERT INTO ventas_productos (ventasid_venta, productosid_producto, cantidad) 
                VALUES ($1, $2, $3)`,
                [id_venta, productosid_producto, cantidad]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ message: "Sale created successfully", sale: rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
};

// Actualizar una venta y sus productos relacionados
export const updateSale = async (req, res) => {
    const client = await pool.connect();
    try {
        const id_venta = parseInt(req.params.id_venta);
        const { fecha, cantidad_vendida, subtotal, total, usuarioid_usuario, clienteid_cliente, productos } = req.body;

        await client.query('BEGIN');

        const { rows } = await client.query(
            `UPDATE ventas 
            SET fecha = $1, cantidad_vendida = $2, subtotal = $3, total = $4, usuarioid_usuario = $5, clienteid_cliente = $6 
             WHERE id_venta = $7 RETURNING *`,
            [fecha, cantidad_vendida, subtotal, total, usuarioid_usuario, clienteid_cliente, id_venta]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Sale not found" });
        }

        // Eliminar productos relacionados actuales
        await client.query(
            `DELETE FROM ventas_productos WHERE ventasid_venta = $1`,
            [id_venta]
        );

        // Insertar productos actualizados relacionados a la venta
        for (const producto of productos) {
            const { productosid_producto, cantidad } = producto;
            await client.query(
                `INSERT INTO ventas_productos (ventasid_venta, productosid_producto, cantidad) 
                VALUES ($1, $2, $3)`,
                [id_venta, productosid_producto, cantidad]
            );
        }

        await client.query('COMMIT');
        res.json({ message: "Sale updated successfully", sale: rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
};

