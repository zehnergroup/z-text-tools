import isEmpty from "lodash.isempty";
import ora from "ora";
import chalk from "chalk";

import { Config } from "../types";
import { getConfig } from "../config";
import getDBAdapter from "../db/getDBAdapter";
import getLocalDBAdapter from "../db/getLocalDBAdapter";

export const command = "init";
export const desc = "Initalizes Z-Tools in working directory";

export const builder = {
  path: {
    alias: "p",
    describe: "Explicitly set a working directory",
    demand: false,
  },
};

export const handler = async (argv: any) => {
  const workingDirectory = argv.path || process.cwd();
  const spinner = ora(
    `Initializing Z-Tools in ${chalk.blueBright(workingDirectory)}`
  ).start();
  try {
    if (argv.path) {
      const localDB = await getLocalDBAdapter();
      await localDB.set("workingDirectory", argv.path).write();
    } else {
      // purge any existing working directory
      const localDB = await getLocalDBAdapter();
      await localDB.set("workingDirectory", null).write();
    }

    const db = await getDBAdapter();
    const config: Config = db.get("config").value();

    if (isEmpty(config)) {
      const _config: Config = await getConfig();
      await db.set("config", _config).write();
    }

    spinner.succeed(
      `Initialized Z-Tools in ${chalk.blueBright(workingDirectory)}`
    );
  } catch (error) {
    console.error(error);
  }
};
