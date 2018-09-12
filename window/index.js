const {ipcRenderer} = require('electron');
console.log(ipcRenderer);
ipcRenderer.on('toasty', (event, data) => {
    let image = document.getElementById('toasty');
    if(data != image.src)
        image.src = data;

    if(!image.classList.contains('show-dan'))
        image.classList.add('show-dan');
    
    setInterval(() => image.classList.remove('show-dan'), 1000);
});