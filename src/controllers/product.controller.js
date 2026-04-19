// =============================================================
// Capa Controller: Maneja las peticiones HTTP
// Recibe la solicitud, llama al Service correspondiente
// y devuelve la respuesta al cliente con el status code adecuado.
// =============================================================

const {
    obtenerProductos,
    obtenerProductoPorId,
    agregarAlCarrito,
    obtenerCarrito,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} = require('../services/product.service');

/**
 * GET /api/products
 * Lista productos con filtros opcionales y paginacion.
 * Respuesta: { products, page, limit, totalPages, totalProducts }
 */
const getProducts = async (req, res) => {
    try {
        const isAdmin = req.get('x-auth') === 'admin';
        const resultado = await obtenerProductos(req.query, isAdmin);
        res.status(200).json(resultado);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ error: 'Error al obtener productos' });
    }
};

/**
 * GET /api/products/:id
 */
const getProductById = async (req, res) => {
    try {
        const producto = await obtenerProductoPorId(req.params.id);
        res.status(200).json(producto);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
};

/**
 * POST /api/products/cart
 */
const addToCart = async (req, res) => {
    try {
        const productosAgregados = await agregarAlCarrito(req.body, req.userName);
        res.status(202).json(productosAgregados);
    } catch (error) {
        if (error.message === 'El body debe ser un array') {
            return res.status(400).json({ error: error.message });
        }
        return res.status(404).json({ error: error.message });
    }
};

/**
 * GET /api/products/cart
 */
const getCart = async (req, res) => {
    try {
        const carrito = await obtenerCarrito(req.userName);
        res.status(200).json(carrito);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

/**
 * POST /api/products
 */
const createProduct = async (req, res) => {
    try {
        const nuevoProducto = await crearProducto(req.body);
        res.status(201).json({
            message: `Producto '${nuevoProducto.title}' creado exitosamente`,
            product: nuevoProducto
        });
    } catch (error) {
        if (error.message.startsWith('Faltan campos')) {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
};

/**
 * PUT /api/products/:id
 */
const updateProduct = async (req, res) => {
    try {
        const productoActualizado = await actualizarProducto(req.params.id, req.body);
        res.status(200).json({
            message: `Producto '${productoActualizado.title}' actualizado correctamente`,
            product: productoActualizado
        });
    } catch (error) {
        if (error.message.startsWith('Faltan campos')) {
            return res.status(400).json({ error: error.message });
        }
        if (error.message === 'Producto no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
};

/**
 * DELETE /api/products/:id
 */
const deleteProduct = async (req, res) => {
    try {
        const producto = await eliminarProducto(req.params.id);
        res.status(200).json({
            message: `Producto '${producto.title}' eliminado correctamente`
        });
    } catch (error) {
        if (error.message === 'Producto no encontrado') {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    addToCart,
    getCart,
    createProduct,
    updateProduct,
    deleteProduct
};
