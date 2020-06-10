import ora from "ora";
import { Feature, Config } from "../types";

import localGit from "../git/localGit";
import { SimpleGit } from "simple-git/promise";

export default async (
  workingDirectory: string,
  feature: Feature,
  config: Config
): Promise<void> => {
  try {
    const {
      branch: { name: branchName },
    } = feature;

    const {
      github: { baseBranch },
    } = config;

    let status;

    const git: SimpleGit = await localGit(workingDirectory);
    // checkout develop by default
    await git.checkout(baseBranch || "development");

    status = await git.status();
    ora(`Switched to ${status.current || "undefined"} branch`).succeed();

    const branches = await git.branch();
    if (branchName && branches.all.indexOf(branchName) === -1) {
      await git.checkoutLocalBranch(branchName);
      status = await git.status();
      ora(
        `Created and switched to ${status.current || "undefined"} branch`
      ).succeed();
    } else {
      branchName && (await git.checkout(branchName));
      status = await git.status();
      ora(`Switched to ${status.current || "undefined"} branch`).succeed();
    }
  } catch (error) {
    return Promise.reject(error);
  }
};
