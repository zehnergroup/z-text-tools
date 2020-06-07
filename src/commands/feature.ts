export const command = "feature";
export const desc = "Create, list, checkout features";
export const builder = (yargs: any) => {
  yargs.commandDir("feature").demandCommand();
};
