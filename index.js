class Stack {
    constructor() {
      this.items = [];
    }
  
    push(element) {
      this.items.push(element);
    }
  
    pop() {
      if (this.items.length === 0) {
        return "No tiene elementos";
      }
      return this.items.pop();
    }
  
    printStack() {
      let str = "";
      for (let i = 0; i < this.items.length; i++) {
        str += this.items[i] + " ";
      }
      return str;
    }
  
    get() {
      return this.items.slice().reverse();
    }
  
    clear() {
      this.items = [];
    }
}

const btn = document.getElementById('btn');
const stack = new Stack();
const rules = new Map();
let arr = [];
const FFP = "++)[contenido]";
const FFL = "--)[contenido]"

rules.set("V", {IV: "IV",VA: "VA"});
rules.set("IV", {L: "L",ML: "ML"});
rules.set("L", /[a-z]/);
rules.set("ML", {L: "L",ML: "ML"});
rules.set("VA", {SI: "SI",VAL: "VAL"});
rules.set("SI", "=");
rules.set("VAL",{IS: "IS",RS: "RS",BOOL: /(true|false)$/,N: "N",MN: "MN"});
rules.set("IS", "*");
rules.set("RS", {L: "L",RS: "RS",N: "N",LAST: "*"});
rules.set("N", /[0-9]/);
rules.set("MN", {N: "N",MN: "MN",P: "P",RN: "RN"});
rules.set("P", ".");
rules.set("RN", {N: "N",RN: "RN"});

