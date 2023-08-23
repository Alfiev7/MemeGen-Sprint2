var gCanvas = document.querySelector('#my-canvas');
var gCtx = gCanvas.getContext('2d');
let gDraggingLineIdx = null;

const DEFAULT_FONT_SIZE = 40;
let currentFontSize = DEFAULT_FONT_SIZE;

function renderMeme(meme, includeHighlight = true) {
    let img = new Image();
    img.src = meme.selectedImgUrl;
    img.onload = () => {
        gCtx.drawImage(img, 0, 0, gCanvas.width, gCanvas.height);
        meme.lines.forEach(line => {
            drawText(line);
        });
        if (includeHighlight) {
            highlightSelectedLine();
        }
    };
}

function drawText(line) {
    gCtx.fillStyle = line.color;
    gCtx.font = `${line.size}px ${line.font}`;

    let x = line.x;
    if (line.align === 'center') {
        x = gCanvas.width / 2 - gCtx.measureText(line.text).width / 2;
    } else if (line.align === 'right') {
        x = gCanvas.width - gCtx.measureText(line.text).width;
    }

    gCtx.fillText(line.text, x, line.y);
    gCtx.strokeText(line.text, x, line.y);

    const textWidth = gCtx.measureText(line.text).width;
    const textHeight = line.size;
    line.boundingBox = {
        x: x,
        y: line.y - textHeight,
        width: textWidth,
        height: textHeight
    };
}

function handleTextInput(txt) {
    setLineTxt(txt);
    updateTextInputWithValueOfSelectedLine();
    renderMeme(getMeme());
}

let isDownloading = false;

function downloadCanvas(event, elLink) {
    if (isDownloading) return;

    isDownloading = true;
    renderMeme(getMeme(), false);

    elLink.click();
    setTimeout(() => {
        const data = gCanvas.toDataURL('image/jpeg');
        elLink.href = data;
        elLink.download = 'memegen.jpg';

        renderMeme(getMeme(), true);

        isDownloading = false;

    }, 200);
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

    let x = line.x;
    if (line.align === 'center') {
        x = gCanvas.width / 2 - textWidth / 2;
    } else if (line.align === 'right') {
        x = gCanvas.width - textWidth;
    }

    gCtx.beginPath();
    gCtx.rect(
        x - padding,
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

function handleCanvasMouseDown(event) {
    const rect = gCanvas.getBoundingClientRect();
    const scaleX = gCanvas.width / rect.width;
    const scaleY = gCanvas.height / rect.height;

    const clickX = event.offsetX * scaleX;
    const clickY = event.offsetY * scaleY;

    for (let i = 0; i < gMeme.lines.length; i++) {
        const line = gMeme.lines[i];
        if (clickX >= line.boundingBox.x &&
            clickX <= line.boundingBox.x + line.boundingBox.width &&
            clickY >= line.boundingBox.y &&
            clickY <= line.boundingBox.y + line.boundingBox.height) {

            gMeme.selectedLineIdx = i;
            gDraggingLineIdx = i;
            updateEditorForSelectedLine();
            renderMeme(getMeme());

            
            document.addEventListener('mousemove', handleCanvasMove);
            document.addEventListener('mouseup', handleCanvasRelease);
            break;
        }
    }
}


function updateEditorForSelectedLine() {
    const line = getSelectedLine();
    const textInput = document.querySelector('input[name="txt-mem"]');
    textInput.value = line.text;
}

function alignText(alignment) {
    setTextAlignment(alignment);
    renderMeme(getMeme());
}

function changeFontFamily(fontFamily) {
    setFontFamily(fontFamily);
    renderMeme(getMeme());
}

function onDeleteLineClicked() {
    deleteLine();
    renderMeme(getMeme());
}

function handleCanvasMove(event) {
    if (gDraggingLineIdx === null) return;

    const rect = gCanvas.getBoundingClientRect();
    const scaleX = gCanvas.width / rect.width;
    const scaleY = gCanvas.height / rect.height;

    const moveX = event.offsetX * scaleX;
    const moveY = event.offsetY * scaleY;

    const line = gMeme.lines[gDraggingLineIdx];
    line.prevAlign = line.align;  
    line.align = 'left';  
    line.x = moveX;
    line.y = moveY;

    renderMeme(getMeme());
}

function handleCanvasRelease(event) {
    document.removeEventListener('mousemove', handleCanvasMove);
    document.removeEventListener('mouseup', handleCanvasRelease);

    const line = gMeme.lines[gDraggingLineIdx];
    if (line && line.prevAlign) {
        line.align = line.prevAlign;  
        delete line.prevAlign;  
    }

    gDraggingLineIdx = null;
}

gCanvas.addEventListener('touchstart', handleCanvasTouchStart);
gCanvas.addEventListener('touchmove', handleCanvasTouchMove);
gCanvas.addEventListener('touchend', handleCanvasTouchEnd);
gCanvas.addEventListener('mousedown', handleCanvasMouseDown);

function handleCanvasTouchStart(event) {
    const rect = gCanvas.getBoundingClientRect();
    const touch = event.touches[0];

    const touchX = touch.clientX - rect.left;
    const touchY = touch.clientY - rect.top;

    for (let i = 0; i < gMeme.lines.length; i++) {
        const line = gMeme.lines[i];
        if (touchX >= line.boundingBox.x &&
            touchX <= line.boundingBox.x + line.boundingBox.width &&
            touchY >= line.boundingBox.y &&
            touchY <= line.boundingBox.y + line.boundingBox.height) {

            gMeme.selectedLineIdx = i;
            gDraggingLineIdx = i;
            updateEditorForSelectedLine();
            renderMeme(getMeme());
            break;
        }
    }
}

function handleCanvasTouchMove(event) {
    if (gDraggingLineIdx === null) return;

    const rect = gCanvas.getBoundingClientRect();
    const touch = event.touches[0];

    const moveX = touch.clientX - rect.left;
    const moveY = touch.clientY - rect.top;

    const line = gMeme.lines[gDraggingLineIdx];
    line.x = moveX;
    line.y = moveY;

    renderMeme(getMeme());
    event.preventDefault();  
}

function handleCanvasTouchEnd(event) {
    const line = gMeme.lines[gDraggingLineIdx];
    if (line && line.prevAlign) {
        line.align = line.prevAlign;
        delete line.prevAlign;
    }

    gDraggingLineIdx = null;
}
