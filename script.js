// Productos
const productos = [
    { id: 1, nombre: 'Audífonos Bluetooth Premium', precio: 79.99, stock: 10, imagen: 'img/audifonos.jpg' },
    { id: 2, nombre: 'Bocina Portátil Sumergible', precio: 129.50, stock: 3, imagen: 'img/bocina.jpg' },
    { id: 3, nombre: 'Laptop Ultrabook 13"', precio: 999.00, stock: 5, imagen: 'img/laptop.jpg' },
    { id: 4, nombre: 'Monitor Curvo 27" Gaming', precio: 349.99, stock: 7, imagen: 'img/monitor.jpg' },
    { id: 5, nombre: 'Teclado Mecánico RGB', precio: 89.00, stock: 12, imagen: 'img/teclado.jpg' },
    { id: 6, nombre: 'Mouse Inalámbrico Ergonómico', precio: 45.00, stock: 15, imagen: 'img/mouse.jpg' },
    { id: 7, nombre: 'Webcam Full HD 1080p', precio: 59.99, stock: 9, imagen: 'img/webcam.jpg' }
];

let carrito = [];

// DOM
const productosGridDiv = document.getElementById('productos-grid');
const listaCarritoUl = document.getElementById('lista-carrito');
const totalCarritoSpan = document.getElementById('total-carrito');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');

// Mostrar productos
function mostrarProductos() {
    productosGridDiv.innerHTML = '';
    productos.forEach(producto => {
        const col = document.createElement('div');
        col.classList.add('col', 'mb-4');

        let controles = '';
        if (producto.stock > 0) {
            controles = `
                <p class="text-muted mb-2">Stock disponible: ${producto.stock}</p>
                <input type="number" min="1" value="1" max="${producto.stock}" class="form-control mb-2 cantidad-input" data-id="${producto.id}">
                <button class="btn btn-success mt-auto agregar-carrito" data-id="${producto.id}">Agregar al Carrito</button>
            `;
        } else {
            controles = `<p class="text-danger fw-bold mt-auto">AGOTADO</p>`;
        }

        col.innerHTML = `
            <div class="card h-100 producto-card">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text text-primary fs-5 fw-bold mb-1">Precio: $${producto.precio.toFixed(2)}</p>
                    ${controles}
                </div>
            </div>
        `;

        productosGridDiv.appendChild(col);
    });
}

// Delegación de eventos para agregar al carrito
document.addEventListener('click', e => {
    if (e.target.classList.contains('agregar-carrito')) {
        agregarProductoAlCarrito(e);
    }
});

// Agregar al carrito
function agregarProductoAlCarrito(event) {
    const id = parseInt(event.target.dataset.id);
    const input = document.querySelector(`.cantidad-input[data-id="${id}"]`);
    let cantidad = parseInt(input.value) || 1;

    const prod = productos.find(p => p.id === id);
    if (cantidad > prod.stock) {
        Swal.fire('Error', `No puedes agregar más de ${prod.stock} unidades.`, 'error');
        return;
    }

    // Evita stock negativo
    prod.stock = Math.max(0, prod.stock - cantidad);

    const enCarrito = carrito.find(item => item.id === id);
    if (enCarrito) enCarrito.cantidad += cantidad;
    else carrito.push({ ...prod, cantidad });

    actualizarCarrito();
    mostrarProductos();
}

// Actualizar carrito (con IVA)
function actualizarCarrito() {
    listaCarritoUl.innerHTML = '';
    let subtotal = 0;

    if (carrito.length === 0) {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'text-muted', 'text-center', 'carrito-vacio-mensaje');
        li.textContent = 'Tu carrito está vacío. ¡Añade algunos productos!';
        listaCarritoUl.appendChild(li);
    } else {
        carrito.forEach(prod => {
            const prodOriginal = productos.find(p => p.id === prod.id);

            const li = document.createElement('li');
            li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            li.innerHTML = `
                <div>
                    <strong>${prod.nombre}</strong><br>
                    Precio unitario: $${prod.precio.toFixed(2)}<br>
                    Stock restante: ${prodOriginal.stock}<br>
                    Cantidad en carrito: ${prod.cantidad}
                </div>
                <div class="text-end">
                    <span class="badge bg-primary rounded-pill mb-1">$${(prod.precio * prod.cantidad).toFixed(2)}</span><br>
                    <button class="btn btn-sm btn-danger eliminar-producto" data-id="${prod.id}">Eliminar</button>
                </div>
            `;
            listaCarritoUl.appendChild(li);
            subtotal += prod.precio * prod.cantidad;
        });
    }

    const iva = subtotal * 0.13;
    const totalConIVA = subtotal + iva;

    document.getElementById('subtotal-carrito').textContent = subtotal.toFixed(2);
    document.getElementById('iva-carrito').textContent = iva.toFixed(2);
    totalCarritoSpan.textContent = totalConIVA.toFixed(2);

    document.querySelectorAll('.eliminar-producto').forEach(btn => {
        btn.addEventListener('click', eliminarProducto);
    });
}

// Eliminar producto
function eliminarProducto(e) {
    const id = parseInt(e.target.dataset.id);
    const prodCarrito = carrito.find(item => item.id === id);
    if (prodCarrito) {
        const prodOriginal = productos.find(p => p.id === id);
        prodOriginal.stock += prodCarrito.cantidad;
    }
    carrito = carrito.filter(item => item.id !== id);
    actualizarCarrito();
    mostrarProductos();
}

// Vaciar carrito
function vaciarCarrito() {
    carrito.forEach(item => {
        const prodOriginal = productos.find(p => p.id === item.id);
        prodOriginal.stock += item.cantidad;
    });
    carrito = [];
    actualizarCarrito();
    mostrarProductos();
}
document.getElementById('vaciar-carrito').addEventListener('click', vaciarCarrito);

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    mostrarProductos();
    actualizarCarrito();
});

