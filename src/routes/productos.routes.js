import { Router } from "express";
import {
    getProducts,
    getProductById,
    createProductWithRelations,
    updateProductWithRelations,
} from "../controllers/productos.controllers.js";

const productosRouter = Router();

// Rutas para gestionar productos
productosRouter.get("/productos", getProducts);                           // Obtener todos los productos
productosRouter.get("/productos/:id_producto", getProductById);          // Obtener un producto por ID
productosRouter.post("/productos", createProductWithRelations);          // Crear un nuevo producto con relaciones
productosRouter.put("/productos/:id_producto", updateProductWithRelations); // Actualizar un producto con relaciones
productosRouter.delete("/productos/:id_producto", deleteProduct);       // Eliminar un producto

export default productosRouter;

