import ora from "ora";
import chalk from "chalk";

import { Config, Feature } from "../../types";
import getCurrentFeature from "../../feature/getCurrentFeature";
import getDBAdapter from "../../db/getDBAdapter";
import branchPush from "../../branch/branchPush";
import getWorkingDirectory from "../../workingDirectory/getWorkingDirectory";

export const command = "push";
export const desc = "Push feature branch to remote";

export const handler = async (argv: any) => {
  const spinner = ora("");
  try {
    const workingDirectory = await getWorkingDirectory(argv);
    const db = await getDBAdapter(workingDirectory);
    const config: Config = db.get("config").value();

    const currentFeature: Feature | null = await getCurrentFeature(
      workingDirectory
    );

    if (currentFeature && config) {
      const {
        branch: { name: branchName },
      } = currentFeature;
      spinner.start(`Pushing ${branchName} to remote \n`);
      await branchPush(workingDirectory, currentFeature, config);
      spinner.succeed(`Pushed ${branchName} to remote`);
    }
  } catch (error) {
    spinner.fail("Creating new feature\n");
    console.error(chalk.redBright("Error: "), error);
  }
};
