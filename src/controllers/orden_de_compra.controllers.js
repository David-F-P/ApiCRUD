import { pool } from "../db.js";

// Obtener todas las órdenes de compra
export const getOrders = async (req, res) => {
    try {
        const response = await pool.query(`
            SELECT oc.*, p.nombre AS nombre_proveedor, p.apellidos
            FROM orden_de_compra oc
            INNER JOIN proveedor p ON oc.proveedorid_proveedor = p.id_proveedor
            ORDER BY oc.id_orden ASC
        `);
        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener una orden de compra por ID
export const getOrderById = async (req, res) => {
    try {
        const id_orden = parseInt(req.params.id_orden);
        const response = await pool.query(`
            SELECT oc.*, p.nombre AS nombre_proveedor, p.apellidos
            FROM orden_de_compra oc
            INNER JOIN proveedor p ON oc.proveedorid_proveedor = p.id_proveedor
            WHERE oc.id_orden = $1
        `, [id_orden]);

        if (response.rows.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Obtener productos relacionados a la orden
        const productosResponse = await pool.query(`
            SELECT op.*, pr.nombre_producto
            FROM orden_de_compra_productos op
            INNER JOIN productos pr ON op.productosid_producto = pr.id_producto
            WHERE op.orden_de_compraid_orden = $1
        `, [id_orden]);

        res.json({ ...response.rows[0], productos: productosResponse.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear una nueva orden de compra
export const createOrder = async (req, res) => {
    const client = await pool.connect();
    try {
        const { fecha_creacion, descripcion, cantidad, precio_compra, proveedorid_proveedor, productos } = req.body;

        await client.query('BEGIN');

        const { rows } = await client.query(
            `INSERT INTO orden_de_compra (fecha_creacion, descripcion, cantidad, precio_compra, proveedorid_proveedor) 
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [fecha_creacion, descripcion, cantidad, precio_compra, proveedorid_proveedor]
        );

        const ordenId = rows[0].id_orden;

        // Insertar productos relacionados a la orden
        for (const producto of productos) {
            const { productosid_producto, cantidad, precio_compra } = producto;
            await client.query(
                `INSERT INTO orden_de_compra_productos (orden_de_compraid_orden, productosid_producto, cantidad, precio_compra) 
                VALUES ($1, $2, $3, $4)`,
                [ordenId, productosid_producto, cantidad, precio_compra]
            );
        }

        await client.query('COMMIT');
        res.status(201).json({ message: "Order created successfully", order: rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
};

// Actualizar una orden de compra
export const updateOrder = async (req, res) => {
    const client = await pool.connect();
    try {
        const id_orden = parseInt(req.params.id_orden);
        const { fecha_creacion, descripcion, cantidad, precio_compra, proveedorid_proveedor, productos } = req.body;

        await client.query('BEGIN');

        const { rows } = await client.query(
            `UPDATE orden_de_compra 
            SET fecha_creacion = $1, descripcion = $2, cantidad = $3, precio_compra = $4, proveedorid_proveedor = $5 
             WHERE id_orden = $6 RETURNING *`,
            [fecha_creacion, descripcion, cantidad, precio_compra, proveedorid_proveedor, id_orden]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Eliminar productos relacionados actuales
        await client.query(
            `DELETE FROM orden_de_compra_productos WHERE orden_de_compraid_orden = $1`,
            [id_orden]
        );

        // Insertar productos actualizados relacionados a la orden
        for (const producto of productos) {
            const { productosid_producto, cantidad, precio_compra } = producto;
            await client.query(
                `INSERT INTO orden_de_compra_productos (orden_de_compraid_orden, productosid_producto, cantidad, precio_compra) 
                VALUES ($1, $2, $3, $4)`,
                [id_orden, productosid_producto, cantidad, precio_compra]
            );
        }

        await client.query('COMMIT');
        res.json({ message: "Order updated successfully", order: rows[0] });
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
};

// Eliminar una orden de compra
export const deleteOrder = async (req, res) => {
    const client = await pool.connect();
    try {
        const id_orden = parseInt(req.params.id_orden);

        await client.query('BEGIN');

        await client.query(
            `DELETE FROM orden_de_compra_productos WHERE orden_de_compraid_orden = $1`,
            [id_orden]
        );

        const { rowCount } = await client.query(
            `DELETE FROM orden_de_compra WHERE id_orden = $1`,
            [id_orden]
        );

        if (rowCount === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        await client.query('COMMIT');
        res.sendStatus(204);
    } catch (error) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
};

