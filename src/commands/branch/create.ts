import { Config, Feature } from "../../types";
import getCurrentFeature from "../../feature/getCurrentFeature";
import getDBAdapter from "../../db/getDBAdapter";
import branchCheckout from "../../branch/branchCheckout";

export const command = "checkout";
export const desc = "Checkout or create and cheackout a feature brach";
export const handle = async () => {
  const db = await getDBAdapter();
  const config: Config = db.get("config").value();

  const currentFeature: Feature | null = await getCurrentFeature();

  if (currentFeature && config) {
    branchCheckout(currentFeature, config);
  }

  // TODO handle otherwise
};
