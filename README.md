# Introduction

This is a simple command-line tool for producing a CSV file of all commits made by a set of
users over a period of time. The intended use is to produce some interesting statistics for
publication and to hopefully help motivate people to contribute to open source projects.

# Getting started

Make sure you have Node 8.9.1 or later installed.

Clone this repository.

From the command line execute `npm install` in the cloned folder to get the dependencies.

Configure the application by creating a `.config.json` in the application folder and
setting the parameters for your run (see the configuration section below for details and
format).

Run the application with `./index.js`.

# Configuration

Here is an example `.config.json` that you can use as a starting point:
```
{
  "debug": false,
  "host": "api.github.com",
  "port": 443,
  "protocol": "https",
  "userAgent": "github-stats",
  "authToken": "",
  "startDate": "2016-12-01",
  "endDate": "2017-12-01",
  "orgs": [
    "entelect"
  ],
  "users": [
    "mattpwest"
  ]
}
```

You need to get a Github API `authToken` to allow you to call the Github API.

The date range is specified by `startDate` and `endDate` (both inclusive).

The list of `orgs` is the organisations whose members you would like to get stats for (currently
only the first one is used).

The list of `users` is additional user names that might not be in the organisation that
you would like to include.