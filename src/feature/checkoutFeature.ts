import ora from "ora";

import { Feature, Config } from "../types";
import getFeatureByID from "./getFeatureByID";
import errors from "../errors";
import writeYMLThemeIDs from "../config/writeYMLThemeIDs";
import getDBAdapter from "../db/getDBAdapter";
import branchCheckout from "../branch/branchCheckout";
import getConfigFromDB from "../db/getConfigFromDB";
import getFeatureByBranchName from "./getFeatureByBranchName";

export default async (
  workingDirectory: string,
  id: number | null,
  branchName?: string
): Promise<void> => {
  try {
    if (!id && !branchName) {
      return Promise.reject(
        new Error("Please provide feature id or branch name")
      );
    }
    const feature: Feature | null = id
      ? await getFeatureByID(workingDirectory, id)
      : branchName
      ? await getFeatureByBranchName(workingDirectory, branchName)
      : null;

    if (!feature) {
      return Promise.reject(new Error(errors.feature(id || branchName || "")));
    }

    const {
      themes: { dev: devThemeID, prod: prodThemeID },
      ticket: { projectIdentifier },
    } = feature;

    // update config.YML
    await writeYMLThemeIDs(workingDirectory, devThemeID, prodThemeID);
    ora(
      `Updated config.yml with  dev: ${devThemeID}, prod: ${prodThemeID} theme IDs`
    ).succeed();

    // set current feature
    const db = await getDBAdapter(workingDirectory);
    db.set("currentFeature", id).write();
    ora(`Set current feature to ${projectIdentifier}`).succeed();

    const config: Config = await getConfigFromDB(workingDirectory, db);
    // checkout feature branch
    await branchCheckout(workingDirectory, feature, config);

    // TODO run slate - for now slate conflicts with gulp 3, prob. should just use theme kit
    // const spinnerSlate = ora(`Running slate for dev theme`).start();

    /*
    cp.exec("slate start", { cwd: workingDirectory }, (err, stdout, stderr) => {
      spinnerSlate.stopAndPersist();

      if (err) {
        console.error(`exec error: ${err}`);
        return;
      }
      console.log(stdout);
    });

    */
  } catch (error) {
    return Promise.reject(error);
  }
};
