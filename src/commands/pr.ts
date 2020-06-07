import { Config, Feature } from "../types";
import getCurrentFeature from "../feature/getCurrentFeature";
import getDBAdapter from "../db/getDBAdapter";
import pr from "../pr/pr";

export const command = "pr";
export const desc = "Create pull request from the context of current feature";
export const handler = async () => {
  try {
    const db = await getDBAdapter();
    const config: Config = db.get("config").value();

    const currentFeature: Feature | null = await getCurrentFeature();

    if (currentFeature && config) {
      pr(currentFeature, config);
    }

    // TODO handle otherwise
  } catch (error) {
    console.error(error);
  }
};
