const { ipcRenderer } = require('electron');

ipcRenderer.on('toasty', (event, data) => {
    let image = document.getElementById('toasty');

    let count = 1;
    data.forEach(culprit => {
        setTimeout(() => {
            image.src = `../assets/${culprit}.png`;
            if (!image.classList.contains('show-dan'))
                image.classList.add('show-dan');
            setTimeout(() => image.classList.remove('show-dan'), 1000);
        }, (count * 2) + 1000);
    })


});