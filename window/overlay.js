const {BrowserWindow, webContents} = require('electron');
const path = require('path');
class Overlay {

    constructor() {
        this._mainWindow = null;
        console.log('Created Overlay object');
    }

    get mainWindow() {
        return this._mainWindow;
    }

    set mainWindow(mainWindow) {
        this._mainWindow = mainWindow;
    }

    createWindow() {
        this._mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            frame: false,
            toolbar: false,
            fullscreen: true,
            alwaysOnTop: true,
            transparent: true,
            resizable: false,
            skipTaskbar: true
        });
        this._mainWindow.setIgnoreMouseEvents(true);
        //this._mainWindow.openDevTools();
        this._mainWindow.loadFile('./window/index.html');
        this._mainWindow.on('closed', function () {
            _mainWindow = null;
        })
    }

    toasty() {
        if(this._mainWindow)
            this._mainWindow.webContents.send('toasty', '../assets/toasty.png');
    }
}

module.exports = Overlay;