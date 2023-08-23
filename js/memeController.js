var gCanvas = document.querySelector('#my-canvas');
var gCtx = gCanvas.getContext('2d');


function renderMeme(meme) {

    let img = new Image();
    img.src = meme.selectedImgUrl;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        drawText(meme.text);
    };
}

function drawText(text) {
    gCtx.fillStyle = 'white';
    gCtx.strokeStyle = 'black';
    gCtx.font = '40px Arial';
    gCtx.fillText(text, gCanvas.width / 2, gCanvas.height / 2);
    gCtx.strokeText(text, gCanvas.width / 2, gCanvas.height / 2);
}

function handleTextInput(txt) {
    setLineTxt(txt);
    renderMeme();
}

function downloadCanvas(elLink) {
    const data = gCanvas.toDataURL('image/jpeg');
    elLink.href = data;
    elLink.download = 'memegen.jpg';
}
