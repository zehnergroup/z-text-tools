import { Feature, Config } from "../types";

import { getBranchTitle } from "../text";
import localGit from "../git/localGit";
import { SimpleGit } from "simple-git/promise";

export default async (feature: Feature, config: Config): Promise<void> => {
  try {
    const {
      branch: { name: branchName },
    } = feature;

    const {
      workingDirectory,
      github: { baseBranch },
    } = config;

    let status;

    const git: SimpleGit = await localGit(workingDirectory);
    // checkout develop by default
    await git.checkout(baseBranch || "development");

    status = await git.status();
    console.log(`Switched to ${status.current || "undefined"} branch`);

    const branches = await git.branch();
    if (branchName && branches.all.indexOf(branchName) === -1) {
      await git.checkoutLocalBranch(branchName);
      status = await git.status();
      console.log(
        `Created and switched to ${status.current || "undefined"} branch`
      );
    } else {
      branchName && (await git.checkout(branchName));
      status = await git.status();
      console.log(`Switched to ${status.current || "undefined"} branch`);
    }
  } catch (error) {
    console.log(error);
  }
};
