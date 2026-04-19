// =============================================================
// cart.js — Logica del Front-End para el carrito de compras
// Lee y escribe en sessionStorage para persistir el carrito.
// Permite editar cantidades, eliminar productos y ver el total.
// =============================================================

// ID del producto que se esta editando/eliminando
let editProductId = null;
let deleteProductId = null;

// ============================================================
// INICIALIZACION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    cargarCarrito();
    actualizarContadorCarrito();

    // Evento: confirmar edicion de cantidad
    document.getElementById('btnConfirmEdit').addEventListener('click', confirmarEdicion);

    // Evento: confirmar eliminacion
    document.getElementById('btnConfirmDelete').addEventListener('click', confirmarEliminacion);

    // Evento: proceder al pago
    document.getElementById('btnCheckout').addEventListener('click', () => {
        const carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
        if (carrito.length === 0) {
            alert('Tu carrito esta vacio. Agrega productos antes de continuar.');
            return;
        }
        alert('Gracias por tu compra! (Funcionalidad de pago en desarrollo)');
    });
});

// ============================================================
// CARGAR CARRITO DESDE sessionStorage
// ============================================================
function cargarCarrito() {
    const carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
    const container = document.getElementById('cartItemsContainer');

    if (carrito.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-shopping-cart"></i>
                <h5>Tu carrito esta vacio</h5>
                <p>Agrega productos desde la tienda</p>
                <a href="home.html" class="btn btn-dark mt-2">
                    <i class="fas fa-store"></i> Ir a la Tienda
                </a>
            </div>
        `;
        actualizarResumen([]);
        return;
    }

    container.innerHTML = '';

    carrito.forEach((item, index) => {
        const subtotal = item.pricePerUnit * item.cantidad;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item d-flex align-items-center';

        cartItem.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.title}" class="mr-3"
                 onerror="this.src='https://via.placeholder.com/80x80?text=Img'" />
            <div class="flex-grow-1">
                <p class="item-title mb-1">${item.title}</p>
                <small class="text-muted">${item.category} | ${item.unit}</small>
                <p class="item-price mb-0">$${item.pricePerUnit.toFixed(2)} x ${item.cantidad} = <strong>$${subtotal.toFixed(2)}</strong></p>
            </div>
            <div class="d-flex flex-column align-items-center ml-2">
                <button class="btn btn-sm btn-outline-primary mb-1" onclick="abrirModalEditar('${item.id}')" title="Editar cantidad">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="abrirModalEliminar('${item.id}')" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        container.appendChild(cartItem);
    });

    actualizarResumen(carrito);
}

// ============================================================
// ACTUALIZAR RESUMEN Y TOTAL
// ============================================================
function actualizarResumen(carrito) {
    const summaryDetails = document.getElementById('summaryDetails');
    const totalAmount = document.getElementById('totalAmount');

    if (carrito.length === 0) {
        summaryDetails.innerHTML = '<p class="text-muted text-center">Sin productos</p>';
        totalAmount.textContent = '$0.00';
        return;
    }

    let html = '';
    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.pricePerUnit * item.cantidad;
        total += subtotal;
        html += `
            <div class="d-flex justify-content-between mb-1">
                <small>${item.title.substring(0, 20)}... (x${item.cantidad})</small>
                <small>$${subtotal.toFixed(2)}</small>
            </div>
        `;
    });

    summaryDetails.innerHTML = html;
    totalAmount.textContent = `$${total.toFixed(2)}`;
}

// ============================================================
// ABRIR MODAL PARA EDITAR CANTIDAD
// ============================================================
function abrirModalEditar(productId) {
    const carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
    const item = carrito.find(p => p.id === productId);

    if (!item) return;

    editProductId = productId;

    document.getElementById('editModalImg').src = item.imageUrl;
    document.getElementById('editModalTitle').textContent = item.title;
    document.getElementById('editModalQty').value = item.cantidad;

    $('#editModal').modal('show');
}

// ============================================================
// CONFIRMAR EDICION DE CANTIDAD
// ============================================================
function confirmarEdicion() {
    if (!editProductId) return;

    const nuevaCantidad = parseInt(document.getElementById('editModalQty').value);

    if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
        alert('Ingresa una cantidad valida (minimo 1)');
        return;
    }

    let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
    const index = carrito.findIndex(p => p.id === editProductId);

    if (index !== -1) {
        carrito[index].cantidad = nuevaCantidad;
        sessionStorage.setItem('carrito', JSON.stringify(carrito));
    }

    $('#editModal').modal('hide');
    editProductId = null;

    // Recargar carrito
    cargarCarrito();
    actualizarContadorCarrito();
}

// ============================================================
// ABRIR MODAL PARA CONFIRMAR ELIMINACION
// ============================================================
function abrirModalEliminar(productId) {
    const carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
    const item = carrito.find(p => p.id === productId);

    if (!item) return;

    deleteProductId = productId;
    document.getElementById('deleteProductName').textContent = `"${item.title}"`;

    $('#deleteModal').modal('show');
}

// ============================================================
// CONFIRMAR ELIMINACION DE PRODUCTO
// ============================================================
function confirmarEliminacion() {
    if (!deleteProductId) return;

    let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
    carrito = carrito.filter(p => p.id !== deleteProductId);
    sessionStorage.setItem('carrito', JSON.stringify(carrito));

    $('#deleteModal').modal('hide');
    deleteProductId = null;

    // Recargar carrito
    cargarCarrito();
    actualizarContadorCarrito();
}

// ============================================================
// ACTUALIZAR CONTADOR DEL CARRITO EN EL NAVBAR
// ============================================================
function actualizarContadorCarrito() {
    const carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    document.getElementById('cartCount').textContent = totalItems;
}
