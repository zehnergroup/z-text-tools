import { Config, Feature } from "../../types";
import getCurrentFeature from "../../feature/getCurrentFeature";
import getDBAdapter from "../../db/getDBAdapter";
import branchCheckout from "../../branch/branchCheckout";
import getWorkingDirectory from "../../workingDirectory/getWorkingDirectory";

export const command = "checkout";
export const desc = "Checkout or create and cheackout a feature brach";

export const handle = async (argv: any) => {
  const workingDirectory = await getWorkingDirectory(argv);
  const db = await getDBAdapter(workingDirectory);
  const config: Config = db.get("config").value();

  const currentFeature: Feature | null = await getCurrentFeature(
    workingDirectory
  );

  if (currentFeature && config) {
    branchCheckout(workingDirectory, currentFeature, config);
  }

  // TODO handle otherwise
};
