import path from "path";
import fs from "fs";
import chalk from "chalk";

import getWorkingDirectory from "../../workingDirectory/getWorkingDirectory";
import writeBlock from "../../cms/writeBlock";

export const command = "block";
export const desc = `Generate block from template(s).
Templates expected in ${chalk.yellowBright("cms-blocks-templates")} folder.`;

const DIR_NAME = "cms-blocks-templates";

export const builder = {
  template: {
    alias: "t",
    describe: "Template name (without .json)",
    demand: false,
  },
  all: {
    describe: "Generate blocks from all templates",
    alias: "a",
    demand: false,
  },
  repeat: {
    describe: "Number of times to repeat repeated settings",
    alias: "r",
    default: 1,
    demand: false,
  },
};

export const handler = async (args: any) => {
  try {
    const workingDirectory = await getWorkingDirectory(args);
    const timesRepeat: number = args.repeat;

    if (args.all) {
      const files = await fs.promises.readdir(
        path.join(workingDirectory, DIR_NAME)
      );

      for (const file of files) {
        writeBlock(workingDirectory, file, timesRepeat);
      }

      return;
    }

    if (args.template) {
      const blockTemplateFilename: string = args.template + ".json";
      writeBlock(workingDirectory, blockTemplateFilename, timesRepeat);

      return;
    }

    throw new Error(
      "Please provide either -all or --template arguments to generate blocks"
    );
  } catch (error) {
    console.error(chalk.redBright("Error: "), error);
  }
};
