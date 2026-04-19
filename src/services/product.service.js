// =============================================================
// Capa Service: Logica de negocio
// Contiene validaciones, filtros, paginacion y transformaciones.
// Se comunica con el Repository para acceder a los datos.
// =============================================================

const { leerProductos, leerCarrito, escribirCarrito, escribirProductos } = require('../repositories/product.repository');
const shortid = require('shortid');

/**
 * Obtiene la lista de productos con filtros, paginacion y control de stock.
 * @param {Object} query - Query params (title, category, min, max, page, limit)
 * @param {boolean} isAdmin - Indica si el usuario es administrador
 * @returns {Promise<Object>} Objeto con products, page, totalPages, totalProducts
 */
const obtenerProductos = async (query, isAdmin) => {
    let productos = await leerProductos();

    // Separar parametros especiales del resto de filtros de texto
    const { min, max, page, limit, ...filtros } = query;

    // Filtrar por propiedades de texto (title, category, description, etc.)
    if (Object.keys(filtros).length > 0) {
        productos = productos.filter(producto => {
            return Object.keys(filtros).every(llave => {
                const valorProducto = String(producto[llave] || '').toLowerCase();
                const valorFiltro = String(filtros[llave]).toLowerCase();
                return valorProducto.includes(valorFiltro);
            });
        });
    }

    // Filtro por precio minimo
    if (min !== undefined) {
        productos = productos.filter(p => p.pricePerUnit >= Number(min));
    }

    // Filtro por precio maximo
    if (max !== undefined) {
        productos = productos.filter(p => p.pricePerUnit <= Number(max));
    }

    // Si NO es admin, ocultar el campo stock de cada producto
    if (!isAdmin) {
        productos = productos.map(producto => {
            const { stock, ...sinStock } = producto;
            return sinStock;
        });
    }

    // --- Paginacion ---
    const totalProducts = productos.length;
    const currentPage = parseInt(page) || 1;
    const itemsPerPage = parseInt(limit) || 4; // Por defecto 4 productos por pagina
    const totalPages = Math.ceil(totalProducts / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const productosPaginados = productos.slice(startIndex, endIndex);

    return {
        products: productosPaginados,
        page: currentPage,
        limit: itemsPerPage,
        totalPages,
        totalProducts
    };
};

/**
 * Busca un producto por su ID.
 */
const obtenerProductoPorId = async (id) => {
    const productos = await leerProductos();
    const producto = productos.find(p => p.id === id);

    if (!producto) {
        throw new Error('Producto no encontrado');
    }

    return producto;
};

/**
 * Agrega productos al carrito de un usuario.
 */
const agregarAlCarrito = async (productIds, userName) => {
    if (!Array.isArray(productIds)) {
        throw new Error('El body debe ser un array');
    }

    const productos = await leerProductos();

    for (const id of productIds) {
        const existe = productos.find(p => p.id === id);
        if (!existe) {
            throw new Error(`Producto con ID ${id} no encontrado`);
        }
    }

    let carritos = await leerCarrito();
    const index = carritos.findIndex(c => c.user === userName);

    if (index !== -1) {
        carritos[index].cart = productIds;
    } else {
        carritos.push({ user: userName, cart: productIds });
    }

    await escribirCarrito(carritos);

    const productosEncontrados = productIds.map(id =>
        productos.find(p => p.id === id)
    );

    return productosEncontrados;
};

/**
 * Obtiene el carrito completo de un usuario con detalle y total.
 */
const obtenerCarrito = async (userName) => {
    const carritos = await leerCarrito();
    const carrito = carritos.find(c => c.user === userName);

    if (!carrito) {
        return { user: userName, products: [], total: 0 };
    }

    const productos = await leerProductos();

    const productosEncontrados = carrito.cart
        .map(id => productos.find(p => p.id === id))
        .filter(Boolean)
        .map(({ stock, ...sinStock }) => sinStock);

    const total = productosEncontrados.reduce((acc, p) => acc + p.pricePerUnit, 0);

    return { user: userName, products: productosEncontrados, total };
};

/**
 * Crea un nuevo producto con ID generado por shortid.
 */
const crearProducto = async (body) => {
    const camposRequeridos = ['imageUrl', 'title', 'description', 'unit', 'category', 'pricePerUnit', 'stock'];

    const camposFaltantes = camposRequeridos.filter(campo =>
        body[campo] === undefined || body[campo] === null || body[campo] === ''
    );

    if (camposFaltantes.length > 0) {
        throw new Error(`Faltan campos: ${camposFaltantes.join(', ')}`);
    }

    const nuevoProducto = {
        id: shortid.generate(),
        imageUrl: body.imageUrl,
        title: body.title,
        description: body.description,
        unit: body.unit,
        category: body.category,
        pricePerUnit: Number(body.pricePerUnit),
        stock: Number(body.stock)
    };

    let productos = await leerProductos();
    productos.push(nuevoProducto);
    await escribirProductos(productos);

    return nuevoProducto;
};

/**
 * Actualiza un producto existente.
 */
const actualizarProducto = async (id, body) => {
    let productos = await leerProductos();
    const index = productos.findIndex(p => p.id === id);

    if (index === -1) {
        throw new Error('Producto no encontrado');
    }

    const camposRequeridos = ['imageUrl', 'title', 'description', 'unit', 'category', 'pricePerUnit', 'stock'];
    const camposFaltantes = camposRequeridos.filter(campo =>
        body[campo] === undefined || body[campo] === null || body[campo] === ''
    );

    if (camposFaltantes.length > 0) {
        throw new Error(`Faltan campos: ${camposFaltantes.join(', ')}`);
    }

    productos[index] = {
        id,
        imageUrl: body.imageUrl,
        title: body.title,
        description: body.description,
        unit: body.unit,
        category: body.category,
        pricePerUnit: Number(body.pricePerUnit),
        stock: Number(body.stock)
    };
    await escribirProductos(productos);

    return productos[index];
};

/**
 * Elimina un producto del catalogo.
 */
const eliminarProducto = async (id) => {
    let productos = await leerProductos();

    const producto = productos.find(p => p.id === id);
    if (!producto) {
        throw new Error('Producto no encontrado');
    }

    productos = productos.filter(p => p.id !== id);
    await escribirProductos(productos);

    return producto;
};

module.exports = {
    obtenerProductos,
    obtenerProductoPorId,
    agregarAlCarrito,
    obtenerCarrito,
    crearProducto,
    actualizarProducto,
    eliminarProducto
};
