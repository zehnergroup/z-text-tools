import yargs from "yargs";
import chalk from "chalk";

const VERSION = require("../package.json").version;

try {
  yargs
    .commandDir("commands")
    .demandCommand()
    .help("help", "Show help for a command")
    .usage(`Usage:\n${chalk.cyanBright("$0")} <command> [args]`)
    .recommendCommands()
    .scriptName("z-tools")
    .strict()
    .version("version", "Show version number", VERSION)
    .wrap(yargs.terminalWidth())
    .parse();
} catch (error) {
  console.error(error);
  process.exit(0);
}
