let ctx;

function onInit() {
    const testImgs = getTestImgs();
    renderGallery(testImgs);
    initTextInputListener();
}
   

    

function initTextInputListener() {
    document.querySelector('input[name="txt-mem"]').addEventListener('input', function(event) {
        setLineTxt(event.target.value);
        renderMeme(getMeme());
    });
}

var canvas = document.querySelector('#my-canvas');
canvas.addEventListener('click', function(e) {
    var rect = canvas.getBoundingClientRect(); 
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;  
    console.log('Canvas X:', x, 'Canvas Y:', y);
});






document.addEventListener("DOMContentLoaded", function() {
    const menuToggle = document.getElementById('checkbox_toggle');
    const memesButton = document.getElementById('memesButton');
  
    memesButton.addEventListener('click', function() {
      
      if (menuToggle.checked) {
        menuToggle.checked = false;
      }
    });
  });
  