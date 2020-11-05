import ora from "ora";
import chalk from "chalk";

import { Config, Feature } from "../../types";
import getCurrentFeature from "../../feature/getCurrentFeature";
import getDBAdapter from "../../db/getDBAdapter";
import getWorkingDirectory from "../../workingDirectory/getWorkingDirectory";
import getConfigFromDB from "../../db/getConfigFromDB";
import comment from "../../jira/comment";

export const command = "comment";
export const desc = "Add comment to the issue";
export const builder = {
  pr: {
    describe: "Pull request number",
    demand: false,
  },
};

export const handler = async (argv: any) => {
  const spinner = ora("");
  try {
    const workingDirectory = await getWorkingDirectory(argv);
    const db = await getDBAdapter(workingDirectory);
    const config: Config = await getConfigFromDB(workingDirectory, db);

    const currentFeature: Feature | null = await getCurrentFeature(
      workingDirectory
    );

    if (currentFeature && config) {
      const {
        ticket: { projectIdentifier },
      } = currentFeature;
      spinner.start(`Creating Jira comment for ${projectIdentifier}`);
      const commentData = await comment(currentFeature, config, argv.pr);
      const parsed = JSON.parse(commentData);
      spinner.succeed(`Created Jira comment for ${projectIdentifier}\n`);
      console.log(`URL: ${chalk.cyanBright(parsed.self)}`);
    }
  } catch (error) {
    spinner.fail("Creating Jira comment\n");
    console.error(chalk.redBright("Error: "), error);
  }
};
