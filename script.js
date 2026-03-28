let display = document.getElementById("display");
let memory = 0;

/* ================= BASIC FUNCTIONS ================= */

function append(value) {
    display.value += value;
}

function clearDisplay() {
    display.value = "";
}

function deleteLast() {
    display.value = display.value.slice(0, -1);
}

function calculate() {
    try {
        let result = eval(display.value);
        addHistory(display.value + " = " + result);
        display.value = result;
    } catch {
        display.value = "Error";
    }
}

/* ================= HISTORY (LOCAL STORAGE) ================= */

function addHistory(value) {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    history.push(value);
    localStorage.setItem("history", JSON.stringify(history));
    displayHistory();
}

function displayHistory() {
    let historyList = document.getElementById("history");
    historyList.innerHTML = "";

    let history = JSON.parse(localStorage.getItem("history")) || [];

    history.forEach(item => {
        let li = document.createElement("li");
        li.textContent = item;
        historyList.appendChild(li);
    });
}

function clearHistory() {
    localStorage.removeItem("history");
    displayHistory();
}

displayHistory();

/* ================= SCIENTIFIC ================= */

function sin() {
    let value = parseFloat(display.value);
    if (!isNaN(value)) display.value = Math.sin(value);
}

function cos() {
    let value = parseFloat(display.value);
    if (!isNaN(value)) display.value = Math.cos(value);
}

function tan() {
    let value = parseFloat(display.value);
    if (!isNaN(value)) display.value = Math.tan(value);
}

function sqrt() {
    let value = parseFloat(display.value);
    if (!isNaN(value)) display.value = Math.sqrt(value);
}

function square() {
    let value = parseFloat(display.value);
    if (!isNaN(value)) display.value = Math.pow(value, 2);
}

function log() {
    let value = parseFloat(display.value);
    if (!isNaN(value)) display.value = Math.log(value);
}

function toggleScientific() {
    let sci = document.getElementById("scientific");
    sci.style.display = (sci.style.display === "grid") ? "none" : "grid";
}

/* ================= MEMORY ================= */

function memoryClear() {
    memory = 0;
}

function memoryRecall() {
    display.value = memory;
}

function memoryAdd() {
    memory += Number(display.value);
}

function memorySubtract() {
    memory -= Number(display.value);
}

/* ================= UTILITIES ================= */

function copyResult() {
    navigator.clipboard.writeText(display.value);
    alert("Result copied!");
}

function downloadHistory() {
    let history = JSON.parse(localStorage.getItem("history")) || [];
    let text = history.join("\n");

    let blob = new Blob([text], { type: "text/plain" });
    let link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "calculator-history.txt";
    link.click();
}

function toggleTheme() {
    document.body.classList.toggle("light");
}

/* ================= KEYBOARD SUPPORT ================= */

document.addEventListener("keydown", function (event) {
    let key = event.key;

    if (!isNaN(key)) append(key);

    if (["+", "-", "*", "/", "%", "."].includes(key)) append(key);

    if (key === "Enter" || key === "=") {
        event.preventDefault();
        calculate();
    }

    if (key === "Backspace") deleteLast();

    if (key === "Escape") clearDisplay();

    // Button animation
    let buttons = document.querySelectorAll("button");
    buttons.forEach(btn => {
        if (btn.innerText === key) {
            btn.classList.add("active");
            setTimeout(() => btn.classList.remove("active"), 150);
        }
    });
});

/* ================= PWA (INSTALL APP) ================= */

if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
        .then(() => console.log("Service Worker Registered"));
}

let deferredPrompt;
const installBtn = document.getElementById("installBtn");

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBtn.style.display = "block";
});

installBtn.addEventListener("click", async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const result = await deferredPrompt.userChoice;

        if (result.outcome === "accepted") {
            console.log("App installed");
        } else {
            console.log("Install cancelled");
        }

        deferredPrompt = null;
        installBtn.style.display = "none";
    }
});

/* ================= VOICE INPUT ================= */

function aiProcess(input) {
    input = input.toLowerCase().trim();

    // Remove unnecessary words
    input = input
        .replace(/what is|calculate|please|can you|tell me|answer/g, "")
        .trim();

    // Number words → digits
    const numbers = {
        "zero": 0, "one": 1, "two": 2, "three": 3,
        "four": 4, "five": 5, "six": 6,
        "seven": 7, "eight": 8, "nine": 9, "ten": 10
    };

    input = input.split(" ").map(word => {
        return numbers[word] !== undefined ? numbers[word] : word;
    }).join(" ");

    // 🔥 Handle natural sentences

    // add 5 and 3 → 5 + 3
    input = input.replace(/add (\d+) and (\d+)/, "$1 + $2");

    // subtract 3 from 10 → 10 - 3
    input = input.replace(/subtract (\d+) from (\d+)/, "$2 - $1");

    // multiply 4 by 6 → 4 * 6
    input = input.replace(/multiply (\d+) by (\d+)/, "$1 * $2");

    // divide 10 by 2 → 10 / 2
    input = input.replace(/divide (\d+) by (\d+)/, "$1 / $2");

    // square of 5 → 5 * 5
    input = input.replace(/square of (\d+)/, "$1 * $1");

    // cube of 3 → 3 * 3 * 3
    input = input.replace(/cube of (\d+)/, "$1 * $1 * $1");

    // square root of 25 → Math.sqrt(25)
    input = input.replace(/square root of (\d+)/, "Math.sqrt($1)");

    // log of 10 → Math.log(10)
    input = input.replace(/log of (\d+)/, "Math.log($1)");

    // basic replacements (fallback)
    input = input
        .replace(/plus/g, "+")
        .replace(/minus/g, "-")
        .replace(/(times|into)/g, "*")
        .replace(/over/g, "/");

    return input;
}
function startVoice() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.start();

    recognition.onresult = function (event) {
        let speech = event.results[0][0].transcript;

        console.log("User:", speech);

        let processed = aiProcess(speech);

        console.log("Processed:", processed);

        try {
            let result = eval(processed);

            if (!isNaN(result)) {
                display.value = result;
                addHistory(processed + " = " + result);

                speechSynthesis.speak(new SpeechSynthesisUtterance(result));
            }
        } catch (err) {
            console.log("Error:", err);
            display.value = "❌ Try again";
        }
    };

    recognition.onerror = function () {
        display.value = "🎤 Voice error";
    };
}