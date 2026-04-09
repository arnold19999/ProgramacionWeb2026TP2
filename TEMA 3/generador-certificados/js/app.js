const inputNombre = document.getElementById('inputNombre');
const inputCurso = document.getElementById('inputCurso');
const inputFecha = document.getElementById('inputFecha');
const nombre = document.getElementById('nombre');
const curso = document.getElementById('curso');
const fechaTexto = document.getElementById('fechaTexto');
const btnLimpiar = document.getElementById('btnLimpiar');
const btnImprimir = document.getElementById('btnImprimir');

function formatearFecha(valor) {
  if (!valor) {
    return 'dd/mm/aaaa';
  }

  const partes = valor.split('-');
  return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

inputNombre.addEventListener('input', () => {
  nombre.innerText = inputNombre.value.trim() || 'Nombre del participante';
});

inputCurso.addEventListener('input', () => {
  curso.innerText = inputCurso.value.trim() || 'Nombre del curso';
});

inputFecha.addEventListener('input', () => {
  fechaTexto.innerText = formatearFecha(inputFecha.value);
});

btnLimpiar.addEventListener('click', () => {
  inputNombre.value = '';
  inputCurso.value = '';
  inputFecha.value = '';

  nombre.innerText = 'Nombre del participante';
  curso.innerText = 'Nombre del curso';
  fechaTexto.innerText = 'dd/mm/aaaa';
});

btnImprimir.addEventListener('click', () => {
  if (inputNombre.value.trim() === '' || inputCurso.value.trim() === '' || inputFecha.value === '') {
    alert('Complete nombre, curso y fecha antes de imprimir.');
    return;
  }

  window.print();
});
