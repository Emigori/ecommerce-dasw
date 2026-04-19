// =============================================================
// Capa Router: Define los endpoints de la API de productos.
// =============================================================

const express = require('express');
const router = express.Router();

const {
    getProducts,
    getProductById,
    addToCart,
    getCart,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/product.controller');

const validateAdmin = require('../middlewares/validateAdmin.middleware');
const validateUser = require('../middlewares/validateUser.middleware');

// --- Rutas de productos ---

// GET /api/products → Listar productos con paginacion
router.get('/products', getProducts);

// POST /api/products/cart → Agregar productos al carrito (requiere x-user)
router.post('/products/cart', validateUser, addToCart);

// GET /api/products/cart → Obtener carrito del usuario (requiere x-user)
router.get('/products/cart', validateUser, getCart);

// POST /api/products → Crear producto (requiere admin)
router.post('/products', validateAdmin, createProduct);

// GET /api/products/:id → Obtener producto por ID
router.get('/products/:id', getProductById);

// PUT /api/products/:id → Actualizar producto (requiere admin)
router.put('/products/:id', validateAdmin, updateProduct);

// DELETE /api/products/:id → Eliminar producto (requiere admin)
router.delete('/products/:id', validateAdmin, deleteProduct);

module.exports = router;
