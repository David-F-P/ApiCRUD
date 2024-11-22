import { pool } from "../db.js";

// Obtener todos los proveedores
export const getSuppliers = async (req, res) => {
    try {
        const response = await pool.query("SELECT * FROM proveedor ORDER BY id_proveedor ASC");
        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un proveedor por ID
export const getSupplierById = async (req, res) => {
    try {
        const id_proveedor = parseInt(req.params.id_proveedor);
        const response = await pool.query("SELECT * FROM proveedor WHERE id_proveedor = $1", [id_proveedor]);

        if (response.rows.length === 0) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        res.json(response.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo proveedor
export const createSupplier = async (req, res) => {
    try {
        const { nombre, apellidos, rfc, telefono, email, calle, colonia, cp, municipio, estado } = req.body;

        const { rows } = await pool.query(
            `INSERT INTO proveedor (nombre, apellidos, rfc, telefono, email, calle, colonia, cp, municipio, estado) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [nombre, apellidos, rfc, telefono, email, calle, colonia, cp, municipio, estado]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un proveedor
export const updateSupplier = async (req, res) => {
    try {
        const id_proveedor = parseInt(req.params.id_proveedor);
        const { nombre, apellidos, rfc, telefono, email, calle, colonia, cp, municipio, estado } = req.body;

        const { rows } = await pool.query(
            `UPDATE proveedor 
            SET nombre = $1, apellidos = $2, rfc = $3, telefono = $4, email = $5, calle = $6, colonia = $7, cp = $8, municipio = $9, estado = $10 
             WHERE id_proveedor = $11 RETURNING *`,
            [nombre, apellidos, rfc, telefono, email, calle, colonia, cp, municipio, estado, id_proveedor]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un proveedor
export const deleteSupplier = async (req, res) => {
    try {
        const id_proveedor = parseInt(req.params.id_proveedor);
        const { rowCount } = await pool.query("DELETE FROM proveedor WHERE id_proveedor = $1", [id_proveedor]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "Supplier not found" });
        }

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

