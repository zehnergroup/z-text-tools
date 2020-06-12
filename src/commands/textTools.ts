import ora from "ora";
import chalk from "chalk";

import path from "path";
import fs from "fs";
import { Feature, Config } from "../types";

import getDBAdapter from "../db/getDBAdapter";
import getWorkingDirectory from "../workingDirectory/getWorkingDirectory";
import getConfigFromDB from "../db/getConfigFromDB";
import { getPRBody, getThemeTitle, getYMLComment } from "../text";
import writeYMLComment from "../config/writeYMLComment";
import getCurrentFeature from "../feature/getCurrentFeature";

import { handlify } from "../utils";

export const command = "text-tools";
export const desc = `Run available text tools and save output in "text-tools-out" folder`;

// FS Promises Interface
const fsPromises = fs.promises;

export const handler = async (args: any) => {
  try {
    const workingDirectory = await getWorkingDirectory(args);
    const db = await getDBAdapter(workingDirectory);
    const feature: Feature | null = await getCurrentFeature(workingDirectory);
    const config: Config = await getConfigFromDB(workingDirectory, db);

    const {
      github: { token: auth, repo, owner, baseBranch },
      shopify: {
        base: { dev: shopifyDevBase, prod: shopifyProdBase },
        editor: shopifyEditor,
        hash: shopifyHash,
      },
      jira: { base: jiraBase, prefix: jiraPrefix },
      author,
    } = config;

    if (feature) {
      const {
        ticket: { projectIdentifier },
        themes: { dev: devThemeID, prod: prodThemeID },
        branch: { type: branchType },
        title,
      } = feature;

      const prBody = getPRBody(
        projectIdentifier,
        shopifyDevBase,
        shopifyProdBase,
        devThemeID,
        prodThemeID,
        jiraBase,
        jiraPrefix || "",
        shopifyEditor,
        shopifyHash
      );

      const themeName = getThemeTitle(projectIdentifier, title, author);
      const ymlComment = getYMLComment(
        themeName,
        devThemeID || "",
        prodThemeID || ""
      );

      // update config YML with comment and theme IDs
      await writeYMLComment(workingDirectory, ymlComment);

      // PR body
      const prFilename: string =
        handlify(`${branchType}-${projectIdentifier}-${title}`) + ".md";
      await fsPromises
        .mkdir(
          path.join(workingDirectory, "text-tools-out", `${projectIdentifier}`),
          {
            recursive: true,
          }
        )
        .then(() =>
          fsPromises.writeFile(
            path.join(
              workingDirectory,
              "text-tools-out",
              `${projectIdentifier}`,
              prFilename
            ),
            prBody
          )
        );
      ora(`Created: ${chalk.cyanBright(prFilename)}`).succeed();

      // Theme name
      const themeFilename: string = handlify(
        `${branchType}-${projectIdentifier}-theme-name.txt`
      );
      await fsPromises.writeFile(
        path.join(
          workingDirectory,
          "text-tools-out",
          `${projectIdentifier}`,
          themeFilename
        ),
        themeName
      );
      ora(`Created: ${chalk.cyanBright(themeFilename)}`).succeed();

      // YML comment
      const ymlCommentFilename: string = handlify(
        `${branchType}-${projectIdentifier}-yml.txt`
      );
      await fsPromises.writeFile(
        path.join(
          workingDirectory,
          "text-tools-out",
          `${projectIdentifier}`,
          ymlCommentFilename
        ),
        ymlComment
      );
      ora(`Created: ${chalk.cyanBright(ymlCommentFilename)}`).succeed();
    }

    // TODO Handle otherwise
  } catch (error) {
    console.error(chalk.redBright("Error: "), error);
  }
};
