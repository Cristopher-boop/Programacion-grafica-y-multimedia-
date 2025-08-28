console.log("Calculator: Funciones de cálculo cargadas.");

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) throw new Error("No se puede dividir por cero.");
    return a / b;
}