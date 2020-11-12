## Overview

- CLI tool to automate tasks around Z-Theme development. It allows you to:
  - Maintain consistent naming convetion across themes on prod and dev stores
  - Create, checkout, push to remove feature branches following [Zehner Git Style](https://www.notion.so/Git-Style-Guide-Commits-Branch-Names-032b21ffe7ac4a0ca580a7b68d9b5d9e)
  - Open Pull Requests prepopulated with feature links (Jira ticket and themes links) and titled following [Zehner Git Style](https://www.notion.so/Git-Style-Guide-Commits-Branch-Names-032b21ffe7ac4a0ca580a7b68d9b5d9e)
  - Generate, watch CMS blocks and pages - in progress
  - Switch between themes and runing theme kit - in progress

---

## Requirements

- [Node.js Version 12 and higher](https://nodejs.org/en/download/). Use [NVM](https://github.com/nvm-sh/nvm) to switch between versions.
- Git token (`z-tools branch push` and `z-tools pr`):
  Follow [these instructions](https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line) to get your token.
- Jira token (for `z-tools jira comment`):
  Follow [these instructions](https://confluence.atlassian.com/cloud/api-tokens-938839638.html)

---

## Installation

### Install `z-tools` in your system

1.  Clone [Z-Tools repo](https://github.com/zehnergroup/z-text-tools)
2.  **Inside** `z-text-tools` folder run:

```
$ npm install
$ npm run build
$ npm install -g
```

3. Anywhere in your system check `z-tools` is available. If you're using multiple npm versions, you may need to run nvm with Node.js 12+ like so `nvm use 12.16.2`

```
z-tools --version
```

### Setup your project

1. **Inside** your theme / project folder create a config file:

- `texttoolsconfig.json` - global config, set once per project. See `texttoolsconfig.sample.json`

2. Run:

```
z-tools init
```

---

## Usage

Every command is self-documented by the tool. Run `z-tools <command> --help` for details about using a command.

```
Usage:
z-tools <command> [args]

Commands:
  z-tools branch      Create, checkout, push to remote a feature branch
  z-tools checkout    Checkout feature
  z-tools cms         Generate, update and watch cms pages schemas and blocks
  z-tools feature     Create, list, checkout features
  z-tools init        Initalizes Z-Tools in working directory
  z-tools pr          Create pull request from the context of current feature
  z-tools status      Print current status
  z-tools text-tools  Run available text tools and save output in "text-tools-out" folder

Options:
  --help      Show help for a command                                                                                                                                                                                                                                                                                       [boolean]
  --version   Show version number                                                                                                                                                                                                                                                                                           [boolean]
  --path, -p  Explicitly set a working directory

```
