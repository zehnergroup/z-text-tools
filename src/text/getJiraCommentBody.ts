import { pipe } from "../utils";
import getPreviewURL from "./getPreviewURL";
import getCMSurl from "./getCMSurl";

const withCMSPreviewURLs = (
  shopifyDevBaseURL: string,
  shopifyProdBaseURL: string,
  devThemeID: number | undefined,
  prodThemeID: number | undefined,
  shopifyEditorSuffix?: string,
  shopifyHash?: string
): Function => (body: string): string => {
  const devThemeCMS = getCMSurl(
    "DEV",
    "admin/themes",
    shopifyDevBaseURL,
    shopifyEditorSuffix,
    shopifyHash,
    devThemeID
  );
  const prodThemeCMS = getCMSurl(
    "PROD",
    "admin/themes",
    shopifyProdBaseURL,
    shopifyEditorSuffix,
    shopifyHash,
    prodThemeID
  );

  return `${body}
*CMS preview URLs*: 
  ${devThemeCMS || ""}
  ${prodThemeCMS || ""}
`;
};

const withStorePreviewURLs = (
  shopifyDevBaseURL: string,
  shopifyProdBaseURL: string,
  devThemeID?: number,
  prodThemeID?: number
): Function => (body: string): string => {
  if (!devThemeID && !prodThemeID) return body;

  const devThemePreview = getPreviewURL("DEV", shopifyDevBaseURL, devThemeID);
  const prodThemePreview = getPreviewURL(
    "PROD",
    shopifyProdBaseURL,
    prodThemeID
  );
  return `${body}
*Store preview URLs*: 
  ${devThemePreview || ""}
  ${prodThemePreview || ""}
  `;
};

const withPullRequest = (
  prNumber: number,
  owner: string,
  repo: string
): Function => (body: string): string => {
  return `${body}
*Pull Request:* 
 - https://github.com/${owner}/${repo}/pull/${prNumber}
`;
};

export default (
  prNumber: number,
  githubOwner: string,
  repo: string,
  shopifyDevBaseURL: string,
  shopifyProdBaseURL: string,
  devThemeID: number | undefined,
  prodThemeID: number | undefined,
  shopifyEditorSuffix?: string,
  shopifyHash?: string
) =>
  pipe(
    withPullRequest(prNumber, githubOwner, repo),
    withCMSPreviewURLs(
      shopifyDevBaseURL,
      shopifyProdBaseURL,
      devThemeID,
      prodThemeID,
      shopifyEditorSuffix,
      shopifyHash
    ),
    withStorePreviewURLs(
      shopifyDevBaseURL,
      shopifyProdBaseURL,
      devThemeID,
      prodThemeID
    )
  )("h3. Links:");
