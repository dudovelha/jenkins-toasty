const fs = require('fs');

class JenkinsStatus {

    constructor() {
        this._jobInfo = null;
        this._buildInfo = null;
        this._blameList = [];
        let config = JSON.parse(fs.readFileSync('./app/config.json'));

        this.jenkins = require('jenkins')({ baseUrl: `http://${config.username}:${config.password}@jenkins.weg.net:8080`, crumbIssuer: true, promisify: true });
        this._project = config.project;
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
        let jobInfo;

        try {
            jobInfo = await this.jenkins.job.get(this._project);
        } catch (err) {
            console.log(err);
        }

        let lastBuild = jobInfo.lastBuild.number;
        let lastSuccessfulBuild = jobInfo.lastSuccessfulBuild.number;
        let buildInfo = await this.jenkins.build.get(this._project, lastBuild);
        if (buildInfo.result == 'FAILURE') {
            let firstUnsuccessfulBuild = buildInfo;
            if (lastBuild > lastSuccessfulBuild) {
                try {
                    firstUnsuccessfulBuild = await this.jenkins.build.get(this._project, lastSuccessfulBuild + 1);
                } catch (err) {
                    firstUnsuccessfulBuild = buildInfo;
                }
            }
            firstUnsuccessfulBuild.culprits.forEach(culprit => {
                let array = culprit.absoluteUrl.split("/");
                blameList.push(array[array.length - 1]);
            })
        }
        console.log('blamelist', blameList);
        this._blameList = blameList;
        this._jobInfo = jobInfo;
        this._buildInfo = buildInfo;
    }
}

module.exports = JenkinsStatus;