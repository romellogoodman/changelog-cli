# Changelog Cli

A command-line tool for writing changelogs (changelod.md) and incrementing versions in package.json

This module uses the module [semver](https://www.npmjs.com/package/semver) to follow the idea [semver](http://semver.org/).

```
$ npm i chagelog-cli -g

$ changelog minor
```

## Usage

#### Incrementing Options
| Name       | Before | After   |
|:-----------|:-------|:--------|
| major      | 1.0.0  | 2.0.0   |
| minor      | 1.0.0  | 1.1.0   |
| patch      | 1.0.0  | 1.0.1   |
| premajor   | 1.0.0  | 2.0.0-0 |
| preminor   | 1.0.0  | 1.1.0-0 |
| prepatch   | 1.0.0  | 1.0.1-0 |
| prerelease | 1.0.0  | 1.0.1-0 |

#### Check Version
To check the current version of the module/project you are in.

```
$ changelog check
```
