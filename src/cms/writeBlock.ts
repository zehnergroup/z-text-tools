import path from "path";
import fs from "fs";
import ora from "ora";
import chalk from "chalk";
import { Feature } from "../types";

import getBlock from "../text/getBlock";
import getCurrentFeature from "../feature/getCurrentFeature";
import errors from "../errors";

// FS Promises Interface
const fsPromises = fs.promises;

const DIR_NAME = "cms-blocks-templates";

export default async (
  workingDirectory: string,
  blockTemplateFilename: string,
  timesRepeat: number
): Promise<void> => {
  try {
    const currentFeature: Feature | null = await getCurrentFeature(
      workingDirectory
    );

    if (currentFeature) {
      const blockTemplatePath = path.join(
        workingDirectory,
        DIR_NAME,
        blockTemplateFilename
      );

      if (!fs.existsSync(blockTemplatePath)) {
        return Promise.reject(errors.blockTemplate(blockTemplateFilename));
      }

      const blockTemplateBuf = await fsPromises.readFile(
        blockTemplatePath,
        "UTF-8"
      );
      const blockTemplate = JSON.parse(blockTemplateBuf.toString());

      const {
        ticket: { projectIdentifier },
      } = currentFeature;

      const block = getBlock(blockTemplate, timesRepeat);
      const dirPath: string = path.join(
        workingDirectory,
        "text-tools-out",
        `${projectIdentifier}`,
        `blocks`
      );

      // Block Body
      await fsPromises
        .mkdir(dirPath, {
          recursive: true,
        })
        .then(() =>
          fsPromises.writeFile(
            path.join(
              workingDirectory,
              "text-tools-out",
              `${projectIdentifier}`,
              "blocks",
              blockTemplateFilename
            ),
            JSON.stringify(block, null, 2)
          )
        );
      ora(
        `Created: ${chalk.yellowBright(blockTemplateFilename)} in ${chalk.gray(
          dirPath
        )}`
      ).succeed();
    }
  } catch (error) {
    return Promise.reject(error);
  }
};
