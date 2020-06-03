import { getConfig, Config } from "./config";

import { getPRBody, getThemeTitle, getBranchTitle } from "./text";

import { Octokit } from "@octokit/rest";
import getPRTitle from "./text/getPRTitle";

(async () => {
  const config: Config = await getConfig();

  const {
    ticket: { id: ticketID },
    themes: { dev: devThemeID, prod: prodThemeID },
    pr: { title: prTitle },
    branch: { type: branchType },
    github: { token: auth, repo, owner },
  } = config;

  const prBody = getPRBody(
    ticketID,
    config.urls.shopify.base.dev,
    config.urls.shopify.base.prod,
    devThemeID,
    prodThemeID,
    config.urls.jira.base,
    config.urls.jira.prefix || "",
    config.urls.shopify.editor,
    config.urls.shopify.hash
  );

  const octokit = new Octokit({
    auth,
  });

  const branchTitle = getBranchTitle(ticketID, prTitle, branchType);
  const prTitleWithTicketID = getPRTitle(ticketID, branchType, prTitle);

  await octokit.pulls.create({
    owner,
    repo,
    base: "development",
    head: branchTitle,
    title: prTitleWithTicketID,
    body: prBody,
    draft: true,
  });

  console.log(`Opened PR for ${branchTitle} in ${repo}`);
})().catch((err) => {
  console.log(err);
});
