## Overview

- Toolset to automate tasks around Z-Theme development including:
  - Maintaining consistent naming convetion across theme on prod and dev stores
  - Following [Zehner Git Style](https://www.notion.so/Git-Style-Guide-Commits-Branch-Names-032b21ffe7ac4a0ca580a7b68d9b5d9e)

---

## What It Does:

- You provide ticket number, PR title, branch type and DEV and PROD themes ids
- `npm run start` - creates `text-out` folder with subfolders indexed by the ticket number containing text files for theme name, `config.yml` reference comment, PR preformatted text with links
- `npm run branch` - creates new branch following [Zehner Git Style](https://www.notion.so/Git-Style-Guide-Commits-Branch-Names-032b21ffe7ac4a0ca580a7b68d9b5d9e), for example: `feature/PROJ-11/feature-title`
- `npm run branch-push` - pushes created branch to a provided repo
- `npm run pr` - creates pull request following [Zehner Git Style](https://www.notion.so/Git-Style-Guide-Commits-Branch-Names-032b21ffe7ac4a0ca580a7b68d9b5d9e) with your ticket, development themes and links, for example following pull request titled **"Feature | PROJ-11 | Feature Title"**:

```md
**Links:**

- Jira Ticket: https://zehnergroup.atlassian.net/browse/PROJ-11

- CMS preview URL:
  - DEV: https://z-project-dev.myshopify.com/admin/themes/80732979284/editor
  - PROD: https://z-project.myshopify.com/admin/themes/80843374626/editor

**Verify:**

- [ ] Page matches designs (desktop + responsive)
- [ ] All Theme Editor option variations behave correctly (eg. alignment, content variations, how modules work with AND without content populated)

**Notes**:
```

---

## Setup

- Provide path to your theme working directory in `config.json` (see [Example Config](config.sample.json) )
- **Inside** your theme / project folder create 2 config files:
  - `texttoolsconfig.json` - global config that you can set at the beginning
