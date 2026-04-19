// =============================================================
// app.js — Logica del Front-End para la pagina principal (home)
// Consume la API REST, muestra productos con paginacion,
// y permite agregar productos al carrito via sessionStorage.
// =============================================================

// URL base de la API
const API_URL = '/api';

// Pagina actual
let currentPage = 1;
const ITEMS_PER_PAGE = 4;

// Producto seleccionado en el modal
let selectedProduct = null;

// ============================================================
// INICIALIZACION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    cargarProductos(currentPage);
    actualizarContadorCarrito();
    actualizarNavbarUsuario();

    // Evento: buscar productos
    document.getElementById('searchForm').addEventListener('submit', (e) => {
        e.preventDefault();
        currentPage = 1;
        cargarProductos(currentPage);
    });

    // Evento: agregar al carrito desde el modal
    document.getElementById('btnAddToCart').addEventListener('click', agregarAlCarrito);

    // Evento: login
    document.getElementById('btnLogin').addEventListener('click', iniciarSesion);

    // Evento: registro
    document.getElementById('btnSignup').addEventListener('click', registrarUsuario);
});

// ============================================================
// CARGAR PRODUCTOS DESDE EL SERVIDOR (con paginacion)
// ============================================================
async function cargarProductos(page) {
    const mainList = document.getElementById('mainList');
    const spinner = document.getElementById('loadingSpinner');
    const searchTerm = document.getElementById('searchInput').value.trim();

    // Mostrar spinner
    mainList.innerHTML = '';
    mainList.appendChild(spinner);
    spinner.style.display = 'block';

    try {
        // Construir URL con paginacion y filtro de busqueda
        let url = `${API_URL}/products?page=${page}&limit=${ITEMS_PER_PAGE}`;
        if (searchTerm) {
            url += `&title=${encodeURIComponent(searchTerm)}`;
        }

        const response = await fetch(url);
        const data = await response.json();

        // Ocultar spinner
        spinner.style.display = 'none';

        // Renderizar productos
        if (data.products && data.products.length > 0) {
            renderizarProductos(data.products);
            renderizarPaginacion(data.page, data.totalPages);
        } else {
            mainList.innerHTML = `
                <div class="col-12 empty-state">
                    <i class="fas fa-search"></i>
                    <h5>No se encontraron productos</h5>
                    <p>Intenta con otra busqueda</p>
                </div>
            `;
            document.getElementById('paginationList').innerHTML = '';
        }
    } catch (error) {
        console.error('Error al cargar productos:', error);
        spinner.style.display = 'none';
        mainList.innerHTML = `
            <div class="col-12 empty-state">
                <i class="fas fa-exclamation-triangle"></i>
                <h5>Error al cargar productos</h5>
                <p>Verifica que el servidor este corriendo en el puerto 3100</p>
            </div>
        `;
    }
}

// ============================================================
// RENDERIZAR TARJETAS DE PRODUCTOS
// ============================================================
function renderizarProductos(productos) {
    const mainList = document.getElementById('mainList');
    mainList.innerHTML = '';

    productos.forEach(producto => {
        const col = document.createElement('div');
        col.className = 'col-lg-3 col-md-4 col-sm-6 col-12 mb-4';

        col.innerHTML = `
            <div class="card card-product h-100">
                <img src="${producto.imageUrl}" class="card-img-top" alt="${producto.title}"
                     onerror="this.src='https://via.placeholder.com/200x200?text=Sin+Imagen'" />
                <div class="card-body d-flex flex-column">
                    <span class="badge badge-secondary category-badge mb-2">${producto.category}</span>
                    <h6 class="card-title">${producto.title}</h6>
                    <p class="card-text">${producto.description.substring(0, 60)}...</p>
                    <div class="mt-auto">
                        <p class="price mb-2">$${producto.pricePerUnit.toFixed(2)}</p>
                        <button class="btn btn-dark btn-block btn-sm"
                                onclick="abrirModal('${producto.id}')">
                            <i class="fas fa-eye"></i> Ver Detalle
                        </button>
                    </div>
                </div>
            </div>
        `;

        mainList.appendChild(col);
    });
}

