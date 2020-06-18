import chalk from "chalk";
import ora from "ora";
import checkoutFeature from "../feature/checkoutFeature";
import getWorkingDirectory from "../workingDirectory/getWorkingDirectory";

export const command = "checkout";
export const desc = "Checkout feature";
export const builder = {
  id: {
    describe: "Ticket id",
    demand: false,
    alias: "i",
  },
  branch: {
    describe: "Branch",
    demand: false,
    alias: "b",
  },
};

export const handler = async (argv: any) => {
  try {
    const workingDirectory = await getWorkingDirectory(argv);
    const id: number = <number>argv.id;
    const branch: string = <string>argv.branch;

    if (id) {
      checkoutFeature(workingDirectory, id);
    }

    if (branch) {
      checkoutFeature(workingDirectory, null, branch);
    }
  } catch (error) {
    ora(`Failed to checkout feature branch\n`).fail();
    console.error(chalk.redBright("Error: "), error);
  }
};
