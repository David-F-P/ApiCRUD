import express from "express";
import usersRoutes from "./routes/productos.routes.js";
import proveedorRoutes from "./routes/proveedor.routes.js";
import ordenrouter from "./routes/ordencompra.routes.js";
import morgan from "morgan";
import { PORT } from "./config.js";

const app = express();

app.use(morgan("dev"));

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(usersRoutes);
app.use(proveedorRoutes);
app.use(ordenrouter);

app.listen(PORT);
// eslint-disable-next-line no-console
console.log("Server on port", PORT);