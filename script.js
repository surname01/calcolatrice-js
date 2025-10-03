// -----------------------
// Stato dell'app
// -----------------------
let displayValue = "0";
let firstOperand = null;
let operator = null;                 // "add" | "sub" | "mul" | "div" | null
let waitingForSecondOperand = false;

// -----------------------
// Riferimenti DOM
// -----------------------
const display      = document.getElementById("display");     // <input readonly>
const digitButtons = document.querySelectorAll("button[data-digit]");
const dotButton    = document.querySelector("button[data-dot]");
const opButtons    = document.querySelectorAll("button[data-op]");
const equalsBtn    = document.getElementById("equals");
const clearBtn     = document.getElementById("clear");

// -----------------------
// Utilità
// -----------------------
function render() {
  display.value = displayValue;
}

// Formatta per evitare artefatti tipo 0.3000000004
function fmt(n) {
  if (!Number.isFinite(n)) return n;
  return Number.parseFloat(n.toFixed(10)).toString();
}

// Calcolo di base
function compute(a, b, op) {
  switch (op) {
    case "add": return a + b;
    case "sub": return a - b;
    case "mul": return a * b;
    case "div": return b === 0 ? NaN : a / b;
    default:    return NaN;
  }
}

// Converte stringa display -> numero (accetta anche virgola)
function toNumber(str) {
  const v = String(str).trim().replace(",", ".");
  return v === "" ? NaN : Number(v);
}

// -----------------------
// Cifre (0–9)
// -----------------------
digitButtons.forEach(button => {
  button.addEventListener("click", () => {
    const digit = button.dataset.digit;

    if (waitingForSecondOperand) {
      displayValue = digit;                 // inizio nuovo numero
      waitingForSecondOperand = false;
    } else {
      displayValue = (displayValue === "0") ? digit : displayValue + digit;
    }

    render();
  });
});

// -----------------------
// Punto decimale
// -----------------------
if (dotButton) {
  dotButton.addEventListener("click", () => {
    if (waitingForSecondOperand) {
      displayValue = "0.";
      waitingForSecondOperand = false;
      render();
      return;
    }
    if (!displayValue.includes(".")) {
      displayValue += ".";
      render();
    }
  });
}

// -----------------------
// Operazioni (+ − × ÷)
// -----------------------
opButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const nextOp = btn.dataset.op;
    const current = toNumber(displayValue);

    // Primo operatore: memorizza e attendi il secondo operando
    if (operator == null) {
      firstOperand = current;
      operator = nextOp;
      waitingForSecondOperand = true;
      return;
    }

    // Cambio operatore prima di digitare la 2ª cifra
    if (waitingForSecondOperand) {
      operator = nextOp;
      return;
    }

    // Catena: calcola parziale, mostra, prepara a nuova operazione
    const result = compute(firstOperand, current, operator);
    if (!Number.isFinite(result)) {
      displayValue = "Errore";
      render();
      firstOperand = null;
      operator = null;
      waitingForSecondOperand = false;
      return;
    }

    displayValue = fmt(result);
    render();

    firstOperand = result;
    operator = nextOp;
    waitingForSecondOperand = true;
  });
});

// -----------------------
// Uguale (=)
// -----------------------
if (equalsBtn) {
  equalsBtn.addEventListener("click", () => {
    if (operator == null) return;

    const second = toNumber(displayValue);
    const result = compute(firstOperand, second, operator);

    if (!Number.isFinite(result)) {
      displayValue = "Errore";
      render();
      firstOperand = firstOperand;
      operator = null;
      waitingForSecondOperand = true;
      return;
    }

    displayValue = fmt(result);
    render();

    // prepara per operazioni successive
    firstOperand = result;
    operator = null;
    waitingForSecondOperand = true;
  });
}

// -----------------------
// Clear (C)
// -----------------------
if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    displayValue = "0";
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    render();
  });
}

// Render iniziale
render();

// -----------------------
// (Facoltativo) Tastiera
// -----------------------
// Premi Enter = uguale, Backspace = cancella ultima cifra, . o , = punto.
// Aggiungi se ti serve:
/*
document.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && equalsBtn) {
    equalsBtn.click();
  } else if (e.key === "Backspace") {
    if (waitingForSecondOperand) return;
    displayValue = (displayValue.length > 1) ? displayValue.slice(0, -1) : "0";
    render();
  } else if (e.key === "." || e.key === ",") {
    dotButton?.click();
  } else if (/^\d$/.test(e.key)) {
    const btn = document.querySelector(`button[data-digit="${e.key}"]`);
    btn?.click();
  }
});
*/
