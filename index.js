"use strict";

const RATE_LIMIT_DELAY = 60 / 25 * 1500; // Reduce to 25/30 and add 50% margin
const fs = require('fs');
const Promise = require('bluebird');
const GitHubApi = require('github');
const config = JSON.parse(fs.readFileSync('.config.json', 'utf8'));
const outStream = fs.createWriteStream('results.csv');
outStream.write('"user", "repoOwner", "repoName", "commitDate"\n');

const github = new GitHubApi({
    debug: false,
    Promise: Promise,
    timeout: 5000,
    host: config.host,
    protocol: config.protocol,
    port: config.port,
    headers: {
        'user-agent': config.userAgent
    },
    requestMedia: 'application/vnd.github.v3+json'
});

github.authenticate({
    type: 'token',
    token: config.authToken
});

function getAllOrgMembers(orgName) {
    let members = config.users;

    function pager (result) {
        for (let i = 0; i < result.data.length; i++) {
            members.push(result.data[i].login);
        }

        if (github.hasNextPage(result)) {
            return github.getNextPage(result).then(pager);
        }

        return members;
    }

    return github.orgs.getMembers({ org: orgName })
        .then(pager);
}

function getAllCommits(loginList) {
    let commits = [];

    var login = loginList.pop();
    if (!login) return commits;

    function commitsPager (result) {
        console.log("Got " + result.data.items.length + " items for '" + login + "'");
        commits = commits.concat(result.data.items);

        if (github.hasNextPage(result)) {
            return github.getNextPage(result).delay(RATE_LIMIT_DELAY).then(commitsPager);
        } else {
            login = loginList.pop();
            if (!login) return commits;

            return github.search.commits({
                q: 'author:' + login + '+author-date:' + config.startDate + '..' + config.endDate
            }).delay(RATE_LIMIT_DELAY).then(commitsPager);
        }
    }

    return github.search.commits({
        q: 'author:' + login + '+author-date:' + config.startDate + '..' + config.endDate
    }).delay(RATE_LIMIT_DELAY).then(commitsPager);
}

getAllOrgMembers(config.orgs[0]) // TODO: Handle a list of orgs
    .then(getAllCommits)
    .then((commits) => {
        for (let i = 0; i < commits.length; i++) {
            let commit = commits[i];
            outStream.write(
                '"' + commit.author.login + '", "'
                    + commit.repository.owner.login + '", "'
                    + commit.repository.name + '", "'
                    + commit.commit.author.date + '"\n'
            );
        }
    })
    .then(() => {
        outStream.end();
    });
