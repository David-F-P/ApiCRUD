import { Router } from "express";
import {
    getOrders,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder,
} from "../controllers/ordencompra.controllers.js";

const ordenrouter = Router();

ordenrouter.get("/orden", getOrders);
ordenrouter.get("/orden/:id", getOrderById);
ordenrouter.post("/orden", createOrder);
ordenrouter.put("/orden/:id", updateOrder);
ordenrouter.delete("/orden/:id", deleteOrder);

export default ordenrouter;