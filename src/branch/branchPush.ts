import { Config } from "../types";

import localGit from "../git/localGit";
import { SimpleGit } from "simple-git/promise";
import { Feature } from "../types";
import branchCheckout from "./branchCheckout";

export default async (feature: Feature, config: Config) => {
  try {
    const {
      branch: { name: branchName },
    } = feature;

    let status;

    const git: SimpleGit = await localGit(config.workingDirectory);

    const branches = await git.branch();
    if (branchName && branches.all.indexOf(branchName) === -1) {
      await branchCheckout(feature, config);
    } else {
      branchName && (await git.checkout(branchName));
      status = await git.status();
      console.log(`Switched to ${status.current || "undefined"} branch`);
    }

    await git.push("origin", branchName, { "-u": null });
  } catch (error) {
    console.log(error);
  }
};
