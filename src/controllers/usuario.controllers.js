import { pool } from "../db.js";

// Obtener todos los usuarios
export const getUsers = async (req, res) => {
    try {
        const response = await pool.query("SELECT * FROM usuario ORDER BY id_usuario ASC");
        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un usuario por ID
export const getUserById = async (req, res) => {
    try {
        const id_usuario = parseInt(req.params.id_usuario);
        const response = await pool.query("SELECT * FROM usuario WHERE id_usuario = $1", [id_usuario]);

        if (response.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(response.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo usuario
export const createUser = async (req, res) => {
    try {
        const {
            usuario,
            contraseña,
            nombre,
            apellido_paterno,
            apellido_materno,
            email,
            calle,
            colonia,
            cp,
            municipio,
            estado,
            imagen,
        } = req.body;

        const { rows } = await pool.query(
            `INSERT INTO usuario (usuario, contraseña, nombre, apellido_paterno, apellido_materno, email, calle, colonia, cp, municipio, estado, imagen) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
            [usuario, contraseña, nombre, apellido_paterno, apellido_materno, email, calle, colonia, cp, municipio, estado, imagen]
        );

        res.status(201).json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Actualizar un usuario
export const updateUser = async (req, res) => {
    try {
        const id_usuario = parseInt(req.params.id_usuario);
        const {
            usuario,
            contraseña,
            nombre,
            apellido_paterno,
            apellido_materno,
            email,
            calle,
            colonia,
            cp,
            municipio,
            estado,
            imagen,
        } = req.body;

        const { rows } = await pool.query(
            `UPDATE usuario 
            SET usuario = $1, contraseña = $2, nombre = $3, apellido_paterno = $4, apellido_materno = $5, email = $6, 
            calle = $7, colonia = $8, cp = $9, municipio = $10, estado = $11, imagen = $12 
             WHERE id_usuario = $13 RETURNING *`,
            [usuario, contraseña, nombre, apellido_paterno, apellido_materno, email, calle, colonia, cp, municipio, estado, imagen, id_usuario]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un usuario
export const deleteUser = async (req, res) => {
    try {
        const id_usuario = parseInt(req.params.id_usuario);
        const { rowCount } = await pool.query("DELETE FROM usuario WHERE id_usuario = $1", [id_usuario]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
