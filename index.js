#!/usr/bin/env node --harmony
var co = require('co');
var colors = require('colors');
var fs = require('fs');
var moment = require('moment');
var path = require('path');
var program = require('commander');
var prompt = require('co-prompt');
var semver = require('semver');

/**
 * Check if the type provided is allowed
 * @param {String} type The type to check
 * @return {String} Returns either the type or an empty string
 */
function checkType (type) {
  var allowedTypes = [
    'check',
    'major',
    'minor',
    'patch',
    'premajor',
    'preminor',
    'prepatch',
    'prerelease'
  ];

  if (allowedTypes.indexOf(type) === -1) {
    return '';
  }
  return type.toLowerCase();
}

program
.arguments('<type>')
.option('-t, --tag', 'Commit the change and tag the new version in git.')
.action(function (type) {
  var verifiedType = checkType(type.toLowerCase());

  if (verifiedType) {
    var packageJSONPath = path.resolve(process.cwd(), 'package.json');
    var packageJSON = '';

    try {
      packageJSON = fs.readFileSync(packageJSONPath, 'UTF-8');
    } catch (err) {
      console.log(`${' EXITING '.redBG.bold.white} There was an error reading package.json at: ${packageJSONPath}.`)
      process.exit(1);
    }

    var parsedJSON = JSON.parse(packageJSON);

    if (verifiedType === 'check') {
      console.log(`The current version of ${parsedJSON.name} is ${parsedJSON.version}.`);
    } else {
      var oldVersion = parsedJSON.version;

      parsedJSON.version = semver.inc(parsedJSON.version, verifiedType);
      console.log(`Changing from version ${oldVersion} to ${parsedJSON.version}.`);

      var stringJSON = JSON.stringify(parsedJSON, null, 2);

      fs.writeFileSync('package.json', stringJSON);
      console.log(`${' SUCCESS '.greenBG.bold.white} Wrote package.json.`);

      try {
        var changelogFile = 'CHANGELOG.md';
        var changelogPath = path.resolve(process.cwd(), changelogFile);

        packageJSON = fs.readFileSync(changelogPath, 'UTF-8');
      } catch (err) {
        if (err.code === "ENOENT") {
          console.log('CHANGELOG.md does not exist. Writing a new one.');
          fs.writeFileSync(changelogFile, '');
          console.log(`${' SUCCESS '.greenBG.bold.white} Wrote a fresh changelog.`);
        } else {
          console.log(`${' EXITING '.redBG.bold.white} There was an error reading the changelog at: ${changelogPath}.`);
          process.exit(1);
        }
      }

      co(function *() {
        // Update the changelog
        var message = yield prompt('Write a message for the changelog.\n');
        var date = moment().format('MMMM Do YYYY');

        changeLogMessage = `\n### ${parsedJSON.version} (${date})\n* ${message}\n`;
        fs.appendFileSync(changelogFile, changeLogMessage);
        console.log(`${' SUCCESS '.greenBG.bold.white} Updated the changelog.`);

        // TODO: Commit change & Tag in git
        // if (program.tag) {
        //   console.log('TAGGING IN GIT!');
        // }

        // Finish the program
        process.exit(0);
      });
    }
  } else {
    console.log(`${' EXITING '.redBG.bold.white} ${type} is not a supported type.`);
  }
})
.parse(process.argv);
