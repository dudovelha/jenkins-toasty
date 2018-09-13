const Overlay = require('../window/overlay');
const JenkinsStatus = require('../jenkins/jenkinsStatus');
const schedule = require('node-schedule');

class Notifier {

    constructor(test, debug) {
        this._overlay = new Overlay();
        this._overlay.createWindow(debug);

        this._jenkinsStatus = new JenkinsStatus();

        if (test) {
            setInterval(() => {
                this._overlay.toasty(['toasty']);
            }, 2000);
        }
    }

    registerNotifications() {
        let js = this._jenkinsStatus;
        schedule.scheduleJob('*/5 * * * *', () => {
            js.update();
            if (js.status == 'FAILURE') {
                this._overlay.toasty(js.blameList);
            }
        });
    }
}

module.exports = Notifier;