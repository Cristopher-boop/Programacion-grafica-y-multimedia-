console.log("Validator: Funciones de validación cargadas.");

function validateInputs(num1, num2) {
    if (isNaN(num1) || isNaN(num2)) {
        throw new Error("Por favor, ingresa números válidos.");
    }
}