

function renderGallery(imgs) {
    const galleryEl = document.querySelector('.main-gallery');
    const strHTML = imgs.map(img => `
        <img class="img-gallery" id="${img.id}" src="${img.url}" onclick="onImgSelected('${img.id}')">
    `).join('');
    galleryEl.innerHTML = strHTML;
}



function onImgSelected(imgId) {
    const imgs = getTestImgs();
    const img = imgs.find(img => img.id === imgId);
    if (img) {
        gMeme.selectedImgId = imgId;
        gMeme.selectedImgUrl = img.url;
        renderMeme(gMeme);


        document.querySelector('.main-gallery').style.display = 'none';
        document.querySelector('.main-editor').style.display = 'grid';
        document.querySelector('.searchbox').style.display = 'none';
    }
}

        

