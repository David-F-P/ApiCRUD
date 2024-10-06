import { pool } from "../db.js";

export const getProviders = async (req, res) => {
  const response = await pool.query("SELECT * FROM proveedor ORDER BY id_proveedor ASC");
res.status(200).json(response.rows);
};

export const getProviderById = async (req, res) => {
const id_proveedor = parseInt(req.params.id_proveedor);
  const response = await pool.query("SELECT * FROM proveedor WHERE id_proveedor = $1", [id_proveedor]);
res.json(response.rows);
};

export const createProvider = async (req, res) => {
try {
    const { nombre, apellido_paterno, apellido_materno, calle, municipio, estado, cp, telefono } = req.body;

    const { rows } = await pool.query(
      "INSERT INTO proveedor (nombre, apellido_paterno, apellido_materno, calle, municipio, estado, cp, telefono) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
    [nombre, apellido_paterno, apellido_materno, calle, municipio, estado, cp, telefono]
    );

    res.status(201).json(rows[0]);
} catch (error) {
    return res.status(500).json({ error: error.message });
}
};

export const updateProvider = async (req, res) => {
const id_proveedor = parseInt(req.params.id_proveedor);
const { nombre, apellido_paterno, apellido_materno, calle, municipio, estado, cp, telefono } = req.body;

const { rows } = await pool.query(
    "UPDATE proveedor SET nombre = $1, apellido_paterno = $2, apellido_materno = $3, calle = $4, municipio = $5, estado = $6, cp = $7, telefono = $8 WHERE id_proveedor = $9 RETURNING *",
    [nombre, apellido_paterno, apellido_materno, calle, municipio, estado, cp, telefono, id_proveedor]
);

return res.json(rows[0]);
};

export const deleteProvider = async (req, res) => {
const id_proveedor = parseInt(req.params.id_proveedor);
const { rowCount } = await pool.query("DELETE FROM proveedor WHERE id_proveedor = $1", [id_proveedor]);

if (rowCount === 0) {
    return res.status(404).json({ message: "Provider not found" });
}

return res.sendStatus(204);
};
