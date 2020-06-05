import { Config, Feature } from "../types";

import { getPRBody, getBranchTitle } from "../text";

import { Octokit } from "@octokit/rest";
import getPRTitle from "../text/getPRTitle";

export default async (feature: Feature, config: Config) => {
  try {
    const {
      github: { token: auth, repo, owner, baseBranch },
    } = config;

    const {
      ticket: { id: ticketID },
      themes: { dev: devThemeID, prod: prodThemeID },
      pr: { title: prTitle },
      branch: { type: branchType, name: branchName },
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
      const prTitleWithTicketID = getPRTitle(ticketID, branchType, prTitle);

      await octokit.pulls.create({
        owner,
        repo,
        base: baseBranch || "development",
        head: branchName,
        title: prTitleWithTicketID,
        body: prBody,
        draft: true,
      });

      console.log(`Opened PR for ${branchName} in ${repo}`);
    }
  } catch (error) {
    console.log(error);
  }
};
