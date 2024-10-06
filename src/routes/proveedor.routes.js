import { Router } from "express";
import {
    getProviders,
    getProviderById,
    createProvider,
    updateProvider,
    deleteProvider,
} from "../controllers/proveedor.controllers.js";

const proveedorRoutes = Router();

proveedorRoutes.get("/proveedor", getProviders);
proveedorRoutes.get("/proveedor/:id", getProviderById);
proveedorRoutes.post("/proveedor", createProvider);
proveedorRoutes.put("/proveedor/:id", updateProvider);
proveedorRoutes.delete("/proveedor/:id", deleteProvider);

export default proveedorRoutes;