const {app} = require('electron');
const Overlay = require('./window/overlay');
const jenkins = require('jenkins')({ baseUrl: 'http://fariase:5dwz3heo.@jenkins.weg.net:8080', crumbIssuer: true, promisify: true });
const schedule = require('node-schedule');

let overlay = new Overlay();


let jobInfo, buildInfo, lastBuild, lastUnsuccessfulBuild;
app.on('ready', async function(){
  overlay.createWindow()
  jobInfo = await jenkins.job.get('pipeline-maestro');
  lastBuild = jobInfo.lastBuild.number;
  lastUnsuccessfulBuild = jobInfo.lastUnsuccessfulBuild.number;
  console.log('info', jobInfo);
  buildInfo = await jenkins.build.get('pipeline-maestro', lastBuild);
  console.log('info', buildInfo);
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (overlay.mainWindow === null) {
    overlay.createWindow();
  }
});

schedule.scheduleJob('*/5 * * * *', () => {
});