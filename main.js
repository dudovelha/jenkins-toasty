const {app} = require('electron');
const Notifier = require('./app/notifier/notifier');
let test = true;
let debug = false;
let notifier;


app.on('ready', () => {
  notifier = new Notifier(test, debug);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});