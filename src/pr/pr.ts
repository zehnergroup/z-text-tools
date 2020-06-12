import ora from "ora";
import { Config, Feature } from "../types";

import { getPRBody } from "../text";

import { Octokit } from "@octokit/rest";
import errors from "../errors";

export default async (feature: Feature, config: Config): Promise<any> => {
  try {
    const {
      github: { token: auth, repo, owner, baseBranch },
      shopify: {
        base: { dev: shopifyDevBase, prod: shopifyProdBase },
        editor: shopifyEditor,
        hash: shopifyHash,
      },
      jira: { base: jiraBase, prefix: jiraPrefix },
    } = config;

    const {
      ticket: { projectIdentifier },
      themes: { dev: devThemeID, prod: prodThemeID },
      pr: { title: prTitle },
      branch: { name: branchName },
    } = feature;

    const prBody = getPRBody(
      projectIdentifier,
      shopifyDevBase,
      shopifyProdBase,
      devThemeID,
      prodThemeID,
      jiraBase,
      jiraPrefix || "",
      shopifyEditor,
      shopifyHash
    );

    const octokit = new Octokit({
      auth,
    });

    if (branchName) {
      const prData = (
        await octokit.pulls.create({
          owner,
          repo,
          base: baseBranch || "development",
          head: branchName,
          title: prTitle,
          body: prBody,
          draft: true,
        })
      ).data;
      ora(`Opened draft PR for ${branchName} in ${repo}`).succeed();
      return Promise.resolve(prData);
    }

    return Promise.reject(errors.branchName);
  } catch (error) {
    return Promise.reject(error);
  }
};
