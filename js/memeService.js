
var gMeme = {
    selectedImgId: null,
    selectedImgUrl: null,
    text: ''
};


function getMeme() {
    return gMeme;
}

function setLineTxt(txt) {
    gMeme.text = txt;
}




function setImg(imgId) {
    gMeme.selectedImgId = imgId;
}
