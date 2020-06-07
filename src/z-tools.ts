import * as yargs from "yargs";

try {
  yargs
    .commandDir("commands")
    .demandCommand()
    .help("help", "Show help for a command")
    .recommendCommands()
    .scriptName("z-tools")
    .strict()
    .wrap(yargs.terminalWidth())
    .parse();
} catch (error) {
  console.error(error);
  process.exit(0);
}
