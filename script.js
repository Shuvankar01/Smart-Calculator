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

function startVoice() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = function (event) {
        let speech = event.results[0][0].transcript.toLowerCase();

        const numbers = {
            "zero": 0, "one": 1, "two": 2, "three": 3,
            "four": 4, "five": 5, "six": 6,
            "seven": 7, "eight": 8, "nine": 9, "ten": 10
        };

        speech = speech.split(" ").map(word => {
            return numbers[word] !== undefined ? numbers[word] : word;
        }).join("");

        speech = speech
            .replace(/plus/g, "+")
            .replace(/minus/g, "-")
            .replace(/(into|multiply|times)/g, "*")
            .replace(/(divide|dividedby|over)/g, "/");

        try {
            let result = eval(speech);
            display.value = result;
            addHistory(speech + " = " + result);
        } catch {
            alert("Speak like: 5 plus 3");
        }
    };

    recognition.onerror = function () {
        alert("Voice recognition error");
    };
}