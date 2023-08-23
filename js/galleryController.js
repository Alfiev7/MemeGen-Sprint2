

function renderGallery(imgs) {
    const galleryEl = document.querySelector('.main-gallery');
    const strHTML = imgs.map(img => `
        <img class="img-gallery" id="${img.id}" src="${img.url}" onclick="onImgSelected('${img.id}')">
    `).join('');
    galleryEl.innerHTML = strHTML;
}



function onImgSelected(imgId) {
    const imgs = getTestImgs(); // or replace this with the correct global function or variable
    const img = imgs.find(img => img.id === imgId);
    if (img) {
        gMeme.selectedImgId = imgId;
        gMeme.selectedImgUrl = img.url;
        renderMeme(gMeme);
    }
}

