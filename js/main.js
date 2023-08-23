function onInit() {
    // Directly call the function to get test images and render the gallery
    const testImgs = getTestImgs();
    renderGallery(testImgs);

    // Connect the text input's change event to the setLineTxt() function
    initTextInputListener();
}

function initTextInputListener() {
    document.querySelector('input[name="txt-mem"]').addEventListener('input', function(event) {
        setLineTxt(event.target.value);
        renderMeme(getMeme());
    });
}
