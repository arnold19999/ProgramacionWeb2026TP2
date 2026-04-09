const tablaProductos = document.querySelector('#tablaProductos');
const btnAgregar = document.querySelector('#btnAgregar');
const btnImprimir = document.querySelector('#btnImprimir');
const btnNuevaFactura = document.querySelector('#btnNuevaFactura');
const numeroFactura = document.querySelector('#numeroFactura');
const nombreCliente = document.querySelector('#nombreCliente');
const documentoCliente = document.querySelector('#documentoCliente');
const direccionCliente = document.querySelector('#direccionCliente');
const fechaFactura = document.querySelector('#fechaFactura');
const valorParcial = document.querySelector('#valorParcial');
const ivaGeneral = document.querySelector('#ivaGeneral');
const totalGeneral = document.querySelector('#totalGeneral');

function obtenerNumeroFactura() {
  let contador = parseInt(localStorage.getItem('contadorFactura'), 10);

  if (isNaN(contador) || contador < 1) {
    contador = 1;
    localStorage.setItem('contadorFactura', contador);
  }

  return `FAC-${String(contador).padStart(6, '0')}`;
}

function aumentarNumeroFactura() {
  let contador = parseInt(localStorage.getItem('contadorFactura'), 10);

  if (isNaN(contador) || contador < 1) {
    contador = 1;
  } else {
    contador += 1;
  }

  localStorage.setItem('contadorFactura', contador);
  numeroFactura.textContent = `FAC-${String(contador).padStart(6, '0')}`;
}

function colocarFechaActual() {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  fechaFactura.value = `${anio}-${mes}-${dia}`;
}

function formatearMoneda(valor) {
  return `Gs. ${Math.round(valor).toLocaleString('es-PY')}`;
}

function calcularIvaIncluido(totalDetalle) {
  return totalDetalle / 11;
}

function agregarFila() {
  const fila = document.createElement('tr');

  fila.innerHTML = `
    <td><input type="number" class="cantidad" min="1" step="1" placeholder="0"></td>
    <td><input type="text" class="descripcion" placeholder="Descripción del producto"></td>
    <td><input type="number" class="precio" min="0" step="0.01" placeholder="0"></td>
    <td class="subtotal-celda">Gs. 0</td>
    <td class="iva-celda">Gs. 0</td>
    <td class="no-print"><button type="button" class="btn-eliminar">Eliminar</button></td>
  `;

  tablaProductos.appendChild(fila);

  const descripcion = fila.querySelector('.descripcion');
  const cantidad = fila.querySelector('.cantidad');
  const precio = fila.querySelector('.precio');
  const btnEliminar = fila.querySelector('.btn-eliminar');

  descripcion.addEventListener('input', calcularTotales);
  cantidad.addEventListener('input', calcularTotales);
  precio.addEventListener('input', calcularTotales);

  btnEliminar.addEventListener('click', function () {
    fila.remove();
    calcularTotales();

    if (tablaProductos.children.length === 0) {
      agregarFila();
    }
  });
}

function calcularTotales() {
  const filas = document.querySelectorAll('#tablaProductos tr');
  let totalFactura = 0;
  let totalIva = 0;

  filas.forEach(function (fila) {
    const cantidad = parseFloat(fila.querySelector('.cantidad').value) || 0;
    const precio = parseFloat(fila.querySelector('.precio').value) || 0;
    const subtotalFila = cantidad * precio;
    const ivaFila = calcularIvaIncluido(subtotalFila);

    fila.querySelector('.subtotal-celda').textContent = formatearMoneda(subtotalFila);
    fila.querySelector('.iva-celda').textContent = formatearMoneda(ivaFila);

    totalFactura += subtotalFila;
    totalIva += ivaFila;
  });

  valorParcial.textContent = formatearMoneda(totalFactura);
  ivaGeneral.textContent = formatearMoneda(totalIva);
  totalGeneral.textContent = formatearMoneda(totalFactura);
}

function validarCampos() {
  if (nombreCliente.value.trim() === '') {
    alert('Debe ingresar el nombre del cliente.');
    nombreCliente.focus();
    return false;
  }

  if (documentoCliente.value.trim() === '') {
    alert('Debe ingresar el RUC o CI del cliente.');
    documentoCliente.focus();
    return false;
  }

  if (direccionCliente.value.trim() === '') {
    alert('Debe ingresar la dirección del cliente.');
    direccionCliente.focus();
    return false;
  }

  if (fechaFactura.value === '') {
    alert('Debe seleccionar la fecha.');
    fechaFactura.focus();
    return false;
  }

  const filas = document.querySelectorAll('#tablaProductos tr');

  if (filas.length === 0) {
    alert('Debe agregar al menos un producto.');
    return false;
  }

  for (let i = 0; i < filas.length; i += 1) {
    const descripcion = filas[i].querySelector('.descripcion').value.trim();
    const cantidad = parseFloat(filas[i].querySelector('.cantidad').value) || 0;
    const precio = parseFloat(filas[i].querySelector('.precio').value) || 0;

    if (descripcion === '') {
      alert('Complete la descripción de todos los productos.');
      return false;
    }

    if (cantidad <= 0) {
      alert('La cantidad debe ser mayor a cero.');
      return false;
    }

    if (precio <= 0) {
      alert('El precio debe ser mayor a cero.');
      return false;
    }
  }

  return true;
}

function nuevaFactura() {
  nombreCliente.value = '';
  documentoCliente.value = '';
  direccionCliente.value = '';
  colocarFechaActual();
  tablaProductos.innerHTML = '';
  agregarFila();
  calcularTotales();
  aumentarNumeroFactura();
}

btnAgregar.addEventListener('click', agregarFila);
btnNuevaFactura.addEventListener('click', nuevaFactura);
btnImprimir.addEventListener('click', function () {
  if (validarCampos()) {
    window.print();
  }
});

numeroFactura.textContent = obtenerNumeroFactura();
colocarFechaActual();
agregarFila();
calcularTotales();
