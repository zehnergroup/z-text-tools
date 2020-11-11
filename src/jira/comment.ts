import { Feature, Config } from "../types";
import getJiraCommentBody from "../text/getJiraCommentBody";
import fetch from "node-fetch";

export default async (
  currentFeature: Feature,
  config: Config,
  prNumber?: number
): Promise<any> => {
  try {
    const {
      themes: { dev: devThemeID, prod: prodThemeID },
      ticket: { projectIdentifier },
      pr: { number: prNumberFromFeature },
    } = currentFeature;

    const {
      shopify: {
        base: { dev: shopifyDevBaseURL, prod: shopifyProdBaseURL },
        editor,
        hash,
      },
      jira: { base: baseJiraURL, token, email },
      github: { owner, repo },
    } = config;

    if (prNumberFromFeature || prNumber) {
      const jiraCommentBody: string = getJiraCommentBody(
        prNumberFromFeature || prNumber || 0,
        owner,
        repo,
        shopifyDevBaseURL,
        shopifyProdBaseURL,
        devThemeID,
        prodThemeID,
        editor,
        hash
      );
      const bodyData = {
        body: jiraCommentBody,
      };

      return fetch(
        `${baseJiraURL}/rest/api/2/issue/${projectIdentifier}/comment`,
        {
          method: "POST",
          headers: {
            ["Authorization"]: `Basic ${Buffer.from(
              `${email}:${token}`
            ).toString("base64")}`,
            ["Accept"]: "application/json",
            ["Content-Type"]: "application/json",
          },
          body: JSON.stringify(bodyData),
        }
      )
        .then((response) => {
          return response.text();
        })
        .catch((err) => console.error(err));
    }

    // TODO handle if don't have PR number
    return Promise.resolve();
  } catch (error) {
    console.error(error);
  }
};
