// =============================================================
// server.js — Punto de entrada de la aplicacion
// Configura Express, registra middlewares globales y rutas,
// y levanta el servidor en el puerto 3100.
// =============================================================

const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const port = 3100;

// Middleware global: CORS para permitir peticiones desde el front-end
app.use(cors());

// Middleware global para parsear JSON en el body de las peticiones
app.use(express.json());

// Servir archivos estaticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Importar y registrar las rutas de productos con el prefijo /api
const productRoutes = require('./src/routes/product.routes');
app.use('/api', productRoutes);

// Ruta raiz: redirigir a home.html
app.get('/', (req, res) => {
    res.redirect('/home.html');
});

// Levantar el servidor (solo cuando no es importado por Vercel)
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Servidor corriendo en http://localhost:${port}`);
    });
}

// Exportar app para Vercel
module.exports = app;
