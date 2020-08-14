/*
MIT License

Copyright (c) 2020 Anthony Beaumont

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

const helper = {
  addClass: function(name) {
    this.classList.add(name);
    return this;
  },
  removeClass: function(name) {
    this.classList.remove(name);
    return this;
  },
  toggleClass: function(name) {
    this.classList.toggle(name);
    return this;
  },
  css: function(name, value){
    this.style[name] = value;
    return this;
  },
  text: function(value){
    this.textContent = value;
    return this;
  },
  attr: function(name, value){
    this.setAttribute(name, value);
    return this;
  },
  empty: function(){
    while(this.firstChild) this.removeChild(this.firstChild);
    return this;
  },
  show: function(){
    this.style.display = ""; //restore to whatever it was initially
    if(getComputedStyle(this).display === "none") this.style.display = "block";
    return this;
  },
  hide: function(){
    this.style.display = "none";
    return this;
  },
  append: function(html){
    this.insertAdjacentHTML("beforeend", html);
    return this;
  },
  prepend: function(html){
    this.insertAdjacentHTML("afterbegin", html);
    return this;
  },
  click: function(callback){
    this.addEventListener('click', callback, false);
  },
  contextmenu: function(callback){
    this.addEventListener('contextmenu', callback, false);
  },
  select: function(el){
    let selector = this.querySelector(el);
    return Object.assign(selector, helper);
  },
  selectAll: function(el){
    let selector = [...this.querySelectorAll(el)];
    selector.forEach( el => Object.assign(el, helper));
    return selector;
  },
  parent: function(el = null){
    let selector = (el) ? this.closest(el) : this.parentNode;
    if (selector) Object.assign(selector, helper); //If not find don't attach helper
    return selector;
  },
  fadeOut: function(duration = 400) 
  {
   let el = this;
   
   return new Promise((resolve) =>{
   
     el.style["pointer-events"] = "none"; //disable event while animation
     el.style.opacity = 1;
     let previous = +new Date();
     (function fade() {
       el.style.opacity = +el.style.opacity - (new Date() - previous) / duration;
       previous = +new Date();
       if (+el.style.opacity <= 0) //anim end
       {
          el.style.display = "none";
          el.style.removeProperty("opacity");
          el.style["pointer-events"] = "";
          return resolve(el);
       }
       else if (+el.style.opacity > 0) requestAnimationFrame(fade)
     })();
      
    });
  },
  fadeIn: function(duration = 400) 
  {
    let el = this;
    
    return new Promise((resolve) =>{
    
      el.style["pointer-events"] = "none"; //disable event while animation
      el.style.opacity = 0;
      el.style.display = "";
      if(getComputedStyle(el).display === "none") el.style.display = "block";
      let previous = +new Date();
      (function fade() {
        el.style.opacity = +el.style.opacity + (new Date() - previous) / duration;
        previous = +new Date();
        if (+el.style.opacity >= 1) //anim end
        {
          el.style.removeProperty("opacity");
          el.style["pointer-events"] = "";
          return resolve(el);
        }
        else if (+el.style.opacity < 1) requestAnimationFrame(fade)
      })();
  
    });
  }
        
};

export function select(el) {
  let selector = document.querySelector(el);
  return Object.assign(selector, helper);
}

export function selectAll(el){
  let selector = [...document.querySelectorAll(el)];
  selector.forEach( el => Object.assign(el, helper));
  return selector;
}

export function DOMReady(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}