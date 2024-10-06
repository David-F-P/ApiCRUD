import { Router } from "express";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from "../controllers/productos.controllers.js";

const router = Router();

router.get("/productos", getProducts);
router.get("/productos/:id", getProductById);
router.post("/productos", createProduct);
router.put("/productos/:id", updateProduct);
router.delete("/productos/:id", deleteProduct);

export default router;