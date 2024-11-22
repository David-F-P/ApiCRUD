import { pool } from "../db.js";

// Obtener todos los almacenes
export const getWarehouses = async (req, res) => {
    try {
        const response = await pool.query("SELECT * FROM almacen ORDER BY id_almacen ASC");
        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un almacén por ID
export const getWarehouseById = async (req, res) => {
    try {
        const id_almacen = parseInt(req.params.id_almacen);
        const response = await pool.query("SELECT * FROM almacen WHERE id_almacen = $1", [id_almacen]);

        if (response.rows.length === 0) {
            return res.status(404).json({ message: "Warehouse not found" });
        }

        res.json(response.rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo almacén y relacionarlo con productos
export const createWarehouseWithProducts = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN"); // Iniciar transacción

        const { calle, colonia, cp, municipio, codigo_postal, nombre_almacen, estado, productos } = req.body;

        // Crear almacén
        const { rows: warehouseRows } = await client.query(
            `INSERT INTO almacen (calle, colonia, cp, municipio, codigo_postal, nombre_almacen, estado) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [calle, colonia, cp, municipio, codigo_postal, nombre_almacen, estado]
        );

        const almacen = warehouseRows[0];

        // Relacionar el almacén con múltiples productos
        productos.forEach(async (producto) => {
            const { productoid_producto, cantidad } = producto;

            await client.query(
                `INSERT INTO producto_almacen (productoid_producto, almacenid_almacen, cantidad) 
                VALUES ($1, $2, $3)`,
                [productoid_producto, almacen.id_almacen, cantidad]
            );
        });

        await client.query("COMMIT"); // Confirmar transacción
        res.status(201).json(almacen);
    } catch (error) {
        await client.query("ROLLBACK"); // Revertir transacción en caso de error
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
};

// Actualizar las relaciones entre almacén y productos
export const updateWarehouseProducts = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN"); // Iniciar transacción

        const { id_almacen } = req.params;
        const { productos } = req.body;

        // Eliminar relaciones existentes
        await client.query(
            `DELETE FROM producto_almacen WHERE almacenid_almacen = $1`,
            [id_almacen]
        );

        // Insertar las nuevas relaciones
        productos.forEach(async (producto) => {
            const { productoid_producto, cantidad } = producto;

            await client.query(
                `INSERT INTO producto_almacen (productoid_producto, almacenid_almacen, cantidad) 
                VALUES ($1, $2, $3)`,
                [productoid_producto, id_almacen, cantidad]
            );
        });

        await client.query("COMMIT"); // Confirmar transacción
        res.status(200).json({ message: "Warehouse-product relationships updated successfully." });
    } catch (error) {
        await client.query("ROLLBACK"); // Revertir transacción en caso de error
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
};

// Obtener productos relacionados a un almacén
export const getProductsByWarehouse = async (req, res) => {
    try {
        const id_almacen = parseInt(req.params.id_almacen);
        const response = await pool.query(
            `SELECT p.id_producto, p.nombre_producto, pa.cantidad 
            FROM productos p
            INNER JOIN producto_almacen pa ON p.id_producto = pa.productoid_producto
            WHERE pa.almacenid_almacen = $1`,
            [id_almacen]
        );

        if (response.rows.length === 0) {
            return res.status(404).json({ message: "No products found for this warehouse" });
        }

        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar un almacén (y sus relaciones con productos)
export const deleteWarehouse = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN"); // Iniciar transacción

        const id_almacen = parseInt(req.params.id_almacen);

        // Eliminar relaciones en producto_almacen
        await client.query("DELETE FROM producto_almacen WHERE almacenid_almacen = $1", [id_almacen]);

        // Eliminar el almacén
        const { rowCount } = await client.query("DELETE FROM almacen WHERE id_almacen = $1", [id_almacen]);

        if (rowCount === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "Warehouse not found" });
        }

        await client.query("COMMIT"); // Confirmar transacción
        res.sendStatus(204);
    } catch (error) {
        await client.query("ROLLBACK"); // Revertir transacción en caso de error
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
};

