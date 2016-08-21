document.body.onload = addElement;

var frames = [
  "http://kitties.neocities.org/4x4.html",
  "http://kitties.neocities.org/icecream.html"
]

function addElement () { 
  var newDiv = document.createElement("div"); 
  var iframe = document.createElement("iframe"); 
  var i = 0
  setInterval(function(){
    var frame = frames[i++%frames.length]
    iframe.src = frame.toString()  
  }, 2000)
  iframe.style=
    "border: 0; position:absolute; top:0; left:0; right:0; bottom:0; width:100%; height:100%"
  newDiv.appendChild(iframe); 
  document.body.appendChild(newDiv); 
}
