

function renderGallery(imgs, filter = '') {
    const galleryEl = document.querySelector('.main-gallery');
    
    const filteredImgs = imgs.filter(img => {
        return img.keywords.some(keyword => keyword.includes(filter));
    });
    
    const strHTML = filteredImgs.map(img => `
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
        document.querySelector('.meme-gallery').style.display = 'none';
    }
}

function initializeImageUpload() {

    const imageUploadInput = document.getElementById('imageUpload');


    imageUploadInput.addEventListener('change', function() {
        const file = this.files[0];
        const reader = new FileReader();

        reader.onload = function(event) {

            const meme = getMeme();
            

            console.log("Data URL:", event.target.result);
            console.log("Meme object before update:", meme);

            meme.selectedImgUrl = event.target.result;


            console.log("Meme object after update:", meme);

            renderMeme(meme);
        };

        reader.readAsDataURL(file);
    });

    document.querySelector('.main-gallery').style.display = 'none';
    document.querySelector('.main-editor').style.display = 'grid';
    document.querySelector('.searchbox').style.display = 'none';
    document.querySelector('.meme-gallery').style.display = 'none';
}      


