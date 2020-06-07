import isEmpty from "lodash.isempty";

import { Feature, Config } from "../../types";
import { getConfig } from "../../config";
import getPRTitle from "../../text/getPRTitle";
import getTicketIdentifier from "../../text/getTicketIdentifier";
import { getBranchTitle } from "../../text";
import getDBAdapter from "../../db/getDBAdapter";

export const command = "create";
export const desc = "Create new feature";
export const builder = {
  id: {
    describe: "Provide ticket id",
    demand: true,
  },
  title: {
    describe: "Give descriptive title to a feature",
    demand: true,
  },
  ["theme-dev"]: {
    decribe: "Development theme id",
    demand: false,
  },
  ["theme-prod"]: {
    decribe: "Production theme id",
    demand: false,
  },
  ["branch-type"]: {
    decribe: "Branch type, example: feature | bugfix",
    demand: false,
  },
};
export const handler = async (args: any) => {
  try {
    console.log(JSON.stringify(args));

    const db = await getDBAdapter();
    let config: Config = db.get("config").value();

    // create config, if not  created
    if (isEmpty(config)) {
      const _config: Config = await getConfig();
      db.set("config", _config).write();
      config = db.get("config").value();
    }

    const {
      urls: {
        jira: { projectPrefix },
      },
    } = config;

    const branchType = args.branchType || "feature";

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
      ticket: {
        id: args.id,
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

    console.log("feature", feature);
  } catch (error) {
    console.error(error);
  }
};
