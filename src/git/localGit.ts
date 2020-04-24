import gitP, { SimpleGit, StatusResult } from "simple-git/promise";

export const printStatus = async (git: SimpleGit) => {
  const status: StatusResult = await git.status();
  console.log(status);
};

export default async (workingDirectory: string): Promise<SimpleGit> =>
  gitP(workingDirectory);