// ============================================================
// RENDERIZAR PAGINACION
// ============================================================
function renderizarPaginacion(paginaActual, totalPaginas) {
    const paginationList = document.getElementById('paginationList');
    paginationList.innerHTML = '';

    // Boton "Anterior"
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${paginaActual <= 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" tabindex="-1">Anterior</a>`;
    prevLi.addEventListener('click', (e) => {
        e.preventDefault();
        if (paginaActual > 1) {
            currentPage = paginaActual - 1;
            cargarProductos(currentPage);
        }
    });
    paginationList.appendChild(prevLi);

    // Numeros de pagina
    for (let i = 1; i <= totalPaginas; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === paginaActual ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        li.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i;
            cargarProductos(currentPage);
        });
        paginationList.appendChild(li);
    }

    // Boton "Siguiente"
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${paginaActual >= totalPaginas ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#">Siguiente</a>`;
    nextLi.addEventListener('click', (e) => {
        e.preventDefault();
        if (paginaActual < totalPaginas) {
            currentPage = paginaActual + 1;
            cargarProductos(currentPage);
        }
    });
    paginationList.appendChild(nextLi);
}

// ============================================================
// ABRIR MODAL CON DETALLE DEL PRODUCTO
// ============================================================
async function abrirModal(productId) {
    try {
        const response = await fetch(`${API_URL}/products/${productId}`);
        const producto = await response.json();

        selectedProduct = producto;

        // Llenar datos en el modal
        document.getElementById('modalImg').src = producto.imageUrl;
        document.getElementById('modalTitle').textContent = producto.title;
        document.getElementById('modalDescription').textContent = producto.description;
        document.getElementById('modalCategory').textContent = producto.category;
        document.getElementById('modalUnit').textContent = producto.unit;
        document.getElementById('modalPrice').textContent = `$${producto.pricePerUnit.toFixed(2)}`;
        document.getElementById('modalQty').value = 1;

        // Abrir modal con jQuery (Bootstrap 4)
        $('#productModal').modal('show');
    } catch (error) {
        console.error('Error al obtener producto:', error);
        alert('Error al cargar el detalle del producto');
    }
}

// ============================================================
// AGREGAR PRODUCTO AL CARRITO (sessionStorage)
// ============================================================
function agregarAlCarrito() {
    if (!selectedProduct) return;

    const cantidad = parseInt(document.getElementById('modalQty').value) || 1;

    // Obtener carrito actual de sessionStorage
    let carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];

    // Verificar si el producto ya esta en el carrito
    const indexExistente = carrito.findIndex(item => item.id === selectedProduct.id);

    if (indexExistente !== -1) {
        // Si ya existe, sumar la cantidad
        carrito[indexExistente].cantidad += cantidad;
    } else {
        // Si no existe, agregar nuevo item
        carrito.push({
            id: selectedProduct.id,
            imageUrl: selectedProduct.imageUrl,
            title: selectedProduct.title,
            description: selectedProduct.description,
            category: selectedProduct.category,
            unit: selectedProduct.unit,
            pricePerUnit: selectedProduct.pricePerUnit,
            cantidad: cantidad
        });
    }

    // Guardar en sessionStorage
    sessionStorage.setItem('carrito', JSON.stringify(carrito));

    // Actualizar contador
    actualizarContadorCarrito();

    // Cerrar modal
    $('#productModal').modal('hide');

    // Mostrar confirmacion
    mostrarAlerta(`"${selectedProduct.title}" agregado al carrito (x${cantidad})`);
}

