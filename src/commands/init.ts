import isEmpty from "lodash.isempty";
import ora from "ora";
import chalk from "chalk";

import { Config } from "../types";
import { getConfig } from "../config";
import getDBAdapter from "../db/getDBAdapter";
import getWorkingDirectory from "../workingDirectory/getWorkingDirectory";

export const command = "init";
export const desc = "Initalizes Z-Tools in working directory";

export const handler = async (argv: any) => {
  const workingDirectory = await getWorkingDirectory(argv);
  const spinnerWD = ora(
    `Initializing Z-Tools in ${chalk.blueBright(workingDirectory)}`
  ).start();
  try {
    const db = await getDBAdapter(workingDirectory);
    const config: Config = db.get("config").value();

    if (isEmpty(config)) {
      const _config: Config = await getConfig(workingDirectory);
      await db.set("config", _config).write();
    }
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
