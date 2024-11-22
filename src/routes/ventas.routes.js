import { Router } from "express";
import {
    getSales,
    getSaleById,
    createSale,
    updateSale,
    deleteSale,
} from "../controllers/ventas.controllers.js";

const ventasRouter = Router();

// Rutas para gestionar ventas
ventasRouter.get("/ventas", getSales);                          // Obtener todas las ventas con productos, cliente y usuario relacionados
ventasRouter.get("/ventas/:id_venta", getSaleById);             // Obtener una venta por ID con productos, cliente y usuario relacionados
ventasRouter.post("/ventas", createSale);                       // Crear una nueva venta con productos relacionados
ventasRouter.put("/ventas/:id_venta", updateSale);              // Actualizar una venta y sus productos relacionados
ventasRouter.delete("/ventas/:id_venta", deleteSale);           // Eliminar una venta por ID

export default ventasRouter;

