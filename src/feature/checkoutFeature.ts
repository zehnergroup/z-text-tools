import { Feature, Config } from "../types";
import getFeatureByID from "./getFeatureByID";
import errors from "../errors";
import writeYMLThemeIDs from "../config/writeYMLThemeIDs";
import getDBAdapter from "../db/getDBAdapter";
import branchCheckout from "../branch/branchCheckout";
import cp from "child_process";

export default async (workingDirectory: string, id: number): Promise<void> => {
  try {
    const feature: Feature | null = await getFeatureByID(workingDirectory, id);
    if (!feature) {
      return Promise.reject(new Error(errors.feature(id)));
    }

    const {
      themes: { dev: devThemeID, prod: prodThemeID },
    } = feature;

    // update config.YML
    await writeYMLThemeIDs(workingDirectory, devThemeID, prodThemeID);

    // set current feature
    const db = await getDBAdapter(workingDirectory);
    db.set("currentFeature", id).write();

    const config: Config = db.get("config").value();
    // checkout feature branch
    branchCheckout(workingDirectory, feature, config);

    // run slate
    cp.exec("slate start", { cwd: workingDirectory }, () => {});
  } catch (error) {
    return Promise.reject(error);
  }
};
