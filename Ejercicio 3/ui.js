console.log("UI: Interfaz de usuario cargada.");

function updateResult(message) {
    const resultElement = document.getElementById("result");
    resultElement.textContent = message;
}

function getInputValues() {
    const num1 = parseFloat(document.getElementById("num1").value);
    const num2 = parseFloat(document.getElementById("num2").value);
    const operation = document.getElementById("operation").value;
    return { num1, num2, operation };
}