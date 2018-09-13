const { ipcRenderer } = require('electron');
const fs = require('fs');

ipcRenderer.on('toasty', (event, data) => {
    let image = document.getElementById('toasty-img'),
        toastyHeader = document.getElementById('toasty-header');
        toastyDiv = document.getElementById('toasty');
    
    let count = 1;
    data.forEach(culprit => {
        setTimeout(() => {
            if( fs.existsSync(`../assets/${culprit}.png`)) {
                image.src = `../assets/${culprit}.png`;
            } else {
                image.src = `../assets/toasty.png`;
            }
            toastyHeader.innerHTML = culprit;
            if (!toastyDiv.classList.contains('show-dan'))
                toastyDiv.classList.add('show-dan');
            setTimeout(() => toastyDiv.classList.remove('show-dan'), 1000);
        }, (count * 2) * 1000);
        count++;
    });
});