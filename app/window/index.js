const { ipcRenderer } = require('electron');
const fs = require('fs');

ipcRenderer.on('toasty', (event, data) => {
    let image = document.getElementById('toasty-img'),
        toastyHeader = document.getElementById('toasty-header');
        toastyDiv = document.getElementById('toasty');
    
    let count = 1;
    debugger;
    data.forEach(culprit => {
        setTimeout(() => {
            if( fs.existsSync(`${__dirname}/../assets/${culprit}.png`)) {
                image.src = `../assets/${culprit}.png`;
            } else {
                image.src = `../assets/toasty.png`;
            }
            toastyHeader.innerHTML = culprit;
            if (!toastyDiv.classList.contains('show-dan'))
                toastyDiv.classList.add('show-dan');
            setTimeout(() => toastyDiv.classList.remove('show-dan'), 2000);
        }, (count * 3) * 1000);
        count++;
    });
});