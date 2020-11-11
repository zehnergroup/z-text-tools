export const command = "jira";
export const desc = "Update Jira issue from the context of the current feature";
export const builder = (yargs: any) => {
  yargs.commandDir("jira").demandCommand();
};
