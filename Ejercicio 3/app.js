console.log("App: Script principal cargado.");

document.getElementById("calculate").addEventListener("click", () => {
    try {
        const { num1, num2, operation } = getInputValues();
        validateInputs(num1, num2);

        let result;
        switch (operation) {
            case "add":
                result = add(num1, num2);
                break;
            case "subtract":
                result = subtract(num1, num2);
                break;
            case "multiply":
                result = multiply(num1, num2);
                break;
            case "divide":
                result = divide(num1, num2);
                break;
            default:
                throw new Error("Operación no válida.");
        }

        updateResult(`Resultado: ${result}`);
    } catch (error) {
        updateResult(`Error: ${error.message}`);
    }
});