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