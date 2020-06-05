import * as yargs from "yargs";
import checkoutFeature from "./feature/checkoutFeature";

(async () => {
  try {
    let args = yargs
      .describe("id", "Provide ticket id")
      .usage("Usage: $0 -id [num]")
      .demandOption(["id"])
      .help("help").argv;

    const id: number = <number>args.id;

    if (id) {
      checkoutFeature(id);
    }
  } catch (error) {
    // no config error
  }
})();
