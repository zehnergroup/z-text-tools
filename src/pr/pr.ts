import ora from "ora";
import { Config, Feature } from "../types";

import { getPRBody } from "../text";

import { Octokit } from "@octokit/rest";
import errors from "../errors";

export default async (feature: Feature, config: Config): Promise<void> => {
  try {
    const {
      github: { token: auth, repo, owner, baseBranch },
    } = config;

    const {
      ticket: { id: ticketID },
      themes: { dev: devThemeID, prod: prodThemeID },
      pr: { title: prTitle },
      branch: { name: branchName },
    } = feature;

    const prBody = getPRBody(
      ticketID,
      config.urls.shopify.base.dev,
      config.urls.shopify.base.prod,
      devThemeID || "",
      prodThemeID || "",
      config.urls.jira.base,
      config.urls.jira.prefix || "",
      config.urls.shopify.editor,
      config.urls.shopify.hash
    );

    const octokit = new Octokit({
      auth,
    });

    if (branchName) {
      await octokit.pulls.create({
        owner,
        repo,
        base: baseBranch || "development",
        head: branchName,
        title: prTitle,
        body: prBody,
        draft: true,
      });

      ora(`Opened draft PR for ${branchName} in ${repo}`).succeed();
      return Promise.resolve();
    }

    return Promise.reject(errors.branchName);
  } catch (error) {
    return Promise.reject(error);
  }
};
