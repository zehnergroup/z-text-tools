export const command = "cms";
export const desc = "Generate, update and watch cms pages schemas and blocks";
export const builder = (yargs: any) => {
  yargs.commandDir("cms").demandCommand();
};
