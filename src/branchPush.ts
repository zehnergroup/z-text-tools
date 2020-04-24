import { getConfig, Config } from "./config";

import { getBranchTitle } from "./text";
import localGit, { printStatus } from "./git/localGit";
import { SimpleGit } from "simple-git/promise";

(async () => {
  const config: Config = await getConfig();

  const {
    ticket: { id: ticketID },
    pr: { title: prTitle },
    branch: { type: branchType },
    github: { repo, owner },
  } = config;

  let status;
  const branchTitle = getBranchTitle(ticketID, prTitle, branchType);

  console.log(branchTitle);

  const git: SimpleGit = await localGit(config.workingDirectory);

  const branches = await git.branch();
  if (branches.all.indexOf(branchTitle) === -1) {
    // checkout develop by default
    await git.checkout("develop");
    status = await git.status();
    console.log(`Switched to ${status.current || "undefined"} branch`);
    await git.checkoutLocalBranch(branchTitle);
    status = await git.status();
    console.log(
      `Created and switched to ${status.current || "undefined"} branch`
    );
  } else {
    await git.checkout(branchTitle);
    status = await git.status();
    console.log(`Switched to ${status.current || "undefined"} branch`);
  }

  // await git.addRemote("origin", repo);
  await git.push("origin", branchTitle, { "-u": null });
})().catch((err) => {
  console.log(err);
});
