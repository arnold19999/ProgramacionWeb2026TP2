const STORAGE_KEY = 'agenda_eventos_inteligente';

const formEvento = document.getElementById('formEvento');
const eventoId = document.getElementById('eventoId');
const titulo = document.getElementById('titulo');
const fecha = document.getElementById('fecha');
const descripcion = document.getElementById('descripcion');
const filtroDesde = document.getElementById('filtroDesde');
const filtroHasta = document.getElementById('filtroHasta');
const listaEventos = document.getElementById('listaEventos');
const sinEventos = document.getElementById('sinEventos');
const totalEventos = document.getElementById('totalEventos');
const eventosFiltrados = document.getElementById('eventosFiltrados');
const btnCancelar = document.getElementById('btnCancelar');
const btnFiltrar = document.getElementById('btnFiltrar');
const btnLimpiarFiltros = document.getElementById('btnLimpiarFiltros');
const btnPdf = document.getElementById('btnPdf');
const fechaAgendaPdf = document.getElementById('fechaAgendaPdf');
const listaPdf = document.getElementById('listaPdf');

let eventos = cargarEventos();
let eventosVisibles = [...eventos];

renderEventos();

formEvento.addEventListener('submit', guardarEvento);
btnCancelar.addEventListener('click', cancelarEdicion);
btnFiltrar.addEventListener('click', aplicarFiltros);
btnLimpiarFiltros.addEventListener('click', limpiarFiltros);
btnPdf.addEventListener('click', exportarAgendaPdf);

function cargarEventos() {
  const datos = localStorage.getItem(STORAGE_KEY);
  return datos ? JSON.parse(datos) : [];
}

function guardarEnStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(eventos));
}

function guardarEvento(e) {
  e.preventDefault();

  const tituloValor = titulo.value.trim();
  const fechaValor = fecha.value;
  const descripcionValor = descripcion.value.trim();

  if (!tituloValor || !fechaValor || !descripcionValor) {
    alert('Completá todos los campos del formulario.');
    return;
  }

  if (eventoId.value) {
    eventos = eventos.map((evento) => {
      if (evento.id === eventoId.value) {
        return {
          ...evento,
          titulo: tituloValor,
          fecha: fechaValor,
          descripcion: descripcionValor
        };
      }
      return evento;
    });
  } else {
    const nuevoEvento = {
      id: Date.now().toString(),
      titulo: tituloValor,
      fecha: fechaValor,
      descripcion: descripcionValor
    };

    eventos.push(nuevoEvento);
  }

  guardarEnStorage();
  formEvento.reset();
  eventoId.value = '';
  btnCancelar.classList.add('oculto');
  aplicarFiltros();
}

function renderEventos() {
  listaEventos.innerHTML = '';
  totalEventos.textContent = eventos.length;
  eventosFiltrados.textContent = eventosVisibles.length;

  if (eventosVisibles.length === 0) {
    sinEventos.classList.remove('oculto');
    return;
  }

  sinEventos.classList.add('oculto');

  eventosVisibles
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
    .forEach((evento) => {
      const tarjeta = document.createElement('article');
      tarjeta.className = 'evento';

      tarjeta.innerHTML = `
        <div class="evento-cabecera">
          <div>
            <h3 class="evento-titulo">${evento.titulo}</h3>
            <p class="evento-fecha">Fecha: ${formatearFecha(evento.fecha)}</p>
          </div>
        </div>
        <p class="evento-descripcion">${evento.descripcion}</p>
        <div class="evento-acciones">
          <button type="button" class="btn btn-principal" data-editar="${evento.id}">Editar</button>
          <button type="button" class="btn btn-eliminar" data-eliminar="${evento.id}">Eliminar</button>
        </div>
      `;

      listaEventos.appendChild(tarjeta);
    });

  asignarEventosBotones();
}

function asignarEventosBotones() {
  document.querySelectorAll('[data-editar]').forEach((boton) => {
    boton.addEventListener('click', () => editarEvento(boton.dataset.editar));
  });

  document.querySelectorAll('[data-eliminar]').forEach((boton) => {
    boton.addEventListener('click', () => eliminarEvento(boton.dataset.eliminar));
  });
}

function editarEvento(id) {
  const evento = eventos.find((item) => item.id === id);
  if (!evento) return;

  eventoId.value = evento.id;
  titulo.value = evento.titulo;
  fecha.value = evento.fecha;
  descripcion.value = evento.descripcion;
  btnCancelar.classList.remove('oculto');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function eliminarEvento(id) {
  const confirmar = confirm('¿Deseás eliminar este evento?');
  if (!confirmar) return;

  eventos = eventos.filter((evento) => evento.id !== id);
  guardarEnStorage();
  aplicarFiltros();
}

function cancelarEdicion() {
  formEvento.reset();
  eventoId.value = '';
  btnCancelar.classList.add('oculto');
}

function aplicarFiltros() {
  const desde = filtroDesde.value;
  const hasta = filtroHasta.value;

  if (desde && hasta && desde > hasta) {
    alert('La fecha desde no puede ser mayor que la fecha hasta.');
    return;
  }

  eventosVisibles = eventos.filter((evento) => {
    const cumpleDesde = !desde || evento.fecha >= desde;
    const cumpleHasta = !hasta || evento.fecha <= hasta;
    return cumpleDesde && cumpleHasta;
  });

  renderEventos();
}

function limpiarFiltros() {
  filtroDesde.value = '';
  filtroHasta.value = '';
  eventosVisibles = [...eventos];
  renderEventos();
}

function exportarAgendaPdf() {
  const desde = filtroDesde.value;
  const hasta = filtroHasta.value;

  let fechaObjetivo = '';

  if (desde && hasta) {
    if (desde !== hasta) {
      alert('Para exportar la agenda diaria, seleccioná la misma fecha en ambos filtros.');
      return;
    }
    fechaObjetivo = desde;
  } else if (desde && !hasta) {
    fechaObjetivo = desde;
  } else if (!desde && hasta) {
    fechaObjetivo = hasta;
  } else {
    alert('Seleccioná una fecha para exportar la agenda diaria en PDF.');
    return;
  }

  const eventosDelDia = eventos.filter((evento) => evento.fecha === fechaObjetivo);

  if (eventosDelDia.length === 0) {
    alert('No hay eventos cargados para la fecha seleccionada.');
    return;
  }

  fechaAgendaPdf.textContent = `Fecha: ${formatearFecha(fechaObjetivo)}`;
  listaPdf.innerHTML = '';

  eventosDelDia.forEach((evento) => {
    const item = document.createElement('div');
    item.className = 'item-pdf';
    item.innerHTML = `
      <h3>${evento.titulo}</h3>
      <p><strong>Fecha:</strong> ${formatearFecha(evento.fecha)}</p>
      <p><strong>Descripción:</strong> ${evento.descripcion}</p>
    `;
    listaPdf.appendChild(item);
  });

  window.print();
}

function formatearFecha(fechaTexto) {
  const [anio, mes, dia] = fechaTexto.split('-');
  return `${dia}/${mes}/${anio}`;
}
