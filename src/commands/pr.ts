import { Config, Feature } from "../types";
import getCurrentFeature from "../feature/getCurrentFeature";
import getDBAdapter from "../db/getDBAdapter";
import pr from "../pr/pr";
import getWorkingDirectory from "../workingDirectory/getWorkingDirectory";
import getConfigFromDB from "../db/getConfigFromDB";
import comment from "../jira/comment";
import updatePR from "../pr/updatePR";

export const command = "pr";
export const desc = "Create pull request from the context of current feature";

export const handler = async (argv: any) => {
  try {
    const workingDirectory = await getWorkingDirectory(argv);
    const db = await getDBAdapter(workingDirectory);
    const config: Config = await getConfigFromDB(workingDirectory, db);
    const currentFeature: Feature | null = await getCurrentFeature(
      workingDirectory
    );

    if (currentFeature && config) {
      const prData = await pr(currentFeature, config);
      const { url, number } = prData;

      await updatePR(workingDirectory, { ...currentFeature.pr, url, number });

      // TODO post JIRA Comment
      // TODO add boolean flag if want to create Jira comment as well
      // await comment(currentFeature, config);
    }

    // TODO handle otherwise
  } catch (error) {
    console.error(error);
  }
};
