import { pool } from "../db.js";

// Obtener todos los productos
export const getProducts = async (req, res) => {
    try {
        const response = await pool.query("SELECT * FROM productos ORDER BY id_producto ASC");
        res.status(200).json(response.rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obtener un producto por ID y sus relaciones con órdenes de compra y almacenes
export const getProductById = async (req, res) => {
    try {
        const id_producto = parseInt(req.params.id_producto);
        const productResponse = await pool.query("SELECT * FROM productos WHERE id_producto = $1", [id_producto]);

        if (productResponse.rows.length === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Obtener las órdenes de compra asociadas con este producto
        const orderResponse = await pool.query(
            `SELECT ocp.orden_de_compraid_orden, ocp.cantidad, ocp.precio_compra 
            FROM orden_de_compra_productos ocp
            WHERE ocp.productosid_producto = $1`,
            [id_producto]
        );

        // Obtener los almacenes asociados con este producto
        const almacenResponse = await pool.query(
            `SELECT pa.almacenid_almacen, pa.cantidad 
            FROM producto_almacen pa
            WHERE pa.productosid_producto = $1`,
            [id_producto]
        );

        const product = productResponse.rows[0];
        product.ordenes_de_compra = orderResponse.rows;
        product.almacenes = almacenResponse.rows;

        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un nuevo producto y relacionarlo con órdenes de compra y almacenes
export const createProductWithRelations = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN"); // Iniciar transacción

        const { cantidad, nombre_producto, precio_compra, precio_venta, ordenes_de_compra, almacenes } = req.body;

        // Crear producto
        const { rows } = await client.query(
            `INSERT INTO productos (cantidad, nombre_producto, precio_compra, precio_venta) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [cantidad, nombre_producto, precio_compra, precio_venta]
        );

        const producto = rows[0];


        

        // Insertar relaciones con órdenes de compra
        if (ordenes_de_compra) {
            ordenes_de_compra.forEach(async (orden) => {
                const { orden_de_compraid_orden, cantidad, precio_compra } = orden;

                await client.query(
                    `INSERT INTO orden_de_compra_productos (orden_de_compraid_orden, productosid_producto, cantidad, precio_compra)
                    VALUES ($1, $2, $3, $4)`,
                    [orden_de_compraid_orden, producto.id_producto, cantidad, precio_compra]
                );
            });
        }

        // Insertar relaciones con almacenes
        if (almacenes) {
            almacenes.forEach(async (almacen) => {
                const { almacenid_almacen, cantidad } = almacen;

                await client.query(
                    `INSERT INTO producto_almacen (productosid_producto, almacenid_almacen, cantidad)
                    VALUES ($1, $2, $3)`,
                    [producto.id_producto, almacenid_almacen, cantidad]
                );
            });
        }

        await client.query("COMMIT"); // Confirmar transacción
        res.status(201).json(producto);
    } catch (error) {
        await client.query("ROLLBACK"); // Revertir transacción en caso de error
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
    try {
        const id_producto = parseInt(req.params.id_producto);
        const { rowCount } = await pool.query("DELETE FROM productos WHERE id_producto = $1", [id_producto]);

        if (rowCount === 0) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.sendStatus(204); // Devolvemos un estado 204 (sin contenido) cuando se elimina correctamente.
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// Actualizar un producto y sus relaciones con órdenes de compra y almacenes
export const updateProductWithRelations = async (req, res) => {
    const client = await pool.connect();
    try {
        await client.query("BEGIN"); // Iniciar transacción

        const id_producto = parseInt(req.params.id_producto);
        const { cantidad, nombre_producto, precio_compra, precio_venta, ordenes_de_compra, almacenes } = req.body;

        // Actualizar el producto
        const { rows } = await client.query(
            `UPDATE productos 
            SET cantidad = $1, nombre_producto = $2, precio_compra = $3, precio_venta = $4 
            WHERE id_producto = $5 RETURNING *`,
            [cantidad, nombre_producto, precio_compra, precio_venta, id_producto]
        );

        if (rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ message: "Product not found" });
        }

        // Eliminar relaciones actuales con órdenes de compra
        await client.query(
            `DELETE FROM orden_de_compra_productos WHERE productosid_producto = $1`,
            [id_producto]
        );

        // Insertar nuevas relaciones con órdenes de compra
        if (ordenes_de_compra) {
            ordenes_de_compra.forEach(async (orden) => {
                const { orden_de_compraid_orden, cantidad, precio_compra } = orden;

                await client.query(
                    `INSERT INTO orden_de_compra_productos (orden_de_compraid_orden, productosid_producto, cantidad, precio_compra)
                    VALUES ($1, $2, $3, $4)`,
                    [orden_de_compraid_orden, id_producto, cantidad, precio_compra]
                );
            });
        }

        // Eliminar relaciones actuales con almacenes
        await client.query(
            `DELETE FROM producto_almacen WHERE productosid_producto = $1`,
            [id_producto]
        );

        // Insertar nuevas relaciones con almacenes
        if (almacenes) {
            almacenes.forEach(async (almacen) => {
                const { almacenid_almacen, cantidad } = almacen;

                await client.query(
                    `INSERT INTO producto_almacen (productosid_producto, almacenid_almacen, cantidad)
                    VALUES ($1, $2, $3)`,
                    [id_producto, almacenid_almacen, cantidad]
                );
            });
        }

        await client.query("COMMIT"); // Confirmar transacción
        res.status(200).json(rows[0]);
    } catch (error) {
        await client.query("ROLLBACK"); // Revertir transacción en caso de error
        res.status(500).json({ error: error.message });
    } finally {
        client.release();
    }
};

