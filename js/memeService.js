
var gMeme = {
    selectedImgId: null,
    selectedImgUrl: null,
    lines: [
        { text: 'Text 1', size: 40, color: 'white', x: 200, y: 100 },  
        { text: 'Text 2', size: 40, color: 'white', x: 200, y: 300 }
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
    const newLine = { text: '', size: 40, color: 'white', x: 200, y: gCanvas.height / 2 };
    gMeme.lines.push(newLine);
    gMeme.selectedLineIdx = gMeme.lines.length - 1;
}

function switchLine() {
    gMeme.selectedLineIdx = (gMeme.selectedLineIdx + 1) % gMeme.lines.length;
    renderMeme(getMeme());
}

function getSelectedLine() {
    return gMeme.lines[gMeme.selectedLineIdx];
}

