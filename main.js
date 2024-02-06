// Evento "DOMContentLoaded" que se ejecuta cuando la página ha cargado completamente
document.addEventListener("DOMContentLoaded", function () {
  // Obtener referencias a elementos del DOM
  const recomendacionBtn = document.getElementById("recomendacionBtn");
  const listaBtn = document.getElementById("listaBtn");
  const listaGenero = document.getElementById("listaGenero");
  const tituloGenero = document.getElementById("tituloGenero");
  const tituloPrefieres = document.getElementById("tituloPrefieres");
  const outputDiv = document.getElementById("output");

  // Cargar la lista de películas desde el archivo JSON
  fetch("peliculas.json")
    .then((response) => response.json())
    .then((data) => {
      // Guardar la lista de películas en una variable global
      window.peliculas = data;

      // Evento al hacer clic en el botón "Recomendar película"
      recomendacionBtn.addEventListener("click", () => {
        ocultarRecomendacionButtons(); // Ocultar botones de recomendación y género
        mostrarRecomendacionGeneros(); // Mostrar botones específicos para recomendación;
        mostrarTituloGenero();
        ocultarTituloPrefieres();
        mostrarResultado(""); // Limpiar el resultado actual
      });
    });

  // Evento al hacer clic en el botón "Ver lista por género"
  listaBtn.addEventListener("click", () => {
    mostrarGeneroButtons();
    mostrarTituloGenero();
    ocultarTituloPrefieres();
    ocultarRecomendarBotones(); // Ocultar botones de recomendación y género
    mostrarListaGeneroButtons(); // Mostrar botones de género
    mostrarResultado(""); // Limpiar el resultado actual
  });
});

// Clics en botones de género para la lista por género
listaGenero.addEventListener("click", (event) => {
  if (event.target.classList.contains("generoBtn")) {
    const generoSeleccionado = Number(event.target.getAttribute("data-genero"));
    mostrarListaPorGenero(generoSeleccionado);
  }
});

// Clics en botones de género específicos para la recomendación de película
recomendacionGeneros.addEventListener("click", (event) => {
  if (event.target.classList.contains("recomendacion")) {
    const generoSeleccionado = Number(event.target.getAttribute("data-genero"));
    recomendarPelicula(generoSeleccionado);
  }
});

// Función para mostrar los botones específicos para recomendación de película
function mostrarRecomendacionGeneros() {
  const recomendacionGeneros = document.getElementById("recomendacionGeneros");
  recomendacionGeneros.style.display = "block";
}
///////////////////////////

// Variable para indicar si se ha obtenido una recomendación
let recomendacionObtenida = false;

// Función para recomendar una película según el género seleccionado
function recomendarPelicula(generoSeleccionado) {
  const recomendacion = obtenerRecomendacion(generoSeleccionado);

  if (recomendacion) {
    recomendacionObtenida = true;
    mostrarResultado("Te recomendaría ver: " + recomendacion);
    // Guardar la película recomendada en localStorage
    localStorage.setItem("peliculaRecomendada", recomendacion);
    // Agregar el botón de Compartir por WhatsApp
    agregarBotonCompartirWhatsApp(recomendacion);
  } else {
    mostrarResultado(
      "Lo siento, no puedo recomendar una película para ese tipo."
    );
  }
}

// Función para agregar el botón "Ver Trailer"
function agregarBotonVerTrailer() {
  if (recomendacionObtenida) {
    const outputDiv = document.getElementById("output");

    // Crear el botón "Ver Trailer"
    const verTrailerBtn = document.createElement("button");
    verTrailerBtn.id = "verTrailerBtn";
    verTrailerBtn.textContent = "Ver Trailer";
    verTrailerBtn.style.display = "inline-block";
    verTrailerBtn.classList.add("ver-trailer-button");

    // Agregar un evento al botón para manejar la acción de ver el trailer
    verTrailerBtn.addEventListener("click", verTrailer);

    // Agregar el botón al contenedor
    outputDiv.appendChild(verTrailerBtn);
  }
}

// Función para ver el trailer de la película recomendada
function verTrailer() {
  // Obtener el enlace del trailer de la película recomendada.
  const peliculaRecomendada = localStorage.getItem("peliculaRecomendada");
  const busquedaEnlace = obtenerEnlaceBusqueda(peliculaRecomendada);

  if (busquedaEnlace) {
    // Abrir una nueva ventana con la búsqueda de YouTube
    window.open(busquedaEnlace, "_blank");
  } else {
    alert(
      "Lo siento, no se pudo encontrar un enlace de búsqueda para esta película."
    );
  }
}

/// Función para obtener el enlace de búsqueda de YouTube para la película
function obtenerEnlaceBusqueda(pelicula) {
  const busqueda = encodeURIComponent(`${pelicula} trailer`);
  return `https://www.youtube.com/results?search_query=${busqueda}`;
}

