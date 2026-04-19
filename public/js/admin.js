// =============================================================
// admin.js — Logica del Panel de Administracion
// CRUD completo de productos usando la API REST.
// Requiere header x-auth: admin para crear, editar y eliminar.
// =============================================================

const API_URL = '/api';
const ADMIN_HEADER = { 'x-auth': 'admin' };

// ID del producto que se esta editando/eliminando
let editingProductId = null;
let deletingProductId = null;

// ============================================================
// INICIALIZACION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    cargarProductosAdmin();
    actualizarContadorCarrito();

    // Evento: guardar producto (crear o editar)
    document.getElementById('btnGuardarProducto').addEventListener('click', guardarProducto);

    // Evento: confirmar eliminacion
    document.getElementById('btnConfirmDeleteProduct').addEventListener('click', confirmarEliminacion);

    // Evento: limpiar formulario al abrir modal para nuevo producto
    document.getElementById('btnNuevoProducto').addEventListener('click', () => {
        limpiarFormulario();
        document.getElementById('formModalTitle').textContent = 'Nuevo Producto';
    });
});

// ============================================================
// CARGAR TODOS LOS PRODUCTOS (con header admin para ver stock)
// ============================================================
async function cargarProductosAdmin() {
    const spinner = document.getElementById('loadingSpinner');
    const tbody = document.getElementById('productsTableBody');

    spinner.style.display = 'block';
    tbody.innerHTML = '';

    try {
        // Pedir todos los productos sin paginacion (limit alto) y con header admin
        const response = await fetch(`${API_URL}/products?limit=100`, {
            headers: ADMIN_HEADER
        });
        const data = await response.json();

        spinner.style.display = 'none';

        if (data.products && data.products.length > 0) {
            renderizarTabla(data.products);
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted py-4">
                        No hay productos registrados. Crea uno nuevo.
                    </td>
                </tr>
            `;
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
        spinner.style.display = 'none';
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-danger py-4">
                    Error al conectar con el servidor. Verifica que este corriendo.
                </td>
            </tr>
        `;
    }
}

// ============================================================
// RENDERIZAR TABLA DE PRODUCTOS
// ============================================================
function renderizarTabla(productos) {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = '';

    productos.forEach(producto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <img src="${producto.imageUrl}" alt="${producto.title}"
                     onerror="this.src='https://via.placeholder.com/50x50?text=Img'" />
            </td>
            <td>${producto.title}</td>
            <td><span class="badge badge-info">${producto.category}</span></td>
            <td>$${producto.pricePerUnit.toFixed(2)}</td>
            <td>${producto.stock}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary btn-admin mr-1"
                        onclick="abrirModalEditar('${producto.id}')">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-sm btn-outline-danger btn-admin"
                        onclick="abrirModalEliminar('${producto.id}', '${producto.title.replace(/'/g, "\\'")}')">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// ============================================================
// GUARDAR PRODUCTO (Crear o Actualizar)
// ============================================================
async function guardarProducto() {
    // Validar formulario
    const form = document.getElementById('productForm');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const productData = {
        title: document.getElementById('formTitle').value.trim(),
        category: document.getElementById('formCategory').value,
        description: document.getElementById('formDescription').value.trim(),
        imageUrl: document.getElementById('formImageUrl').value.trim(),
        pricePerUnit: parseFloat(document.getElementById('formPrice').value),
        stock: parseInt(document.getElementById('formStock').value),
        unit: document.getElementById('formUnit').value.trim()
    };

    try {
        let response;

        if (editingProductId) {
            // ACTUALIZAR producto existente (PUT)
            response = await fetch(`${API_URL}/products/${editingProductId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...ADMIN_HEADER
                },
                body: JSON.stringify(productData)
            });
        } else {
            // CREAR nuevo producto (POST)
            response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...ADMIN_HEADER
                },
                body: JSON.stringify(productData)
            });
        }

        const result = await response.json();

        if (response.ok) {
            $('#productFormModal').modal('hide');
            limpiarFormulario();
            cargarProductosAdmin(); // Recargar tabla
            alert(result.message);
        } else {
            alert('Error: ' + (result.error || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error al guardar producto:', error);
        alert('Error de conexion con el servidor');
    }
}

// ============================================================
// ABRIR MODAL PARA EDITAR PRODUCTO
// ============================================================
async function abrirModalEditar(productId) {
    try {
        const response = await fetch(`${API_URL}/products/${productId}`, {
            headers: ADMIN_HEADER
        });
        const producto = await response.json();

        editingProductId = productId;

        // Llenar formulario con datos del producto
        document.getElementById('formModalTitle').textContent = 'Editar Producto';
        document.getElementById('formProductId').value = productId;
        document.getElementById('formTitle').value = producto.title;
        document.getElementById('formCategory').value = producto.category;
        document.getElementById('formDescription').value = producto.description;
        document.getElementById('formImageUrl').value = producto.imageUrl;
        document.getElementById('formPrice').value = producto.pricePerUnit;
        document.getElementById('formStock').value = producto.stock;
        document.getElementById('formUnit').value = producto.unit;

        $('#productFormModal').modal('show');
    } catch (error) {
        console.error('Error al cargar producto para editar:', error);
        alert('Error al cargar el producto');
    }
}

// ============================================================
// ABRIR MODAL PARA CONFIRMAR ELIMINACION
// ============================================================
function abrirModalEliminar(productId, productName) {
    deletingProductId = productId;
    document.getElementById('deleteAdminProductName').textContent = `"${productName}"`;
    $('#deleteProductModal').modal('show');
}

// ============================================================
// CONFIRMAR ELIMINACION DE PRODUCTO
// ============================================================
async function confirmarEliminacion() {
    if (!deletingProductId) return;

    try {
        const response = await fetch(`${API_URL}/products/${deletingProductId}`, {
            method: 'DELETE',
            headers: ADMIN_HEADER
        });

        const result = await response.json();

        if (response.ok) {
            $('#deleteProductModal').modal('hide');
            deletingProductId = null;
            cargarProductosAdmin(); // Recargar tabla
            alert(result.message);
        } else {
            alert('Error: ' + (result.error || 'Error desconocido'));
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        alert('Error de conexion con el servidor');
    }
}

// ============================================================
// LIMPIAR FORMULARIO
// ============================================================
function limpiarFormulario() {
    editingProductId = null;
    document.getElementById('productForm').reset();
    document.getElementById('formProductId').value = '';
    document.getElementById('formUnit').value = 'pieza';
}

// ============================================================
// ACTUALIZAR CONTADOR DEL CARRITO EN EL NAVBAR
// ============================================================
function actualizarContadorCarrito() {
    const carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = totalItems;
}
