
var gMeme = {
    selectedImgId: null,
    selectedImgUrl: null,
    lines: [
        { text: 'Text 1', size: 45, font: 'Impact', color: 'white', x: 0, y: 100, align: 'left' },  
        { text: 'Text 2', size: 45, font: 'Impact',color: 'white', x: 0, y: 300, align: 'left' }
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


function saveMemeToLocalStorage() {
    try {
       
        renderMeme(getMeme(), false);
        
       
        setTimeout(() => {
            const memeImage = gCanvas.toDataURL('image/png');
            
            let savedMemes = JSON.parse(localStorage.getItem('savedMemes')) || [];
            savedMemes.push(memeImage);
            localStorage.setItem('savedMemes', JSON.stringify(savedMemes));
            
            console.log('Meme saved successfully!');
        }, 1000);
        
    } catch (e) {
        console.error("Failed to save meme", e);
    }
}


function showSavedMemes() {
    try {
        let savedMemes = JSON.parse(localStorage.getItem('savedMemes')) || [];
        const galleryDiv = document.querySelector(".meme-gallery");
        galleryDiv.innerHTML = ''; 
        savedMemes.forEach((meme, idx) => {
            const img = document.createElement('img');
            img.className = 'img-memes';  
            img.src = meme;
            img.width = 200; 
            img.height = 200; 
            galleryDiv.appendChild(img);
        });
        galleryDiv.style.display = 'block'; 

     
        document.querySelector('.main-gallery').style.display = 'none';
        document.querySelector('.main-editor').style.display = 'none';
        document.querySelector('.searchbox').style.display = 'none';
    } catch (e) {
        console.error("Failed to show saved memes", e);
    }
}



     function imageURLToDataURL(url, callback) {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = function() {
          gCanvas.getContext('2d').drawImage(img, 0, 0);
          const dataURL = gCanvas.toDataURL('image/png');
          callback(null, dataURL);
        };
        img.onerror = function() {
          callback('Error occurred');
        };
        img.src = url;
      }


      function loadExampleMemes(exampleMemes, callback) {
        let savedMemes = JSON.parse(localStorage.getItem('savedMemes')) || [];
      
        if (savedMemes.length === 0) {
          let count = 0;
          exampleMemes.forEach(function(url) {
            imageURLToDataURL(url, function(error, dataURL) {
              if (error) {
                callback('Failed to convert an example meme to Data URL');
                return;
              }
              savedMemes.push(dataURL);
              count++;
              if (count === exampleMemes.length) {
                localStorage.setItem('savedMemes', JSON.stringify(savedMemes));
                callback(null);
              }
            });
          });
        }
      }

      function initializeSavedMemes() {
        const exampleMemes = [
            'examplememes/example1.png', 
            'examplememes/example2.png', 
            'examplememes/example3.png', 
             ];
             
             loadExampleMemes(exampleMemes, function(error) {
                 if (error) {
                     console.error('Failed to load example memes:', error);
                    } else {
                        console.log('Example memes loaded successfully.');
                    }
                });
            }
        

      initializeSavedMemes();