// Función para agregar un botón de Compartir por WhatsApp
function agregarBotonCompartirWhatsApp(pelicula) {
  const outputDiv = document.getElementById("output");

  // Crear elementos para el formulario de ingreso de número
  const formulario = document.createElement("form");
  const inputNumero = document.createElement("input");
  const botonCompartirWhatsApp = document.createElement("button");

  // Configurar el formulario
  formulario.addEventListener("submit", function (event) {
    event.preventDefault();
    compartirPorWhatsApp(pelicula, inputNumero.value);
  });

  // Configurar el input de número
  inputNumero.type = "tel";
  inputNumero.placeholder = "Ingrese el número de Cel.";
  inputNumero.required = true;

  // Configurar el botón de Compartir por WhatsApp
  botonCompartirWhatsApp.type = "submit";
  botonCompartirWhatsApp.textContent = "Compartir por WhatsApp";
  botonCompartirWhatsApp.classList.add("whatsapp-button");

  // Agregar elementos al formulario
  formulario.appendChild(inputNumero);
  formulario.appendChild(botonCompartirWhatsApp);
  outputDiv.appendChild(formulario);
}

// Función para compartir por WhatsApp
function compartirPorWhatsApp(pelicula, numeroTelefono) {
  // Limpiar el número de teléfono
  const numeroLimpio = limpiarNumeroTelefono(numeroTelefono);

  if (numeroLimpio) {
    // Mensaje con la recomendación
    const mensaje = "¡Te recomendaron la película: " + pelicula + "!";

    // Crear el enlace con el protocolo de WhatsApp
    const enlaceWhatsApp =
      "https://wa.me/" + numeroLimpio + "?text=" + encodeURIComponent(mensaje);

    // Abrir una nueva ventana de WhatsApp
    window.open(enlaceWhatsApp);
  } else {
    alert(
      "Por favor, ingresa un número de teléfono válido para compartir por WhatsApp."
    );
  }

  // Función para limpiar el número de teléfono de espacios y caracteres no deseados
  function limpiarNumeroTelefono(numeroTelefono) {
    // Eliminar espacios y caracteres no deseados (dejar solo dígitos y el signo + al principio)
    return numeroTelefono.replace(/[^\d+]/g, "");
  }
}

// Función para mostrar la lista de películas por género
function mostrarListaPorGenero(generoSeleccionado) {
  const peliculasFiltradas = peliculas.filter(
    (pelicula) => pelicula.id === generoSeleccionado
  );

  if (peliculasFiltradas.length > 0) {
    const listaPeliculas = peliculasFiltradas.map(
      (pelicula) => pelicula.titulo
    );
    const listaHTML =
      "<ul><li>" + listaPeliculas.join("</li><li>") + "</li></ul>";
    mostrarResultado("Lista de películas:\n" + listaHTML);
    // Guardar la lista de películas en localStorage
    localStorage.setItem(
      "listaPeliculasPorGenero",
      JSON.stringify(peliculasFiltradas)
    );
  } else {
    mostrarResultado("No hay películas disponibles para ese género.");
  }
}

// Función para mostrar el resultado en el área correspondiente
function mostrarResultado(mensaje) {
  const outputDiv = document.getElementById("output");
  outputDiv.innerHTML = `<p>${mensaje}</p>`;
  // agregar el botón "Ver Trailer"
  agregarBotonVerTrailer();
}

// Función para obtener una recomendación según el género
function obtenerRecomendacion(generoPelicula) {
  const pelicula = peliculas.find((pelicula) => pelicula.id === generoPelicula);

  if (pelicula) {
    return pelicula.titulo;
  } else {
    return null;
  }
}
// Función para mostrar los botones de género
function mostrarGeneroButtons() {
  const listaGenero = document.getElementById("listaGenero");
  listaGenero.style.display = "block";
}
// Función para mostrar el título de género
function mostrarTituloGenero() {
  const tituloGenero = document.getElementById("tituloGenero");
  tituloGenero.style.display = "block";
}
// Función para ocultar el título de "¿Qué prefieres?"
function ocultarTituloPrefieres() {
  const tituloPrefieres = document.getElementById("tituloPrefieres");
  tituloPrefieres.style.display = "none";
}
// Función para ocultar los botones de recomendación y género
function ocultarRecomendarBotones() {
  const recomendacionBtn = document.getElementById("recomendacionBtn");
  const listaBtn = document.getElementById("listaBtn");

  recomendacionBtn.style.display = "none";
  listaBtn.style.display = "none";
}
// Función para mostrar los botones de género en la lista
function mostrarListaGeneroButtons() {
  const listaGenero = document.getElementById("listaGenero");
  const generoBtns = listaGenero.querySelectorAll(".generoBtn");

  generoBtns.forEach((btn) => {
    btn.style.display = "inline-block";
  });
}
// Función para ocultar los botones de recomendación y género
function ocultarRecomendacionButtons() {
  const recomendacionBtn = document.getElementById("recomendacionBtn");
  const listaBtn = document.getElementById("listaBtn");

  recomendacionBtn.style.display = "none";
  listaBtn.style.display = "none";
}
