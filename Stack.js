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

export default Stack;