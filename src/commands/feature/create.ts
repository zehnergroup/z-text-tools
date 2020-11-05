import ora from "ora";
import chalk from "chalk";

import { Feature, Config } from "../../types";
import getPRTitle from "../../text/getPRTitle";
import getTicketIdentifier from "../../text/getTicketIdentifier";
import { getBranchTitle } from "../../text";
import { displayFeatures } from "../../tables";

import getDBAdapter from "../../db/getDBAdapter";
import getWorkingDirectory from "../../workingDirectory/getWorkingDirectory";
import getConfigFromDB from "../../db/getConfigFromDB";

export const command = "create";
export const desc = "Create new feature";
export const builder = {
  id: {
    describe: "Ticket id",
    demand: true,
    alias: 'i'
  },
  title: {
    describe: "Descriptive title to a feature (up to 5 words)",
    demand: true,
  },
  ["theme-dev"]: {
    describe: "Development theme id",
    demand: false,
  },
  ["theme-prod"]: {
    describe: "Production theme id",
    demand: false,
  },
  ["branch-type"]: {
    describe: "Branch type, example: feature | bugfix",
    demand: false,
  },
};
export const handler = async (args: any) => {
  const spinner = ora("Creating  new feature ").start();
  try {
    const workingDirectory = await getWorkingDirectory(args);
    const db = await getDBAdapter(workingDirectory);
    const config: Config = await getConfigFromDB(workingDirectory, db);
    const currentFeatureID: number | null = db.get("currentFeature").value();

    const {
      jira: { projectPrefix },
    } = config;

    const branchType = args.branchType || "feature";

    // TODO
    // if theme-dev and themme-prod are not provided attempt to extract from config.yml
    if (!args.themeDev) {
    }

    const themeDev: number = args.themeDev;

    if (!args.themeProd) {
    }

    const themeProd: number = args.themeProd;

    const ticketIdentifier = getTicketIdentifier(args.id, projectPrefix);
    const prTitle: string = getPRTitle(
      ticketIdentifier,
      branchType,
      args.title
    );

    const branchName = getBranchTitle(ticketIdentifier, args.title, branchType);

    const feature: Feature = {
      title: args.title,
      ticket: {
        id: args.id,
        projectIdentifier: ticketIdentifier,
      },
      themes: {
        dev: themeDev,
        prod: themeProd,
      },
      branch: {
        type: branchType,
        name: branchName,
      },
      pr: {
        title: prTitle,
      },
    };

    db.get("features").push(feature).write();
    spinner.succeed("Created new feature\n");
    displayFeatures([feature], currentFeatureID);
  } catch (error) {
    spinner.fail("Creating new feature\n");
    console.error(chalk.redBright("Error: "), error);
  }
};
