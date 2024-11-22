import { Router } from "express";
import {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
} from "../controllers/usuario.controllers.js";

const usuarioRouter = Router();

usuarioRouter.get("/usuario", getUsers);
usuarioRouter.get("/usuario/:id_usuario", getUserById);
usuarioRouter.post("/usuario", createUser);
usuarioRouter.put("/usuario/:id_usuario", updateUser);
usuarioRouter.delete("/usuario/:id_usuario", deleteUser);

export default usuarioRouter;
