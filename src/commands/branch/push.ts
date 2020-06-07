import { Config, Feature } from "../../types";
import getCurrentFeature from "../../feature/getCurrentFeature";
import getDBAdapter from "../../db/getDBAdapter";
import branchPush from "../../branch/branchPush";

export const command = "push";
export const desc = "Push feature branch to remote";
export const handler = async () => {
  try {
    const db = await getDBAdapter();
    const config: Config = db.get("config").value();

    const currentFeature: Feature | null = await getCurrentFeature();

    if (currentFeature && config) {
      branchPush(currentFeature, config);
    }
  } catch (error) {
    console.log(error);
  }
};
