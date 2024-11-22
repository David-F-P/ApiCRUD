import { Router } from "express";
import {
    getWarehouses,
    getWarehouseById,
    createWarehouseWithProducts,
    updateWarehouseProducts,
    getProductsByWarehouse,
    deleteWarehouse,
} from "../controllers/almacen.controllers.js";

const almacenRouter = Router();

// Rutas para almacenes
almacenRouter.get("/almacen", getWarehouses);
almacenRouter.get("/almacen/:id_almacen", getWarehouseById);
almacenRouter.post("/almacen", createWarehouseWithProducts); // Crear almacén con productos
almacenRouter.put("/almacen/:id_almacen", updateWarehouseProducts); // Actualizar almacén y productos relacionados
almacenRouter.delete("/almacen/:id_almacen", deleteWarehouse);

// Ruta para obtener productos relacionados a un almacén
almacenRouter.get("/almacen/:id_almacen/productos", getProductsByWarehouse);

export default almacenRouter;

