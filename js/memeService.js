
var gMeme = {
    selectedImgId: null,
    selectedImgUrl: null,
    lines: [
        { text: 'Text 1', size: 40, font: 'Impact', color: 'white', x: 0, y: 100, align: 'left' },  
        { text: 'Text 2', size: 40, font: 'Impact',color: 'white', x: 0, y: 300, align: 'left' }
    ],
    selectedLineIdx: 0
};


function getMeme() {
    return gMeme;
}

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].text = txt;
}

function setLineColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color;
}


function setImg(imgId) {
    gMeme.selectedImgId = imgId;
}

function addLine() {
    const newLine = { text: 'New Text', size: 40, font: 'Impact', color: 'white', x: 0, y: gCanvas.height / 2 };
    gMeme.lines.push(newLine);
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
    renderMeme(getMeme());
}

function switchLine() {
    gMeme.selectedLineIdx = (gMeme.selectedLineIdx + 1) % gMeme.lines.length;
    renderMeme(getMeme());
}

function getSelectedLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}

function setTextAlignment(alignment) {
    getSelectedLine().align = alignment;
}

function setFontFamily(fontFamily) {
    getSelectedLine().font = fontFamily;
}


function deleteLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1);
 gMeme.selectedLineIdx--;
    
}
