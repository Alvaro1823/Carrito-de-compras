// 1. Definición de los productos disponibles en la tienda con stock
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

// Referencias a los elementos del DOM
const productosGridDiv = document.getElementById('productos-grid');
const listaCarritoUl = document.getElementById('lista-carrito');
const totalCarritoSpan = document.getElementById('total-carrito');
const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
const confirmarCompraBtn = document.getElementById('confirmar-compra');

// Tasa de impuesto (IVA)
const IVA = 0.13;

// Función que maneja los clics en los productos de la tienda
function handleProductClick(event) {
    if (event.target.classList.contains('agregar-carrito')) {
        agregarProductoAlCarrito(event);
    } else if (event.target.classList.contains('btn-mas-producto')) {
        modificarCantidadProducto(event, 1);
    } else if (event.target.classList.contains('btn-menos-producto')) {
        modificarCantidadProducto(event, -1);
    }
}

// Funciones principales
function mostrarProductos() {
    productosGridDiv.innerHTML = '';
    productos.forEach(producto => {
        const productoCardCol = document.createElement('div');
        productoCardCol.classList.add('col', 'mb-4');

        let controles = '';
        if (producto.stock > 0) {
            controles = `
                <p class="text-muted mb-2">Stock disponible: ${producto.stock}</p>
                <div class="input-group">
                    <button class="btn btn-sm btn-outline-secondary btn-menos-producto" type="button" data-id="${producto.id}">-</button>
                    <input type="text" min="1" value="1" max="${producto.stock}" class="form-control text-center cantidad-input" data-id="${producto.id}">
                    <button class="btn btn-sm btn-outline-secondary btn-mas-producto" type="button" data-id="${producto.id}">+</button>
                </div>
                <button class="btn btn-success mt-auto agregar-carrito w-100" data-id="${producto.id}">Agregar al Carrito</button>
            `;
        } else {
            controles = `<p class="text-danger fw-bold mt-auto">AGOTADO</p>`;
        }

        productoCardCol.innerHTML = `
            <div class="card h-100 producto-card">
                <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text text-primary fs-5 fw-bold mb-1">Precio: $${producto.precio.toFixed(2)}</p>
                    ${controles}
                </div>
            </div>
        `;
        productosGridDiv.appendChild(productoCardCol);
    });
}

function modificarCantidadProducto(event, cambio) {
    const idProducto = event.target.dataset.id;
    const input = document.querySelector(`.cantidad-input[data-id="${idProducto}"]`);
    let cantidad = parseInt(input.value);
    cantidad += cambio;

    if (cantidad < 1) {
        cantidad = 1;
    }

    const productoSeleccionado = productos.find(p => p.id === parseInt(idProducto));
    if (cantidad > productoSeleccionado.stock) {
        Swal.fire('Error', `Solo puedes agregar hasta ${productoSeleccionado.stock} unidades.`, 'error');
        cantidad = productoSeleccionado.stock;
    }
    input.value = cantidad;
}

function agregarProductoAlCarrito(event) {
    const idProducto = parseInt(event.target.dataset.id);
    const cantidadInput = document.querySelector(`.cantidad-input[data-id="${idProducto}"]`);
    let cantidad = parseInt(cantidadInput.value);

    if (cantidad < 1 || isNaN(cantidad)) {
        Swal.fire('Error', 'La cantidad debe ser un número positivo.', 'error');
        cantidad = 1;
    }

    const productoSeleccionado = productos.find(p => p.id === idProducto);
    if (!productoSeleccionado) return;

    if (cantidad > productoSeleccionado.stock) {
        Swal.fire('Error', `No puedes agregar más de ${productoSeleccionado.stock} unidades.`, 'error');
        return;
    }

    productoSeleccionado.stock -= cantidad;

    const enCarrito = carrito.find(item => item.id === idProducto);
    if (enCarrito) {
        enCarrito.cantidad += cantidad;
    } else {
        carrito.push({ ...productoSeleccionado, cantidad });
    }

    cantidadInput.value = 1;

    actualizarCarrito();
    mostrarProductos();
}

function actualizarCarrito() {
    listaCarritoUl.innerHTML = '';
    let total = 0;

    if (carrito.length === 0) {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'text-muted', 'text-center', 'carrito-vacio-mensaje');
        li.textContent = 'Tu carrito está vacío. ¡Añade algunos productos!';
        listaCarritoUl.appendChild(li);
    } else {
        carrito.forEach(producto => {
            const li = document.createElement('li');
            li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            li.innerHTML = `
                <div>
                    <strong>${producto.nombre}</strong>
                    <br>Precio unitario: $${producto.precio.toFixed(2)}
                </div>
                <div class="d-flex flex-column align-items-end">
                    <span class="badge bg-primary rounded-pill mb-1">$${(producto.precio * producto.cantidad).toFixed(2)}</span>
                    <br>
                    <div class="input-group input-group-sm mt-2" style="width: 120px;">
                        <button class="btn btn-danger btn-menos" type="button" data-id="${producto.id}">-</button>
                        <input type="text" class="form-control text-center cantidad-carrito" value="${producto.cantidad}" readonly>
                        <button class="btn btn-success btn-mas" type="button" data-id="${producto.id}">+</button>
                    </div>
                </div>
            `;
            listaCarritoUl.appendChild(li);
            total += producto.precio * producto.cantidad;
        });
    }
    totalCarritoSpan.textContent = total.toFixed(2);

    document.querySelectorAll('.btn-mas').forEach(btn => {
        btn.addEventListener('click', modificarCantidad);
    });
    document.querySelectorAll('.btn-menos').forEach(btn => {
        btn.addEventListener('click', modificarCantidad);
    });
}

