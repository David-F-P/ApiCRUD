import { Router } from "express";
import {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
} from "../controllers/orden_de_compra.controllers.js";

const ordenDeCompraRouter = Router();

// Rutas para gestionar órdenes de compra
ordenDeCompraRouter.get("/ordenes_compra", getOrders);                      // Obtener todas las órdenes de compra
ordenDeCompraRouter.get("/ordenes_compra/:id_orden", getOrderById);         // Obtener una orden de compra por ID
ordenDeCompraRouter.post("/ordenes_compra", createOrder);                   // Crear una nueva orden de compra
ordenDeCompraRouter.put("/ordenes_compra/:id_orden", updateOrder);          // Actualizar una orden de compra
ordenDeCompraRouter.delete("/ordenes_compra/:id_orden", deleteOrder);       // Eliminar una orden de compra

export default ordenDeCompraRouter;


