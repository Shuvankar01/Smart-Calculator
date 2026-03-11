let display = document.getElementById("display");
let history = document.getElementById("history");

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

if(event.key === "Enter"){
event.preventDefault();
calculate();
}

if(event.key === "Escape"){
clearDisplay();
}

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