function modificarCantidad(event) {
    const idProducto = parseInt(event.target.dataset.id);
    const productoEnCarrito = carrito.find(item => item.id === idProducto);
    const productoOriginal = productos.find(p => p.id === idProducto);
    const esMas = event.target.classList.contains('btn-mas');

    if (esMas) {
        if (productoOriginal.stock > 0) {
            productoEnCarrito.cantidad++;
            productoOriginal.stock--;
        } else {
            Swal.fire('Atención', 'No hay más stock disponible de este producto.', 'warning');
        }
    } else {
        if (productoEnCarrito.cantidad > 1) {
            productoEnCarrito.cantidad--;
            productoOriginal.stock++;
        } else {
            Swal.fire({
                title: '¿Eliminar producto?',
                text: '¿Quieres eliminar este producto del carrito?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'Sí, eliminar',
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    eliminarProducto({ target: { dataset: { id: idProducto } } });
                }
            });
        }
    }
    actualizarCarrito();
    mostrarProductos();
}

function eliminarProducto(event) {
    const idProducto = parseInt(event.target.dataset.id);
    const productoEnCarrito = carrito.find(item => item.id === idProducto);

    if (productoEnCarrito) {
        const productoOriginal = productos.find(p => p.id === idProducto);
        if (productoOriginal) {
            productoOriginal.stock += productoEnCarrito.cantidad;
        }
    }
    carrito = carrito.filter(item => item.id !== idProducto);
    actualizarCarrito();
    mostrarProductos();
}

function vaciarCarrito() {
    carrito.forEach(item => {
        const productoOriginal = productos.find(p => p.id === item.id);
        if (productoOriginal) {
            productoOriginal.stock += item.cantidad;
        }
    });
    carrito = [];
    actualizarCarrito();
    mostrarProductos();
}

function confirmarCompra() {
    if (carrito.length === 0) {
        Swal.fire('Info', '¡Tu carrito está vacío! Añade productos para continuar.', 'info');
        return;
    }

    let subtotal = 0;
    let facturaHTML = `
        <h3>Factura de Compra</h3>
        <table class="table table-bordered table-striped">
            <thead class="table-dark">
                <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
    `;

    carrito.forEach(producto => {
        const totalProducto = producto.precio * producto.cantidad;
        subtotal += totalProducto;
        facturaHTML += `
            <tr>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>$${producto.precio.toFixed(2)}</td>
                <td>$${totalProducto.toFixed(2)}</td>
            </tr>
        `;
    });

    const impuesto = subtotal * IVA;
    const totalGeneral = subtotal + impuesto;

    facturaHTML += `
            </tbody>
        </table>
        <p><strong>Subtotal:</strong> $${subtotal.toFixed(2)}</p>
        <p><strong>IVA (13%):</strong> $${impuesto.toFixed(2)}</p>
        <p><strong>Total a Pagar:</strong> $${totalGeneral.toFixed(2)}</p>
    `;

    Swal.fire({
        title: '¡Compra confirmada!',
        html: facturaHTML,
        icon: 'success',
        width: 600,
        showCancelButton: true,
        confirmButtonText: 'Cerrar',
        cancelButtonText: 'Imprimir',
        reverseButtons: true
    }).then((result) => {
        if (result.dismiss === Swal.DismissReason.cancel) {
            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow.document.write('<html><head><title>Factura</title>');
            printWindow.document.write('<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">');
            printWindow.document.write('</head><body>');
            printWindow.document.write(facturaHTML);
            printWindow.document.close();
            printWindow.print();
        }
    });

    carrito = [];
    actualizarCarrito();
    mostrarProductos();
}

// Lógica de autenticación
function verificarSesion() {
    const sesionActiva = localStorage.getItem("sesion");
    if (!sesionActiva) {
        window.location.href = "login.html";
    }
}

// Eventos e Inicialización
verificarSesion();
vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
confirmarCompraBtn.addEventListener('click', confirmarCompra);
productosGridDiv.addEventListener('click', handleProductClick); // Event listener se agrega solo una vez

document.addEventListener('DOMContentLoaded', () => {
    mostrarProductos();
    actualizarCarrito();
});