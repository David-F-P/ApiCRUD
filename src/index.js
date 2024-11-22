import express from "express";
import almacenRoutes from "./routes/almacen.routes.js"; // Rutas para almacén
import clienteRoutes from "./routes/cliente.routes.js"; // Rutas para cliente
import ordenCompraRoutes from "./routes/orden_de_compra.routes.js"; // Rutas para orden de compra
import productosRoutes from "./routes/productos.routes.js"; // Rutas para productos
import proveedorRoutes from "./routes/proveedor.routes.js"; // Rutas para proveedor
import usuarioRoutes from "./routes/usuario.routes.js"; // Rutas para usuario
import ventasRoutes from "./routes/ventas.routes.js"; // Rutas para ventas
import morgan from "morgan";
import { PORT } from "./config.js";

const app = express();

// Middleware de logging
app.use(morgan("dev"));

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use("/api/almacen", almacenRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/orden_de_compra", ordenCompraRoutes);
app.use("/api/productos", productosRoutes);
app.use("/api/proveedores", proveedorRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/ventas", ventasRoutes);

// Configuración del puerto
app.listen(PORT, () => {
    console.log(`Server on port ${PORT}`);
});
