Like jQuery but with a Vanilla flavor.

Simple DOM manipulation and traversal in "Vanilla JS" with chaining.

Example
=======

```js
import { DOMReady, select, selectAll } from "./vanilla.js"

DOMReady(()=>{
  
  select("#div .child[data-attr='val']").css("background","red").text("Hello World");
  
  let el = select("#div);
  el.hide();
  el.css("background","blue").fadeIn(400).then((that) => that.css("background","green");
 
  selectAll(li)[0].text("0");
  selectAll(li).forEach(el => el.css("color","black");
  
  select("#div .child").css("background","red").select(".child").selectAll("p");
  
  ...
  
});

```

API
===

- DOMReady(callback)
- select(el)
- selectAll(el)

select/selectAll add the following helper fn to the returned obj:

- addClass(name)
- removeClass(name)
- toggleClass(name)
- css(name, value)
- text(value)
- attr(name, value)
- empty()
- show()
- hide()
- append(html)
- prepend(html)
- click(callback) [_no chain_]
- contextmenu(callback) [_no chain_]
- select(el)
- selectAll(el)
- parent(el = null)
- fadeOut(duration = 400) [_promise_]
- fadeIn(duration = 400) [_promise_]

Each return target obj so you can chain them.
