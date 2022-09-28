const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");

// Inicializar app
console.log("node app is running");

// Conectar a la base de datos
connection();

// Crear servidor Node
const app = express();
const port = 3900;

// Configurar cors
app.use(cors()); // middleware para evitar conflictos entre puertos del servidor

// Middleware para convertir body a obj js
app.use(express.json()); // para recibir datso con content-type app/json
app.use(express.urlencoded({ extended: true })); // para parsear datos en form-url-encoded a json

// ROUTES
const article_routes = require("./routes/article"); // nos traemos las rutas para cargarlas

// Load routes
app.use("/api", article_routes);

// Hard coded routes
app.get("/course", article_routes);

// Crear servidor y escuchar peticiones http
app.listen(port, () => {
  console.log("Server running on", port);
});
