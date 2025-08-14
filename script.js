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

// Mostrar productos con imágenes, stock y campo de cantidad
function mostrarProductos() {
    productosGridDiv.innerHTML = ''; 

    productos.forEach(producto => {
        const productoCardCol = document.createElement('div');
        productoCardCol.classList.add('col', 'mb-4'); 
        
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

    productosGridDiv.addEventListener('click', (event) => {
        if (event.target.classList.contains('agregar-carrito')) {
            agregarProductoAlCarrito(event);
        }
    });
}

// Agregar producto con validación y actualización de stock
function agregarProductoAlCarrito(event) {
    const idProducto = parseInt(event.target.dataset.id); 
    const cantidadInput = document.querySelector(`.cantidad-input[data-id="${idProducto}"]`);
    let cantidad = parseInt(cantidadInput.value);

    if (cantidad < 1 || isNaN(cantidad)) cantidad = 1;

    const productoSeleccionado = productos.find(p => p.id === idProducto);
    if (!productoSeleccionado) return;

    if (cantidad > productoSeleccionado.stock) {
        alert(`No puedes agregar más de ${productoSeleccionado.stock} unidades disponibles.`);
        return;
    }

    // Reducir el stock real del producto
    productoSeleccionado.stock -= cantidad;

    const enCarrito = carrito.find(item => item.id === idProducto);
    if (enCarrito) {
        enCarrito.cantidad += cantidad;
    } else {
        carrito.push({ ...productoSeleccionado, cantidad });
    }

    actualizarCarrito();
    mostrarProductos(); // Recargar la vista para mostrar "AGOTADO" si stock = 0
}

// Mostrar carrito con stock
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
                    <br>Stock restante: ${producto.stock}
                    <br>Cantidad en carrito: ${producto.cantidad}
                </div>
                <div class="text-end">
                    <span class="badge bg-primary rounded-pill mb-1">$${(producto.precio * producto.cantidad).toFixed(2)}</span>
                    <br>
                    <button class="btn btn-sm btn-danger eliminar-producto" data-id="${producto.id}">Eliminar</button>
                </div>
            `;
            listaCarritoUl.appendChild(li);
            total += producto.precio * producto.cantidad;
        });
    }
    totalCarritoSpan.textContent = total.toFixed(2);

    document.querySelectorAll('.eliminar-producto').forEach(btn => {
        btn.addEventListener('click', eliminarProducto);
    });
}

// Eliminar producto del carrito y devolver stock
function eliminarProducto(event) {
    const idProducto = parseInt(event.target.dataset.id);
    const productoEnCarrito = carrito.find(item => item.id === idProducto);

    if (productoEnCarrito) {
        // Devolver el stock al producto original
        const productoOriginal = productos.find(p => p.id === idProducto);
        productoOriginal.stock += productoEnCarrito.cantidad;
    }

    carrito = carrito.filter(item => item.id !== idProducto);
    actualizarCarrito();
    mostrarProductos(); // Actualizar la vista
}

// Vaciar carrito y devolver stock
function vaciarCarrito() {
    carrito.forEach(item => {
        const productoOriginal = productos.find(p => p.id === item.id);
        productoOriginal.stock += item.cantidad;
    });
    carrito = [];
    actualizarCarrito();
    mostrarProductos();
}

// Eventos
vaciarCarritoBtn.addEventListener('click', vaciarCarrito);

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    mostrarProductos();
    actualizarCarrito();
});



// Botón para confirmar la compra
const confirmarCompraBtn = document.getElementById('confirmar-compra');

// Tasa de impuesto (IVA)
const IVA = 0.13;

/**
 * Función para confirmar la compra y mostrar la factura.
 */
function confirmarCompra() {
    if (carrito.length === 0) {
       Swal.fire({
  icon: 'info',
  title: '¡Tu carrito está vacío!',
  text: 'Añade algunos productos para continuar.',
});
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

    // Mostrar factura en un modal o contenedor en pantalla
    const facturaDiv = document.getElementById('factura');
    facturaDiv.innerHTML = facturaHTML;
    facturaDiv.style.display = 'block';

    // Actualizar inventario restando las cantidades compradas
    carrito.forEach(item => {
        const productoTienda = productos.find(p => p.id === item.id);
        if (productoTienda) {
            productoTienda.stock -= item.cantidad;
        }
    });

    // Vaciar el carrito
    carrito = [];
    actualizarCarrito();
    mostrarProductos();
}

// Asociar evento al botón
confirmarCompraBtn.addEventListener('click', confirmarCompra);
