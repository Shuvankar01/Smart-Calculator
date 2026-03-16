let display = document.getElementById("display");
let history = document.getElementById("history");
let memory = 0;
function append(value){

display.value += value;

}

function clearDisplay(){

display.value = "";

}

function deleteLast(){

display.value = display.value.slice(0,-1);

}

function calculate(){

try{

let result = eval(display.value);

addHistory(display.value + " = " + result);

display.value = result;

}catch{

display.value = "Error";

}

}

function addHistory(entry){

let li = document.createElement("li");

li.textContent = entry;

history.prepend(li);

}

function square(){

display.value = Math.pow(display.value,2);

}

function sqrt(){

display.value = Math.sqrt(display.value);

}

function log(){

display.value = Math.log(display.value);

}

function toggleTheme(){

document.body.classList.toggle("light");

}

document.addEventListener("keydown", function(event){

let key = event.key;
let display = document.getElementById("display");

/* Numbers */
if(!isNaN(key)){
append(key);
}

/* Operators */
if(["+","-","*","/","%","."].includes(key)){
append(key);
}

/* Enter or = */
if(key === "Enter" || key === "="){
event.preventDefault();
calculate();
}

/* Backspace */
if(key === "Backspace"){
deleteLast();
}

/* Escape clears display */
if(key === "Escape"){
clearDisplay();
}

/* Button highlight animation */

let buttons = document.querySelectorAll("button");

buttons.forEach(btn => {

if(btn.innerText === key){
btn.classList.add("active");

setTimeout(()=>{
btn.classList.remove("active");
},150);

}

});

});
function clearHistory(){

history.innerHTML = "";

}
function toggleScientific(){

let sci = document.getElementById("scientific");

if(sci.style.display === "grid"){
sci.style.display = "none";
}else{
sci.style.display = "grid";
}

}

function sin(){

let value = parseFloat(display.value);

if(!isNaN(value)){
display.value = Math.sin(value);
}

}

function cos(){

let value = parseFloat(display.value);

if(!isNaN(value)){
display.value = Math.cos(value);
}

}

function tan(){

let value = parseFloat(display.value);

if(!isNaN(value)){
display.value = Math.tan(value);
}

}

function sqrt(){

let value = parseFloat(display.value);

if(!isNaN(value)){
display.value = Math.sqrt(value);
}

}

function square(){

let value = parseFloat(display.value);

if(!isNaN(value)){
display.value = Math.pow(value,2);
}

}

function log(){

let value = parseFloat(display.value);

if(!isNaN(value)){
display.value = Math.log(value);
}

}
function memoryClear(){
memory = 0;
}

function memoryRecall(){
display.value = memory;
}

function memoryAdd(){
memory += Number(display.value);
}

function memorySubtract(){
memory -= Number(display.value);
}
function copyResult(){

navigator.clipboard.writeText(display.value);

alert("Result copied!");

}
function addHistory(value){

let history = JSON.parse(localStorage.getItem("history")) || [];

history.push(value);

localStorage.setItem("history",JSON.stringify(history));

displayHistory();

}
function displayHistory(){

let historyList = document.getElementById("history");

historyList.innerHTML="";

let history = JSON.parse(localStorage.getItem("history")) || [];

history.forEach(item=>{

let li=document.createElement("li");

li.textContent=item;

historyList.appendChild(li);

});

}

displayHistory();
function downloadHistory(){

let history = JSON.parse(localStorage.getItem("history")) || [];

let text = history.join("\n");

let blob = new Blob([text],{type:"text/plain"});

let link = document.createElement("a");

link.href = URL.createObjectURL(blob);

link.download = "calculator-history.txt";

link.click();

}