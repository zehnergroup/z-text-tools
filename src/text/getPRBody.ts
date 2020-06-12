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
- CMS preview URLs: 
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
- Store preview URLs: 
  ${devThemePreview || ""}
  ${prodThemePreview || ""}
  `;
};

const withFooter = (body: string): string => `${body}

**Verify:**
- [ ] Page matches designs (desktop + responsive)
- [ ] All Theme Editor option variations behave correctly (eg. alignment, content variations, how modules work with AND without content populated)

**Notes**: 
`;

const withJiraTicket = (
  projectIdentifier: string,
  jiraBaseURL: string,
  jiraPrefix: string
): Function => (body: string): string => {
  return `${body}
- Jira Ticket: ${jiraBaseURL}${jiraPrefix}/${projectIdentifier}
`;
};

export default (
  projectIdentifier: string,
  shopifyDevBaseURL: string,
  shopifyProdBaseURL: string,
  devThemeID: number | undefined,
  prodThemeID: number | undefined,
  jiraBaseURL: string,
  jiraPrefix: string,
  shopifyEditorSuffix?: string,
  shopifyHash?: string
) =>
  pipe(
    withJiraTicket(projectIdentifier, jiraBaseURL, jiraPrefix),
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
    ),
    withFooter
  )("**Links:**");
