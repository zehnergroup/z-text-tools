import ora from "ora";
import chalk from "chalk";

import getDBAdapter from "../db/getDBAdapter";
import getWorkingDirectory from "../workingDirectory/getWorkingDirectory";
import getConfigFromDB from "../db/getConfigFromDB";

export const command = "init";
export const desc = "Initalizes Z-Tools in working directory";

export const handler = async (argv: any) => {
  const workingDirectory = await getWorkingDirectory(argv);
  const spinnerWD = ora(
    `Initializing Z-Tools in ${chalk.blueBright(workingDirectory)}`
  ).start();
  try {
    const db = await getDBAdapter(workingDirectory);
    await getConfigFromDB(workingDirectory, db);
    ora(`Created texttoolsdb.json`).start().succeed();
    // TODO update .gitignore
    spinnerWD.succeed(
      `Initialized Z-Tools in ${chalk.blueBright(workingDirectory)}`
    );
  } catch (error) {
    spinnerWD.fail(
      `Initializing Z-Tools in ${chalk.blueBright(workingDirectory)}`
    );
    console.error(chalk.redBright("Error: "), error);
  }
};