// ============================================================
// ACTUALIZAR CONTADOR DEL CARRITO EN EL NAVBAR
// ============================================================
function actualizarContadorCarrito() {
    const carrito = JSON.parse(sessionStorage.getItem('carrito')) || [];
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

// ============================================================
// MOSTRAR ALERTA TEMPORAL
// ============================================================
function mostrarAlerta(mensaje) {
    // Eliminar alerta previa si existe
    const alertaPrevia = document.querySelector('.alert-flotante');
    if (alertaPrevia) alertaPrevia.remove();

    const alerta = document.createElement('div');
    alerta.className = 'alert alert-success alert-dismissible fade show alert-flotante';
    alerta.style.cssText = 'position: fixed; top: 70px; right: 20px; z-index: 9999; min-width: 300px;';
    alerta.innerHTML = `
        <strong><i class="fas fa-check-circle"></i></strong> ${mensaje}
        <button type="button" class="close" data-dismiss="alert">&times;</button>
    `;
    document.body.appendChild(alerta);

    // Auto-cerrar despues de 3 segundos
    setTimeout(() => {
        if (alerta.parentNode) alerta.remove();
    }, 3000);
}

// ============================================================
// LOGIN - Iniciar Sesion (usa sessionStorage)
// ============================================================
function iniciarSesion() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const errorDiv = document.getElementById('loginError');
    const successDiv = document.getElementById('loginSuccess');

    errorDiv.classList.add('d-none');
    successDiv.classList.add('d-none');

    if (!email || !password) {
        errorDiv.textContent = 'Por favor completa todos los campos.';
        errorDiv.classList.remove('d-none');
        return;
    }

    // Buscar usuario registrado en sessionStorage
    const usuarios = JSON.parse(sessionStorage.getItem('usuarios')) || [];
    const usuario = usuarios.find(u => u.email === email && u.password === password);

    if (!usuario) {
        errorDiv.textContent = 'Correo o contrasena incorrectos.';
        errorDiv.classList.remove('d-none');
        return;
    }

    // Guardar sesion activa
    sessionStorage.setItem('usuarioActivo', JSON.stringify(usuario));
    successDiv.textContent = `Bienvenido, ${usuario.nombre}!`;
    successDiv.classList.remove('d-none');

    setTimeout(() => {
        $('#loginModal').modal('hide');
        actualizarNavbarUsuario();
        mostrarAlerta(`Sesion iniciada como ${usuario.nombre}`);
    }, 1000);
}

// ============================================================
// REGISTRO - Registrar Usuario (usa sessionStorage)
// ============================================================
function registrarUsuario() {
    const nombre = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const password = document.getElementById('signupPassword').value.trim();
    const errorDiv = document.getElementById('signupError');
    const successDiv = document.getElementById('signupSuccess');

    errorDiv.classList.add('d-none');
    successDiv.classList.add('d-none');

    if (!nombre || !email || !password) {
        errorDiv.textContent = 'Por favor completa todos los campos.';
        errorDiv.classList.remove('d-none');
        return;
    }

    // Verificar si ya existe el correo
    let usuarios = JSON.parse(sessionStorage.getItem('usuarios')) || [];
    if (usuarios.find(u => u.email === email)) {
        errorDiv.textContent = 'Este correo ya esta registrado.';
        errorDiv.classList.remove('d-none');
        return;
    }

    // Registrar nuevo usuario
    usuarios.push({ nombre, email, password });
    sessionStorage.setItem('usuarios', JSON.stringify(usuarios));

    successDiv.textContent = 'Registro exitoso! Ya puedes iniciar sesion.';
    successDiv.classList.remove('d-none');

    setTimeout(() => {
        $('#signupModal').modal('hide');
        document.getElementById('signupForm').reset();
        mostrarAlerta(`Usuario ${nombre} registrado correctamente`);
    }, 1500);
}

// ============================================================
// ACTUALIZAR NAVBAR SEGUN SESION
// ============================================================
function actualizarNavbarUsuario() {
    const usuario = JSON.parse(sessionStorage.getItem('usuarioActivo'));
    const dropdownMenu = document.querySelector('.dropdown-menu-right');

    if (usuario) {
        dropdownMenu.innerHTML = `
            <span class="dropdown-item-text"><strong>${usuario.nombre}</strong></span>
            <span class="dropdown-item-text text-muted">${usuario.email}</span>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" href="#">Mis pedidos</a>
            <a class="dropdown-item" href="#" id="btnLogout">Cerrar Sesion</a>
        `;
        // Evento cerrar sesion
        document.getElementById('btnLogout').addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('usuarioActivo');
            location.reload();
        });
    }
}
