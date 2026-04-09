const alumnos = [
  { nombre: "Juan", nota: 7 },
  { nombre: "Ana", nota: 9 },
  { nombre: "Luis", nota: 6 },
  { nombre: "María", nota: 8 },
  { nombre: "Sofía", nota: 10 }
];

const listaAlumnos = document.getElementById("listaAlumnos");
const grafico = document.getElementById("grafico");
const promedioElemento = document.getElementById("promedio");
const mejorAlumnoElemento = document.getElementById("mejorAlumno");
const peorAlumnoElemento = document.getElementById("peorAlumno");
const btnImprimir = document.getElementById("btnImprimir");

function calcularPromedio() {
  const suma = alumnos.reduce((acumulador, alumno) => acumulador + alumno.nota, 0);
  return (suma / alumnos.length).toFixed(2);
}

function obtenerMejorAlumno() {
  return alumnos.reduce((mejor, alumno) => alumno.nota > mejor.nota ? alumno : mejor);
}

function obtenerPeorAlumno() {
  return alumnos.reduce((peor, alumno) => alumno.nota < peor.nota ? alumno : peor);
}

function renderizarLista() {
  listaAlumnos.innerHTML = "";

  alumnos.forEach((alumno) => {
    const item = document.createElement("div");
    item.className = "alumno-item";
    item.innerHTML = `
      <span>${alumno.nombre}</span>
      <span>Nota: ${alumno.nota}</span>
    `;
    listaAlumnos.appendChild(item);
  });
}

function renderizarGrafico() {
  grafico.innerHTML = "";

  alumnos.forEach((alumno) => {
    const columna = document.createElement("div");
    columna.className = "columna";

    const valor = document.createElement("div");
    valor.className = "valor-barra";
    valor.textContent = alumno.nota;

    const barra = document.createElement("div");
    barra.className = "barra";
    barra.style.height = `${alumno.nota * 25}px`;
    barra.title = `${alumno.nombre}: ${alumno.nota}`;

    const nombre = document.createElement("div");
    nombre.className = "nombre-barra";
    nombre.textContent = alumno.nombre;

    columna.appendChild(valor);
    columna.appendChild(barra);
    columna.appendChild(nombre);
    grafico.appendChild(columna);
  });
}

function mostrarResultados() {
  const promedio = calcularPromedio();
  const mejorAlumno = obtenerMejorAlumno();
  const peorAlumno = obtenerPeorAlumno();

  promedioElemento.textContent = promedio;
  mejorAlumnoElemento.textContent = `${mejorAlumno.nombre} (${mejorAlumno.nota})`;
  peorAlumnoElemento.textContent = `${peorAlumno.nombre} (${peorAlumno.nota})`;
}

btnImprimir.addEventListener("click", () => {
  window.print();
});

renderizarLista();
renderizarGrafico();
mostrarResultados();
