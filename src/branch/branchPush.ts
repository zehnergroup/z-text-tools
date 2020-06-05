import { Config } from "../types";

import { getBranchTitle } from "../text";
import localGit from "../git/localGit";
import { SimpleGit } from "simple-git/promise";
import { Feature } from "../types";
import branchCheckout from "./branchCheckout";

export default async (feature: Feature, config: Config) => {
  try {
    const {
      ticket: { id: ticketID },
      pr: { title: prTitle },
      branch: { type: branchType },
    } = feature;

    let status;
    const branchTitle = getBranchTitle(ticketID, prTitle, branchType);

    const git: SimpleGit = await localGit(config.workingDirectory);

    const branches = await git.branch();
    if (branches.all.indexOf(branchTitle) === -1) {
      await branchCheckout(feature, config);
    } else {
      await git.checkout(branchTitle);
      status = await git.status();
      console.log(`Switched to ${status.current || "undefined"} branch`);
    }

    await git.push("origin", branchTitle, { "-u": null });
  } catch (error) {
    console.log(error);
  }
};