rules.set("IF", {IIF: "IIF", RIF:"RIF"});
rules.set("IIF", {DF: "DF", COND: "COND"});
rules.set("DF", /¡Si{[0-9]/);
rules.set("COND", {N: "N", COND: "COND", OPE: "OPE", RCOND: "RCOND"});
rules.set("OPE", /^(>|<|==)$/);
rules.set("RCOND", {N: "N", RCON: "RCOND"});
rules.set("RIF", "}![contenido]");

rules.set("FOR", {IF: "IF", RF: "RF"});
rules.set("IF", /F\([a-z]$/);
rules.set("RF", {L: "L", RF: "RF", INF: "INF", RINF: "RINF"});
rules.set("INF", /:[0-9]/);
rules.set("RINF", {N:"N", RINF:"RINF", SINF:"SINF", RSINF: "RSINF"});
rules.set("SINF", /,[a-z]/);
rules.set("RSINF", {L:"L", RSINF:"RSINF", OPEF:"OPEF", MNF: "MNF"});
rules.set("MNF", {N:"N", MNF:"MNF", SINF:"SINF", RNSF:"RNSF"});
rules.set("OPEF", /^(>|<)[0-9]$/);
rules.set("RNSF", {N:"N", RNSF:"RNSF", SINF:"SINF", AUF:"AUF"});
rules.set("AUF", {L:"L", AUF:"AUF", LAST:/(\+\+|--)\)\[.*\]/});

rules.set("FN", {INITF: "INITF", RFN:"RFN"});
rules.set("INITF", /fun [a-z]/);
rules.set("RFN", {L:"L", RFN:"RFN", FINAL:"()[contenidoreturn]"})

function validate(){
    stack.clear()
    arr = [];
    for(const element of document.getElementById('str').value){
        arr.push(element);
    }
    switch(document.getElementById('type').value){
        case "Variable":
            validateVariables();
            break;
        case "If":
            validateIf();
            break;
        case "For":
            validateFor();
            break;
        case "Funcion":
            validateFn();
            break;
        default:
            alert("Selecciona una de las 4 opciones");
            break;
    }
    drawStack();
}


function validateVariables(){
    stack.push("V");
    let rule = rules.get(stack.pop());
    stack.push(rule.VA);
    stack.push(rule.IV);
    rule = rules.get(stack.pop());
    stack.push(rule.ML);
    stack.push(rule.L);
    allLetter();
    stack.pop();
    rule = rules.get(stack.pop());
    stack.push(rule.VAL);
    stack.push(rule.SI);
    rule = rules.get(stack.pop());
    let aux = arr.shift();
    if(aux != rule){
        stack.push(rule);
        arr.unshift(aux);
        return;
    }
    aux = arr.shift();
    let cond;
    if(aux == "*"){
        do{
            aux = arr.shift();
            try{
                if(/^[0-9a-z]/.test(aux)){
                    cond = true;
                }else{
                    if(aux != undefined){
                        arr.unshift(aux)
                    }
                    cond = false;
                }
            }catch{
                cond = false;
                arr.unshift(aux)
            }
        }while(cond);
        stack.pop();
        stack.push("RS")
        rule = rules.get(stack.pop());
        stack.push(rule.LAST)
        rule = stack.pop();
        aux = arr.shift();
        if(aux != rule){
            arr.unshift(aux);
            stack.push(rule)
            return;
        }
        if(arr.length > 0){
            stack.push(rule);
            return;
        }
    }else if(/[0-9]/.test(aux)){
        allNumbers();
        if(arr.length == 0){
            stack.pop();
            return;
        }
        aux = arr.shift();
        rule = rules.get(stack.pop());
        stack.push(rule.RN);
        stack.push(rule.P);
        rule = rules.get(stack.pop());
        if(aux != rule){
            arr.unshift(aux);
            stack.push(rule)
            return;
        }
        allNumbers();
        if(arr.length == 0){
            stack.clear();
        }
    }else{
        for(const element of arr){
            aux += element;
        }
        arr = [];
        rule = rules.get(stack.pop());
        stack.push(rule.BOOL);
        rule = stack.pop();
        if(!rule.test(aux)){
            arr.unshift(aux);
            stack.push(rule);
        }
    }
}

function validateIf(){
    stack.push("IF");
    let rule = rules.get(stack.pop());
    stack.push(rule.RIF);
    stack.push(rule.IIF);
    rule = rules.get(stack.pop());
    stack.push(rule.COND);
    stack.push(rule.DF);
    rule = rules.get(stack.pop());
    let aux = arr.shift();
    aux += arr.shift();
    aux += arr.shift();
    aux += arr.shift();
    aux += arr.shift();
    if(!rule.test(aux)){
        stack.push(rule);
        arr.unshift(aux);
        return;
    }
    allNumbers();
    rule = rules.get(stack.pop());
    stack.push(rule.RCOND);
    rule = rules.get("OPE");
    aux = arr.shift();
    console.log(rule.test(">="));
    if(!rule.test(aux)){
        aux += arr.shift();
        if(!rule.test(aux)){
            stack.push(rule);
            arr.unshift(aux);
            return;
        }
    }
    allNumbers();
    aux = "";
    for(const element of arr){
        aux += element;
    }
    aux = aux.replace(/[\r\n]+/gm, "");
    rule = rules.get(stack.pop())
    if(aux != rule){
        arr.unshift(aux);
        stack.push(rule);
        return;
    }
}

function validateFor(){
    stack.push("FOR");
    let rule = rules.get(stack.pop());
    let aux = arr.shift();
    aux += arr.shift();
    aux += arr.shift();
    stack.push(rule.RF);
    stack.push(rule.IF);
    rule = rules.get(stack.pop());
    if(!rule.test(aux)){
        arr.unshift(aux);
        stack.push(rule);
        return;
    }
    rule = rules.get(stack.pop());
    stack.push(rule.RF);
    stack.push(rule.L)
    allLetter();
    rule = rules.get(stack.pop());
    stack.push(rule.RINF);
    stack.push(rule.INF)
    rule = rules.get(stack.pop());
    aux = arr.shift();
    aux += arr.shift();
    if(!rule.test(aux)){
        stack.push(rule);
        arr.unshift(aux);
        return;
    }
    allNumbers();
    rule = rules.get(stack.pop());
    stack.push(rule.RSINF);
    stack.push(rule.SINF);
    rule = rules.get(stack.pop());
    aux = arr.shift();
    aux += arr.shift();
    if(!rule.test(aux)){
        stack.push(rule);
        arr.unshift(aux);
        return;
    }
    rule = rules.get(stack.pop());
    stack.push(rule.RSINF);
    stack.push(rule.L);
    allLetter();
    rule = rules.get(stack.pop());
    stack.push(rule.MNF);
    stack.push(rule.OPEF);
    rule = rules.get(stack.pop());
    aux = arr.shift();
    aux += arr.shift();
    if(!rule.test(aux)){
        arr.unshift(aux);
        stack.push(rule);
        return;
    }
    allNumbers();
    rule = rules.get(stack.pop());
    stack.push("AUF");
    stack.push(rule.SINF);
    rule = rules.get(stack.pop());
    aux = arr.shift();
    aux += arr.shift();
    if(!rule.test(aux)){
        arr.unshift(aux);
        stack.push(rule);
        return;
    }
    rule = rules.get(stack.pop());
    stack.push(rule.AUF);
    stack.push(rule.L);
    allLetter();
    aux = "";
    for(const element of arr){
        aux += element;
    }
    aux = aux.replace(/[\r\n]+/gm, "");
    rule = rules.get(stack.pop());
    if(aux == FFP || aux == FFL){
        arr = [];
        return;
    }
    stack.push(rule.LAST);
}

function validateFn(){
    stack.push("FN");
    let aux = arr.shift();
    aux += arr.shift();
    aux += arr.shift();
    aux += arr.shift();
    aux += arr.shift();
    let rule = rules.get(stack.pop());
    stack.push(rule.RFN);
    stack.push(rule.INITF);
    rule = rules.get(stack.pop());
    if(!rule.test(aux)){
        arr.unshift(aux);
        stack.push(rule);
        return;
    }
    rule = rules.get(stack.pop());
    stack.push(rule.RFN);
    stack.push(rule.L);
    allLetter();
    rule = rules.get(stack.pop());
    stack.push(rule.FINAL);
    rule = stack.pop();
    aux = "";
    for(const element of arr){
        aux += element;
    }
    aux = aux.replace(/\s+/g, '');
    if(rule == aux){
        arr = [];
        return;
    }
    stack.push(rule);
}

function allLetter(){
    let rule = rules.get(stack.pop());
    let repit;
    let aux;
    do{
        aux = arr.shift();
        try{
            if(rule.test(aux)){
                repit = true;
            }else{
                arr.unshift(aux);
                repit = false;
            }
        }catch{
            repit = false;
            arr.unshift(aux)
        }
    }while(repit);
}

function allNumbers(){
    let rule = rules.get(stack.pop());
    if(rule.MN != undefined){
        stack.push(rule.MN);
    }else if(rule.RN != undefined){
        stack.push(rule.RN);
    }else if(rule.COND != undefined){
        stack.push(rule.COND);
    }else if(rule.RINF != undefined){
        stack.push(rule.RINF);
    }else if(rule.MNF != undefined){
        stack.push(rule.MNF);
    }
    stack.push(rule.N);
    rule = rules.get(stack.pop());
    let repit;
    let aux;
    do{
        aux = arr.shift();
        try{
            if(rule.test(aux)){
                repit = true;
            }else{
                if(aux != undefined){
                    arr.unshift(aux)
                }
                repit = false;
            }
        }catch{
            repit = false;
            arr.unshift(aux)
        }
    }while(repit);
}

function drawStack() {
    const div = document.getElementById("pila");
    div.innerHTML = "";
    for (const element of stack.get()) {
      const p = document.createElement("p");
      p.textContent = element;
      div.appendChild(p);
    }
  }

btn.addEventListener('click', validate);