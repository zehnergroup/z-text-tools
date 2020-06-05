import path from "path";
import fs from "fs";
import { getConfig } from "./config";
import { Config } from "./types";

import { getPRBody, getThemeTitle, getYMLComment } from "./text";
import { handlify } from "./utils";
import updateConfigYML from "./config/writeYMLComment";

// FS Promises Interface
const fsPromises = fs.promises;

(async () => {
  const config: any = await getConfig();

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
    config.urls.shopify.editor,
    config.urls.shopify.hash
  );
  const themeName = getThemeTitle(ticketID, prTitle, author);
  const ymlComment = getYMLComment(themeName, devThemeID, prodThemeID);

  // update config YML with comment and theme IDs
  updateConfigYML(ymlComment);

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
