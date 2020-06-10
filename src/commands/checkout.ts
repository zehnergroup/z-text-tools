import chalk from "chalk";
import ora from "ora";
import checkoutFeature from "../feature/checkoutFeature";
import getWorkingDirectory from "../workingDirectory/getWorkingDirectory";

export const command = "checkout";
export const desc = "Checkout feature";
export const builder = {
  id: {
    describe: "Ticket id",
    demand: true,
    alias: "i",
  },
};

export const handler = async (argv: any) => {
  try {
    const workingDirectory = await getWorkingDirectory(argv);
    const id: number = <number>argv.id;

    if (id) {
      checkoutFeature(workingDirectory, id);
    }
  } catch (error) {
    ora(`Failed to checkout feature branch\n`).fail();
    console.error(chalk.redBright("Error: "), error);
  }
};
