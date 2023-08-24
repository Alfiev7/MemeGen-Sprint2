var gCanvas = document.querySelector('#my-canvas');
var gCtx = gCanvas.getContext('2d');
let gDraggingLineIdx = null;
let stickers = [];
let isDownloading = false;
let gDraggingSticker = null;
let gDraggingStickerIdx = null;
let draggedStickerURL = null;


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
        drawAllStickers();
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

    for (let i = 0; i < stickers.length; i++) {
        const sticker = stickers[i];
        if (clickX >= sticker.x && clickX <= sticker.x + 50 &&
            clickY >= sticker.y && clickY <= sticker.y + 50) {

            gDraggingStickerIdx = i;

            document.addEventListener('mousemove', handleStickerMove);
            document.addEventListener('mouseup', handleStickerRelease);
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

    if (draggedStickerURL !== null) {
        const rect = gCanvas.getBoundingClientRect();
        const scaleX = gCanvas.width / rect.width;
        const scaleY = gCanvas.height / rect.height;
        const moveX = event.offsetX * scaleX;
        const moveY = event.offsetY * scaleY;

        renderMeme(getMeme(), false);  
        const img = new Image();
        img.src = draggedStickerURL;
        gCtx.drawImage(img, moveX, moveY, 50, 50);  
    }

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
    
    const scale = gCanvas.width / gCanvas.getBoundingClientRect().width;
    const touchX = (touch.clientX - rect.left) * scale;
    const touchY = (touch.clientY - rect.top) * scale;

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

    for (let i = 0; i < stickers.length; i++) {
        const sticker = stickers[i];
        if (touchX >= sticker.x && touchX <= sticker.x + 50 &&
            touchY >= sticker.y && touchY <= sticker.y + 50) {

            gDraggingStickerIdx = i;
            document.addEventListener('touchmove', handleCanvasTouchMove);
            document.addEventListener('touchend', handleCanvasTouchEnd);
            break;
        }
    }
}


function handleCanvasTouchMove(event) {
    const rect = gCanvas.getBoundingClientRect();
    const touch = event.touches[0];
    
    const scale = gCanvas.width / gCanvas.getBoundingClientRect().width;
    const moveX = (touch.clientX - rect.left) * scale;
    const moveY = (touch.clientY - rect.top) * scale;

    if (gDraggingLineIdx !== null) {
        const line = gMeme.lines[gDraggingLineIdx];
        line.x = moveX;
        line.y = moveY;
    }

    if (gDraggingStickerIdx !== null) {
        const sticker = stickers[gDraggingStickerIdx];
        sticker.x = moveX;
        sticker.y = moveY;
    }

    renderMeme(getMeme());
    // event.preventDefault();
}


function handleCanvasTouchEnd(event) {
    if (gDraggingLineIdx !== null) {
        const line = gMeme.lines[gDraggingLineIdx];
        if (line && line.prevAlign) {
            line.align = line.prevAlign;
            delete line.prevAlign;
        }
    }


    

    document.removeEventListener('touchmove', handleCanvasTouchMove);
    document.removeEventListener('touchend', handleCanvasTouchEnd);

    gDraggingStickerIdx = null;
    gDraggingLineIdx = null;
}


function initializeStickers() {
    const stickers = document.querySelectorAll('.sticker');
    stickers.forEach(sticker => {
        sticker.addEventListener('dragstart', handleStickerDragStart);
        sticker.addEventListener('touchstart', handleStickerTouchStart);
    });
}

function handleStickerTouchStart(e) {
    draggedStickerURL = e.target.src;
    const rect = gCanvas.getBoundingClientRect();


    const x = gCanvas.width / 2;
    const y = gCanvas.height / 2;

    drawStickerOnCanvas(draggedStickerURL, x, y);
}

function handleStickerDragStart(e) {
    e.dataTransfer.setData('stickerURL', e.target.src);
}

function initializeCanvasDragDrop() {
    gCanvas.addEventListener('drop', handleCanvasDrop);
    gCanvas.addEventListener('dragover', handleCanvasDragOver);
}

function handleCanvasDragOver(e) {
    e.preventDefault(); 
}

function handleCanvasDrop(e) {
    e.preventDefault();

    const stickerURL = e.dataTransfer.getData('stickerURL');

    if (stickerURL) {
        drawStickerOnCanvas(stickerURL, e.clientX, e.clientY);
    }
    renderMeme(getMeme());
}

function drawStickerOnCanvas(stickerURL, clientX, clientY) {
    const img = new Image();
    img.src = stickerURL;

    img.onload = function() {
        const rect = gCanvas.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;

        gCtx.drawImage(img, x, y, 50, 50); 
        stickers.push({img: img, x: x, y: y});
    };
}


function initialize() {
    initializeStickers();
    initializeCanvasDragDrop();

}


initialize();

function drawAllStickers() {
    stickers.forEach(sticker => {
        gCtx.drawImage(sticker.img, sticker.x, sticker.y, 50, 50); 
    });
}


function handleStickerMove(event) {
    if (gDraggingStickerIdx === null) return;

    const rect = gCanvas.getBoundingClientRect();
    const scaleX = gCanvas.width / rect.width;
    const scaleY = gCanvas.height / rect.height;

    const moveX = event.offsetX * scaleX;
    const moveY = event.offsetY * scaleY;

    const sticker = stickers[gDraggingStickerIdx];
    sticker.x = moveX;
    sticker.y = moveY;

    renderMeme(getMeme());
}

function handleStickerRelease(event) {
    document.removeEventListener('mousemove', handleStickerMove);
    document.removeEventListener('mouseup', handleStickerRelease);
    gDraggingStickerIdx = null;
}

function generateRandomMeme() {
    const meme = getMeme(); 
    const images = ["imgs/2.jpg", "imgs/003.jpg", "imgs/004.jpg", "imgs/5.jpg", "imgs/005.jpg","imgs/006.jpg", "imgs/8.jpg", "imgs/9.jpg", "imgs/12.jpg", "imgs/19.jpg", "imgs/img2.jpg"];
   
    
    
    const randomImageIndex = Math.floor(Math.random() * images.length);
    meme.selectedImgUrl = images[randomImageIndex];
    
    
  
    
    renderMeme(meme);
    document.querySelector('.main-gallery').style.display = 'none';
    document.querySelector('.main-editor').style.display = 'grid';
    document.querySelector('.searchbox').style.display = 'none';
}

