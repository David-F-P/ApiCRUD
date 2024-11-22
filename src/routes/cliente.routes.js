import { Router } from "express";
import {
    getClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient,
} from "../controllers/cliente.controllers.js";

const clienteRouter = Router();

// Rutas para gestionar clientes
clienteRouter.get("/cliente", getClients);                     // Obtener todos los clientes
clienteRouter.get("/cliente/:id_cliente", getClientById);      // Obtener un cliente por ID
clienteRouter.post("/cliente", createClient);                  // Crear un nuevo cliente
clienteRouter.put("/cliente/:id_cliente", updateClient);       // Actualizar un cliente existente
clienteRouter.delete("/cliente/:id_cliente", deleteClient);    // Eliminar un cliente

export default clienteRouter;

