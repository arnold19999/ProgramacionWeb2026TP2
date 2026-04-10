const productos = [
  {
    id: 1,
    nombre: "Webcam Microsoft HD",
    precio: 185000,
    descripcion: "Cámara web HD para videollamadas y clases virtuales.",
    imagen: "assets/webcam.png"
  },
  {
    id: 2,
    nombre: "Auricular MegaStar",
    precio: 235000,
    descripcion: "Auricular inalámbrico con diseño cómodo y sonido estéreo.",
    imagen: "assets/auriculares.jpg"
  },
  {
    id: 3,
    nombre: "Monitor Philips 24 pulgadas",
    precio: 890000,
    descripcion: "Monitor Full HD ideal para oficina, estudio y entretenimiento.",
    imagen: "assets/monitor.webp"
  },
  {
    id: 4,
    nombre: "Teclado Logitech USB",
    precio: 120000,
    descripcion: "Teclado numérico completo para uso diario.",
    imagen: "assets/teclado.jpg"
  },
  {
    id: 5,
    nombre: "Mouse Gamer Inalámbrico",
    precio: 145000,
    descripcion: "Mouse ergonómico con respuesta rápida y diseño moderno.",
    imagen: "assets/mouse.webp"
  },
  {
    id: 6,
    nombre: "Pendrive SanDisk 128 GB",
    precio: 98000,
    descripcion: "Memoria USB 3.0 para almacenamiento de archivos.",
    imagen: "assets/pendrive.webp"
  }
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const listaProductos = document.getElementById("listaProductos");
const listaCarrito = document.getElementById("listaCarrito");
const totalCarrito = document.getElementById("totalCarrito");
const totalComprobante = document.getElementById("totalComprobante");
const detalleComprobante = document.getElementById("detalleComprobante");
const cantidadItems = document.getElementById("cantidadItems");
const buscador = document.getElementById("buscador");
const btnVaciar = document.getElementById("btnVaciar");
const btnImprimir = document.getElementById("btnImprimir");
const fechaComprobante = document.getElementById("fechaComprobante");
const numeroComprobante = document.getElementById("numeroComprobante");

function formatearMoneda(valor) {
  return "Gs. " + valor.toLocaleString("es-PY");
}

function generarNumeroComprobante() {
  const actual = Number(localStorage.getItem("numeroComprobanteTema4")) || 1;
  numeroComprobante.textContent = String(actual).padStart(5, "0");
}

function renderProductos(texto = "") {
  listaProductos.innerHTML = "";
  const textoFiltrado = texto.trim().toLowerCase();

  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(textoFiltrado)
  );

  if (productosFiltrados.length === 0) {
    listaProductos.innerHTML = '<div class="sin-resultados">No se encontraron productos con ese nombre.</div>';
    return;
  }

  productosFiltrados.forEach((producto) => {
    const card = document.createElement("article");
    card.className = "card-producto";
    card.innerHTML = `
      <div class="imagen">
        <img src="${producto.imagen}" alt="${producto.nombre}">
      </div>
      <div class="info-producto">
        <h3>${producto.nombre}</h3>
        <p>${producto.descripcion}</p>
        <div class="precio">${formatearMoneda(producto.precio)}</div>
        <div class="acciones-card">
          <span class="badge">ID ${producto.id}</span>
          <button class="btn" type="button" onclick="agregarCarrito(${producto.id})">Agregar</button>
        </div>
      </div>
    `;
    listaProductos.appendChild(card);
  });
}

function agregarCarrito(idProducto) {
  const producto = productos.find((item) => item.id === idProducto);
  const existente = carrito.find((item) => item.id === idProducto);

  if (existente) {
    existente.cantidad += 1;
  } else {
    carrito.push({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: 1
    });
  }

  guardarCarrito();
  renderCarrito();
}

function cambiarCantidad(idProducto, cambio) {
  carrito = carrito.map((item) => {
    if (item.id === idProducto) {
      return { ...item, cantidad: item.cantidad + cambio };
    }
    return item;
  }).filter((item) => item.cantidad > 0);

  guardarCarrito();
  renderCarrito();
}

function eliminarProducto(idProducto) {
  carrito = carrito.filter((item) => item.id !== idProducto);
  guardarCarrito();
  renderCarrito();
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function renderCarrito() {
  listaCarrito.innerHTML = "";
  detalleComprobante.innerHTML = "";

  if (carrito.length === 0) {
    listaCarrito.innerHTML = '<div class="carrito-vacio">Todavía no agregaste productos al carrito.</div>';
  }

  let total = 0;
  let totalItems = 0;

  carrito.forEach((item) => {
    const subtotal = item.precio * item.cantidad;
    total += subtotal;
    totalItems += item.cantidad;

    const card = document.createElement("div");
    card.className = "item-carrito";
    card.innerHTML = `
      <div class="fila-item">
        <h4>${item.nombre}</h4>
        <button class="btn-eliminar" type="button" onclick="eliminarProducto(${item.id})">Eliminar</button>
      </div>
      <p>Precio: ${formatearMoneda(item.precio)}</p>
      <p>Subtotal: <strong>${formatearMoneda(subtotal)}</strong></p>
      <div class="controles-cantidad">
        <button class="btn-mini" type="button" onclick="cambiarCantidad(${item.id}, -1)">-</button>
        <span>Cantidad: ${item.cantidad}</span>
        <button class="btn-mini" type="button" onclick="cambiarCantidad(${item.id}, 1)">+</button>
      </div>
    `;
    listaCarrito.appendChild(card);

    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${item.nombre}</td>
      <td>${item.cantidad}</td>
      <td>${formatearMoneda(item.precio)}</td>
      <td>${formatearMoneda(subtotal)}</td>
    `;
    detalleComprobante.appendChild(fila);
  });

  totalCarrito.textContent = formatearMoneda(total);
  totalComprobante.textContent = formatearMoneda(total);
  cantidadItems.textContent = `${totalItems} item${totalItems === 1 ? "" : "s"}`;
}

function vaciarCarrito() {
  carrito = [];
  guardarCarrito();
  renderCarrito();
}

function actualizarFecha() {
  const hoy = new Date();
  fechaComprobante.textContent = hoy.toLocaleDateString("es-PY");
}

function imprimirComprobante() {
  if (carrito.length === 0) {
    alert("Agregá al menos un producto antes de imprimir.");
    return;
  }

  const actual = Number(localStorage.getItem("numeroComprobanteTema4")) || 1;
  numeroComprobante.textContent = String(actual).padStart(5, "0");
  window.print();
  localStorage.setItem("numeroComprobanteTema4", actual + 1);
}

buscador.addEventListener("input", (e) => {
  renderProductos(e.target.value);
});

btnVaciar.addEventListener("click", vaciarCarrito);
btnImprimir.addEventListener("click", imprimirComprobante);

actualizarFecha();
generarNumeroComprobante();
renderProductos();
renderCarrito();
