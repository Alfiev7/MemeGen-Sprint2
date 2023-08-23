var gCanvas = document.querySelector('#my-canvas');
var gCtx = gCanvas.getContext('2d');

const DEFAULT_FONT_SIZE = 40;
let currentFontSize = DEFAULT_FONT_SIZE;

function renderMeme(meme) {
    let img = new Image();
    img.src = meme.selectedImgUrl;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        meme.lines.forEach(line => {
            drawText(line);
        });
        highlightSelectedLine();
    };
}


function drawText(line) {
    gCtx.fillStyle = line.color;
    gCtx.font = `${line.size}px Arial`;
    gCtx.fillText(line.text, line.x, line.y);
    gCtx.strokeText(line.text, line.x, line.y);
}



function handleTextInput(txt) {
    setLineTxt(txt);
    updateTextInputWithValueOfSelectedLine(); 
    renderMeme(getMeme());  
}


function downloadCanvas(elLink) {
    const data = gCanvas.toDataURL('image/jpeg');
    elLink.href = data;
    elLink.download = 'memegen.jpg';
}

function changeFontColor(color) {
    setLineColor(color);
    renderMeme(getMeme());
}

function changeFontSize(diff) {
    gMeme.lines[gMeme.selectedLineIdx].size += diff;
    renderMeme(getMeme());
}

function highlightSelectedLine() {
    const line = getSelectedLine();
    
    const textWidth = gCtx.measureText(line.text).width;
    const textHeight = 30; 
    const padding = 5; 

    gCtx.beginPath();
    gCtx.rect(
        line.x - padding,                
        line.y - textHeight - padding,  
        textWidth + 2 * padding,        
        textHeight + 2 * padding        
    );
 
    gCtx.strokeStyle = 'blue';
    gCtx.lineWidth = 1;
    gCtx.stroke();
    

    gCtx.strokeStyle = 'black';
}


function onSwitchLineClicked() {
    switchLine();
    updateTextInputWithValueOfSelectedLine();
    renderMeme(getMeme());
}

function updateTextInputWithValueOfSelectedLine() {
    const selectedLineText = getSelectedLine().text;
    document.querySelector('input[name="txt-mem"]').value = selectedLineText;
}
