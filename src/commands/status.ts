import chalk from "chalk";
import { Feature } from "../types";
import { displayFeatures } from "../tables";

import getDBAdapter from "../db/getDBAdapter";
import getWorkingDirectory from "../workingDirectory/getWorkingDirectory";

export const command = "status";
export const desc = "Print current status";

export const handler = async (args: any) => {
  try {
    const workingDirectory = await getWorkingDirectory(args);
    const db = await getDBAdapter(workingDirectory);
    const features: Feature[] = db.get("features").value();

    if (!features || !features.length) {
      console.log(
        chalk.yellow(`No features found in ${chalk.gray(workingDirectory)}`)
      );
      console.log(`Use ${chalk.cyanBright("z-tools")} feature create <args>\n`);
    } else {
      console.log(`Available features\n`);
      displayFeatures(features, db.get("currentFeature").value());
    }
  } catch (error) {
    console.error(chalk.redBright("Error: "), error);
  }
};
