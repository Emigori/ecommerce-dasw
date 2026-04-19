// =============================================================
// Capa Repository: Acceso a datos (lectura/escritura de JSON)
// Esta capa es la unica que interactua con los archivos JSON.
// Nunca contiene logica de negocio.
//
// En Vercel (serverless) el filesystem es solo lectura, por lo
// que usamos un cache en memoria como fallback para escrituras.
// =============================================================

const fs = require('fs').promises;
const path = require('path');

// Rutas a los archivos de datos
const PRODUCTS_PATH = path.join(__dirname, '../../products.json');
const CART_PATH = path.join(__dirname, '../../cart.json');

// Cache en memoria para entornos serverless (Vercel)
let productosCache = null;
let carritosCache = null;

// ---- Funciones para Productos ----

/**
 * Lee todos los productos desde products.json o desde cache
 * @returns {Promise<Array>} Arreglo de productos
 */
const leerProductos = async () => {
    if (productosCache !== null) {
        return JSON.parse(JSON.stringify(productosCache));
    }
    const contenido = await fs.readFile(PRODUCTS_PATH, 'utf-8');
    const datos = JSON.parse(contenido);
    productosCache = datos;
    return JSON.parse(JSON.stringify(datos));
};

/**
 * Escribe el arreglo completo de productos en products.json
 * Si falla (Vercel readonly), guarda en cache en memoria
 * @param {Array} datos - Arreglo de productos a guardar
 */
const escribirProductos = async (datos) => {
    productosCache = JSON.parse(JSON.stringify(datos));
    try {
        await fs.writeFile(PRODUCTS_PATH, JSON.stringify(datos, null, 2));
    } catch (error) {
        // En Vercel el filesystem es readonly, usamos solo el cache
        console.log('Filesystem readonly, usando cache en memoria para productos');
    }
};

// ---- Funciones para Carrito ----

/**
 * Lee todos los carritos desde cart.json o desde cache
 * @returns {Promise<Array>} Arreglo de carritos de usuarios
 */
const leerCarrito = async () => {
    if (carritosCache !== null) {
        return JSON.parse(JSON.stringify(carritosCache));
    }
    const contenido = await fs.readFile(CART_PATH, 'utf-8');
    const datos = JSON.parse(contenido);
    carritosCache = datos;
    return JSON.parse(JSON.stringify(datos));
};

/**
 * Escribe el arreglo completo de carritos en cart.json
 * Si falla (Vercel readonly), guarda en cache en memoria
 * @param {Array} datos - Arreglo de carritos a guardar
 */
const escribirCarrito = async (datos) => {
    carritosCache = JSON.parse(JSON.stringify(datos));
    try {
        await fs.writeFile(CART_PATH, JSON.stringify(datos, null, 2));
    } catch (error) {
        console.log('Filesystem readonly, usando cache en memoria para carritos');
    }
};

// Exportamos las funciones para que el Service las pueda usar
module.exports = {
    leerProductos,
    escribirProductos,
    leerCarrito,
    escribirCarrito
};
