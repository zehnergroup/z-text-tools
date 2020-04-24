import path from "path";
import fs from "fs";
import { getConfig, Config } from "./config";

import {
  getPRBody,
  getThemeTitle,
  getYMLComment,
  getBranchTitle,
} from "./text";
import { handlify } from "./utils";
import updateConfigYML from "./config/updateConfigYML";

// FS Promises Interface
const fsPromises = fs.promises;

(async () => {
  const config: Config = await getConfig();

  const {
    workingDirectory,
    ticket: { id: ticketID },
    themes: { dev: devThemeID, prod: prodThemeID },
    pr: { title: prTitle },
    branch: { type: branchType },
    author,
  } = config;

  const prBody = getPRBody(
    ticketID,
    config.urls.shopify.base.dev,
    config.urls.shopify.base.prod,
    devThemeID,
    prodThemeID,
    config.urls.jira.base,
    config.urls.jira.prefix || "",
    branchType,
    prTitle
  );
  const themeName = getThemeTitle(ticketID, prTitle, author);
  const ymlComment = getYMLComment(themeName, devThemeID, prodThemeID);

  // update config YML with comment and theme IDs
  updateConfigYML(ymlComment);

  const branchTitle = getBranchTitle(ticketID, prTitle, branchType);

  console.log(branchTitle);

  // PR body
  await fsPromises
    .mkdir(path.join(workingDirectory, "text-tools-out", `${ticketID}`), {
      recursive: true,
    })
    .then(() =>
      fsPromises.writeFile(
        path.join(
          workingDirectory,
          "text-tools-out",
          `${ticketID}`,
          handlify(`${branchType}-${ticketID}-${prTitle}`) + ".md"
        ),
        prBody
      )
    );
  console.log(
    `Created: ${handlify(`${branchType}-${ticketID}-${prTitle}`)}.md`
  );

  // Theme name
  await fsPromises.writeFile(
    path.join(
      workingDirectory,
      "text-tools-out",
      `${ticketID}`,
      handlify(`${branchType}-${ticketID}-theme-name.txt`)
    ),
    themeName
  );
  console.log(
    `Created: ${handlify(`${branchType}-${ticketID}-theme-name.txt`)}`
  );

  // YML comment
  await fsPromises.writeFile(
    path.join(
      workingDirectory,
      "text-tools-out",
      `${ticketID}`,
      handlify(`${branchType}-${ticketID}-yml.txt`)
    ),
    ymlComment
  );
  console.log(`Created: ${handlify(`${branchType}-${ticketID}-yml.txt`)}`);
})().catch((err) => {
  console.log(err);
});
