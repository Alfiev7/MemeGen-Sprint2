function getTestImgs() {
    return [
        {id: 'img1', url: 'imgs/2.jpg', keywords: ['happy']},
        {id: 'img2', url: 'imgs/003.jpg', keywords: ['angry']},
        {id: 'img3', url: 'imgs/004.jpg', keywords: ['cute']},
        {id: 'img4', url: 'imgs/005.jpg', keywords: ['cute']},
        {id: 'img5', url: 'imgs/006.jpg', keywords: ['cute']},
        {id: 'img6', url: 'imgs/8.jpg', keywords: ['sad']},
        {id: 'img7', url: 'imgs/9.jpg', keywords: ['funny']},
        {id: 'img8', url: 'imgs/12.jpg', keywords: ['funny']},
        {id: 'img9', url: 'imgs/19.jpg', keywords: ['angry']},
        {id: 'img10', url: 'imgs/Ancient-Aliens.jpg', keywords: ['funny']},
        {id: 'img12', url: 'imgs/img2.jpg', keywords: ['funny']},
        {id: 'img13', url: 'imgs/img4.jpg', keywords: ['angry']},
        {id: 'img14', url: 'imgs/img5.jpg', keywords: ['cute']},
        {id: 'img15', url: 'imgs/img6.jpg', keywords: ['cute']},
        {id: 'img16', url: 'imgs/img11.jpg', keywords: ['funny']},
        {id: 'img17', url: 'imgs/img12.jpg', keywords: ['funny']},
        {id: 'img18', url: 'imgs/leo.jpg', keywords: ['happy']}
    ];
        
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}



function searchMemes(query) {
    return memeList.filter(meme => {
        return meme.keyboards.some(keyword => keyword.includes(query));
    });
}
        


function handleSearch() {
    const query = document.getElementById('searchBox').value;
    const imgs = getTestImgs();
    renderGallery(imgs, query.toLowerCase());
}

