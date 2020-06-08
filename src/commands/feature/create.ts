import isEmpty from "lodash.isempty";
import chalk from "chalk";
import ora from "ora";

import { Feature, Config } from "../../types";
import { getConfig } from "../../config";
import getPRTitle from "../../text/getPRTitle";
import getTicketIdentifier from "../../text/getTicketIdentifier";
import { getBranchTitle } from "../../text";
import { displayFeatures } from "../../tables";

import getDBAdapter from "../../db/getDBAdapter";
import getWorkingDirectory from "../../workingDirectory/getWorkingDirectory";

export const command = "create";
export const desc = "Create new feature";
export const builder = {
  id: {
    describe: "Ticket id",
    demand: true,
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
    let config: Config = db.get("config").value();

    // create config, if not  created
    if (isEmpty(config)) {
      const _config: Config = await getConfig(workingDirectory);
      db.set("config", _config).write();
      config = db.get("config").value();
    }

    const {
      urls: {
        jira: { projectPrefix },
      },
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
    displayFeatures([feature]);
  } catch (error) {
    spinner.fail("Creating new feature\n");
    console.error(chalk.redBright("Error: "), error);
  }
};
