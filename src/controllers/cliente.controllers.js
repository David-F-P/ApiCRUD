import { pool } from "../db.js";

// Obtener todos los clientes
export const getClients = async (req, res) => {
    try {
        const response = await pool.query("SELECT * FROM cliente ORDER BY id_cliente ASC");
        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un cliente por ID
export const getClientById = async (req, res) => {
    try {
        const id_cliente = parseInt(req.params.id_cliente);
        const response = await pool.query("SELECT * FROM cliente WHERE id_cliente = $1", [id_cliente]);

        if (response.rows.length === 0) {
            return res.status(404).json({ message: "Client not found" });
        }

        res.json(response.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo cliente
export const createClient = async (req, res) => {
    try {
        const { nombre, apellido_paterno, apellido_materno, calle, colonia, cp, municipio, estado, rfc } = req.body;

        const { rows } = await pool.query(
            `INSERT INTO cliente (nombre, apellido_paterno, apellido_materno, calle, colonia, cp, municipio, estado, rfc) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
            [nombre, apellido_paterno, apellido_materno, calle, colonia, cp, municipio, estado, rfc]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un cliente
export const updateClient = async (req, res) => {
    try {
        const id_cliente = parseInt(req.params.id_cliente);
        const { nombre, apellido_paterno, apellido_materno, calle, colonia, cp, municipio, estado, rfc } = req.body;

        const { rows } = await pool.query(
            `UPDATE cliente 
            SET nombre = $1, apellido_paterno = $2, apellido_materno = $3, calle = $4, colonia = $5, cp = $6, municipio = $7, estado = $8, rfc = $9 
             WHERE id_cliente = $10 RETURNING *`,
            [nombre, apellido_paterno, apellido_materno, calle, colonia, cp, municipio, estado, rfc, id_cliente]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Client not found" });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un cliente
export const deleteClient = async (req, res) => {
    try {
        const id_cliente = parseInt(req.params.id_cliente);
        const { rowCount } = await pool.query("DELETE FROM cliente WHERE id_cliente = $1", [id_cliente]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "Client not found" });
        }

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
