export const command = "branch";
export const desc = "Create, checkout, push to remote a feature branch";
export const builder = (yargs: any) => {
  yargs.commandDir("branch").demandCommand();
};
