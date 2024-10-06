import { pool } from "../db.js";

export const getProducts = async (req, res) => {
  const response = await pool.query("SELECT * FROM productos ORDER BY id ASC");
res.status(200).json(response.rows);
};

export const getProductById = async (req, res) => {
const id = parseInt(req.params.id);
  const response = await pool.query("SELECT * FROM productos WHERE id = $1", [id]);
res.json(response.rows);
};

export const createProduct = async (req, res) => {
try {
    const { nombre_producto, cantidad, precio_compra } = req.body;

    const { rows } = await pool.query(
      "INSERT INTO productos (nombre_producto, cantidad, precio_compra) VALUES ($1, $2, $3) RETURNING *",
    [nombre_producto, cantidad, precio_compra]
    );

    res.status(201).json(rows[0]);
} catch (error) {
    return res.status(500).json({ error: error.message });
}
};

export const updateProduct = async (req, res) => {
const id = parseInt(req.params.id);
const { nombre_producto, cantidad, precio_compra } = req.body;

const { rows } = await pool.query(
    "UPDATE productos SET nombre_producto = $1, cantidad = $2, precio_compra = $3 WHERE id = $4 RETURNING *",
    [nombre_producto, cantidad, precio_compra, id]
);

return res.json(rows[0]);
};

export const deleteProduct = async (req, res) => {
const id = parseInt(req.params.id);
const { rowCount } = await pool.query("DELETE FROM productos WHERE id = $1", [id]);

if (rowCount === 0) {
    return res.status(404).json({ message: "Product not found" });
}

return res.sendStatus(204);
};
