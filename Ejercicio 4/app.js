const inputLimite  = document.getElementById("limite");
const botonGenerar = document.getElementById("generar");
const salida       = document.getElementById("salida");
const inputParrafo = document.getElementById("parrafo");
const inputPalabra = document.getElementById("palabra");

// --- Utilidad para crear workers ---
function crearWorker(fn) {
  const blob = new Blob(["onmessage = " + fn.toString()], { type: "application/javascript" });
  const url  = URL.createObjectURL(blob);
  return new Worker(url);
}

// --- Worker para pares ---
function workerPares(e) {
  const limite = Number(e.data) >>> 0;
  const batchSize = 10000;
  let buffer = [];
  for (let i = 1; i <= limite; i++) {
    buffer.push(i * 2);
    if (buffer.length >= batchSize) {
      postMessage({ type: "chunk", chunk: buffer.join(",") });
      buffer.length = 0;
    }
  }
  if (buffer.length) postMessage({ type: "chunk", chunk: buffer.join(",") });
  postMessage({ type: "done", label: "pares" });
}

// --- Worker para impares ---
function workerImpares(e) {
  const limite = Number(e.data) >>> 0;
  const batchSize = 10000;
  let buffer = [];
  for (let i = 0; i < limite; i++) {
    buffer.push(2 * i + 1);
    if (buffer.length >= batchSize) {
      postMessage({ type: "chunk", chunk: buffer.join(",") });
      buffer.length = 0;
    }
  }
  if (buffer.length) postMessage({ type: "chunk", chunk: buffer.join(",") });
  postMessage({ type: "done", label: "impares" });
}

// --- Worker para primeros n primos ---
function workerPrimos(e) {
  const cantidad = Number(e.data) >>> 0;
  const batchSize = 1000;
  let buffer = [];
  let primos = [];
  let num = 2;

  while (primos.length < cantidad) {
    let esPrimo = true;
    const raiz = Math.sqrt(num);
    for (let p of primos) {
      if (p > raiz) break;
      if (num % p === 0) { esPrimo = false; break; }
    }
    if (esPrimo) {
      primos.push(num);
      buffer.push(num);
      if (buffer.length >= batchSize) {
        postMessage({ type: "chunk", chunk: buffer.join(",") });
        buffer.length = 0;
      }
    }
    num++;
  }
  if (buffer.length) postMessage({ type: "chunk", chunk: buffer.join(",") });
  postMessage({ type: "done", label: "primos" });
}

// --- Funciones para búsqueda de palabra ---
function normalizar(s) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function busquedaBinaria(arr, objetivo) {
  let i = 0, j = arr.length - 1;
  while (i <= j) {
    const m = (i + j) >> 1;
    if (arr[m] === objetivo) return true;
    if (arr[m] < objetivo) i = m + 1;
    else j = m - 1;
  }
  return false;
}

// --- Evento del botón ---
botonGenerar.addEventListener("click", () => {
  salida.textContent = "Calculando... \n\n";

  const limite = parseInt(inputLimite.value, 10);
  if (!Number.isFinite(limite) || limite <= 0) {
    salida.textContent += "Introduce un límite válido (> 0).\n";
    return;
  }

  // Flags para impresión y finalización
  let imparesFirstChunk = true, paresFirstChunk = true, primosFirstChunk = true;
  let imparesHeaderShown = false, paresHeaderShown = false, primosHeaderShown = false;
  let imparesDone = false, paresDone = false, primosDone = false;

  const wImpares = crearWorker(workerImpares);
  const wPares   = crearWorker(workerPares);
  const wPrimos  = crearWorker(workerPrimos);

  function checkBusqueda() {
    if (imparesDone && paresDone && primosDone) {
      const texto   = normalizar(inputParrafo.value || "");
      const palabra = normalizar(inputPalabra.value || "");

      if (texto.length === 0 || palabra.length === 0) {
        salida.append("Ingresa un párrafo y una palabra para la búsqueda.\n");
      } else {
        const palabras = texto.split(/\W+/).filter(Boolean).sort();
        const existe = busquedaBinaria(palabras, palabra);
        salida.append(
          existe 
            ? `\nLa palabra "${inputPalabra.value}" SÍ existe en el párrafo.\n` 
            : `\nLa palabra "${inputPalabra.value}" NO existe en el párrafo.\n`
        );
      }
    }
  }

  // --- Worker impares ---
  wImpares.onmessage = ({ data }) => {
    if (data.type === "chunk") {
      if (!imparesHeaderShown) {
        salida.append("\n\nIMPARES:\n");
        imparesHeaderShown = true;
      }
      if (!imparesFirstChunk) salida.append(",");
      salida.append(data.chunk);
      imparesFirstChunk = false;
    } else if (data.type === "done") {
      salida.append("\n\n");
      imparesDone = true;
      wImpares.terminate();
      checkBusqueda();
    }
  };

  // --- Worker pares ---
  wPares.onmessage = ({ data }) => {
    if (data.type === "chunk") {
      if (!paresHeaderShown) {
        salida.append("\n\nPARES:\n");
        paresHeaderShown = true;
      }
      if (!paresFirstChunk) salida.append(",");
      salida.append(data.chunk);
      paresFirstChunk = false;
    } else if (data.type === "done") {
      salida.append("\n\n");
      paresDone = true;
      wPares.terminate();
      checkBusqueda();
    }
  };

  // --- Worker primos ---
  wPrimos.onmessage = ({ data }) => {
    if (data.type === "chunk") {
      if (!primosHeaderShown) {
        salida.append("\n\nPRIMOS:\n");
        primosHeaderShown = true;
      }
      if (!primosFirstChunk) salida.append(",");
      salida.append(data.chunk);
      primosFirstChunk = false;
    } else if (data.type === "done") {
      salida.append("\n\n");
      primosDone = true;
      wPrimos.terminate();
      checkBusqueda();
    }
  };

  // Iniciar generación
  wImpares.postMessage(limite);
  wPares.postMessage(limite);
  wPrimos.postMessage(limite);
});