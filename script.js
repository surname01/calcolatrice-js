// Converte "3,5" -> 3.5, gestisce spazi/vuoti
function parseLocaleNumber(value) {
  const v = String(value).trim().replace(",", ".");
  return v === "" ? NaN : Number(v);
}

// Formattazione semplice (evita 0.30000000004)
function fmt(n) {
  // Limita a max 10 cifre decimali senza troncare inutilmente
  return Number.isFinite(n) ? Number.parseFloat(n.toFixed(10)).toString() : n;
}

const elN1 = document.getElementById("num1");
const elN2 = document.getElementById("num2");
const out  = document.getElementById("out");

// Click sui bottoni operazione
document.querySelectorAll("button[data-op]").forEach(btn => {
  btn.addEventListener("click", () => calcola(btn.dataset.op));
});

// Pulsante clear
document.getElementById("clear").addEventListener("click", () => {
  elN1.value = "";
  elN2.value = "";
  out.textContent = "";
  out.style.color = "";
  elN1.focus();
});

// Invio dalla tastiera esegue l'ultima operazione usata (default somma)
let lastOp = "add";
[elN1, elN2].forEach(inp => {
  inp.addEventListener("keydown", e => {
    if (e.key === "Enter") calcola(lastOp);
  });
});

function calcola(op) {
  const a = parseLocaleNumber(elN1.value);
  const b = parseLocaleNumber(elN2.value);

  if (Number.isNaN(a) || Number.isNaN(b)) {
    showError("Inserisci due numeri validi (usa . o , per i decimali).");
    return;
  }

  let res;
  switch (op) {
    case "add": res = a + b; break;
    case "sub": res = a - b; break;
    case "mul": res = a * b; break;
    case "div":
      if (b === 0) {
        showError("Divisione per zero non permessa.");
        return;
      }
      res = a / b;
      break;
    default:
      showError("Operazione sconosciuta.");
      return;
  }

  lastOp = op;
  out.textContent = `Risultato: ${fmt(res)}`;
  out.style.color = "green";
}

function showError(msg) {
  out.textContent = msg;
  out.style.color = "crimson";
}
