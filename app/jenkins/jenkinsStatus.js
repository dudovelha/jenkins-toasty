const fs = require('fs');

class JenkinsStatus {

    constructor() {
        this._jobInfo = null;
        this._buildInfo = null;
        this._blameList = [];
        let config;
        try {
            config = JSON.parse(fs.readFileSync('./app/config.json'));
        } catch(err) {
            console.log(err);
            config = JSON.parse(fs.readFileSync(`${__dirname}/../config.json`));
        }
        this.jenkins = require('jenkins')({ baseUrl: `http://${config.username}:${config.password}@jenkins.weg.net:8080`, crumbIssuer: true, promisify: true });
        this._project = config.project;
        console.log('project', this._project)
    }

    get jobInfo() {
        return this._jobInfo;
    }

    get buildInfo() {
        return this._buildInfo;
    }

    get status() {
        if (this._buildInfo && this._buildInfo.result)
            return this._buildInfo.result;
        else if(this._buildInfo && this._buildInfo.building)
            return 'BUILDING'
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
        let buildInfo;

        try {
            buildInfo = await this.jenkins.build.get(this._project, lastBuild);
        } catch (err) {
            console.log(err);
        }

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
        this._blameList = blameList;
        this._jobInfo = jobInfo;
        this._buildInfo = buildInfo;
        console.log('Project '+this._project+' status: '+this.status);
    }
}

module.exports = JenkinsStatus;