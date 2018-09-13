const fs = require('fs');

class JenkinsStatus {

    constructor() {
        this._jobInfo = null;
        this._buildInfo = null;
        let config = JSON.parse(fs.readFileSync('./app/config.json'));
        this.jenkins = require('jenkins')({ baseUrl: `http://${config.username}:${config.password}.@jenkins.weg.net:8080`, crumbIssuer: true, promisify: true });
    }

    get jobInfo() {
        return this._jobInfo;
    }

    get buildInfo() {
        return this._buildInfo;
    }

    get status() {
        if (this._buildInfo)
            return this._buildInfo.result;
        return null;
    }

    get blameList() {
        return this._blameList;
    }

    async update() {
        let blameList = [];
        let jobInfo = await jenkins.job.get('pipeline-maestro');

        let lastBuild = jobInfo.lastBuild.number;
        let lastSuccessfulBuild = jobInfo.lastSuccessfulBuild.number;
        let buildInfo = await jenkins.build.get('pipeline-maestro', lastBuild);
        if (buildInfo.result == 'FAILURE') {
            let firstUnsuccessfulBuild = buildInfo;
            if (lastBuild > lastSuccessfulBuild) {
                firstUnsuccessfulBuild = await jenkins.build.get('pipeline-maestro', lastSuccessfulBuild + 1);
            }

            firstUnsuccessfulBuild.culprits.forEach(culprit => {
                let array = culprit.absoluteUrl.split("/");
                blameList.push(array[array.length - 1]);
            })
        }
        this._blameList = blameList;
        this._jobInfo = jobInfo;
        this._buildInfo = buildInfo;
    }
}

module.exports = JenkinsStatus;