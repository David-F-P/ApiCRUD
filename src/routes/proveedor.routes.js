import { Router } from "express";
import {
    getSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
} from "../controllers/proveedor.controllers.js";

const proveedorRouter = Router();

// Rutas para gestionar proveedores
proveedorRouter.get("/proveedor", getSuppliers);                               // Obtener todos los proveedores
proveedorRouter.get("/proveedor/:id_proveedor", getSupplierById);              // Obtener un proveedor por ID
proveedorRouter.post("/proveedor", createSupplier);                            // Crear un nuevo proveedor
proveedorRouter.put("/proveedor/:id_proveedor", updateSupplier);              // Actualizar un proveedor
proveedorRouter.delete("/proveedor/:id_proveedor", deleteSupplier);           // Eliminar un proveedor

export default proveedorRouter;

