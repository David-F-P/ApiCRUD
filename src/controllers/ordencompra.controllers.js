import { pool } from "../db.js";

export const getOrders = async (req, res) => {
    const response = await pool.query("SELECT * FROM ordencompras ORDER BY id_orden ASC");
    res.status(200).json(response.rows);
};

export const getOrderById = async (req, res) => {
    const id_orden = parseInt(req.params.id_orden);
    const response = await pool.query("SELECT * FROM ordencompras WHERE id_orden = $1", [id_orden]);
    res.json(response.rows);
};

export const createOrder = async (req, res) => {
    try {
        const { nombre_vendedor, descripcion, cantidad, precio_compra } = req.body;

        const { rows } = await pool.query(
            "INSERT INTO ordencompras (nombre_vendedor, descripcion, cantidad, precio_compra) VALUES ($1, $2, $3, $4) RETURNING *",
            [nombre_vendedor, descripcion, cantidad, precio_compra]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const updateOrder = async (req, res) => {
    const id_orden = parseInt(req.params.id_orden);
    const { nombre_vendedor, descripcion, cantidad, precio_compra } = req.body;

    const { rows } = await pool.query(
        "UPDATE ordencompras SET nombre_vendedor = $1, descripcion = $2, cantidad = $3, precio_compra = $4 WHERE id_orden = $5 RETURNING *",
        [nombre_vendedor, descripcion, cantidad, precio_compra, id_orden]
    );

    return res.json(rows[0]);
};

export const deleteOrder = async (req, res) => {
    const id_orden = parseInt(req.params.id_orden);
    const { rowCount } = await pool.query("DELETE FROM ordencompras WHERE id_orden = $1", [id_orden]);

    if (rowCount === 0) {
        return res.status(404).json({ message: "Order not found" });
    }

    return res.sendStatus(204);
};
