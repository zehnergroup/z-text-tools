import { pipe } from "../utils";

const getStorePreviewURL = (
  label: string = "DEV",
  baseURL: string,
  themeID?: number
): string | null =>
  themeID
    ? `- ${label.toUpperCase()}: ${baseURL}/?preview_theme_id=${themeID}`
    : null;

const withCMSPreviewURLs = (
  shopifyDevBaseURL: string,
  shopifyProdBaseURL: string,
  devThemeID: number | undefined,
  prodThemeID: number | undefined,
  shopifyEditorSuffix?: string,
  shopifyHash?: string
): Function => (body: string): string => {
  const themeSuffix = "admin/themes";

  return `${body}
- CMS preview URL: 
  - DEV: ${shopifyDevBaseURL}/${themeSuffix}/${devThemeID || ""}${
    shopifyEditorSuffix || ""
  }${shopifyHash || ""}
  - PROD: ${shopifyProdBaseURL}/${themeSuffix}/${prodThemeID || ""}${
    shopifyEditorSuffix || ""
  }${shopifyHash || ""}
`;
};

const withStorePreviewURLs = (
  shopifyDevBaseURL: string,
  shopifyProdBaseURL: string,
  devThemeID?: number,
  prodThemeID?: number
): Function => (body: string): string => {
  if (!devThemeID && !prodThemeID) return body;

  const devThemePreview = getStorePreviewURL(
    "DEV",
    shopifyDevBaseURL,
    devThemeID
  );
  const prodThemePreview = getStorePreviewURL(
    "PROD",
    shopifyProdBaseURL,
    prodThemeID
  );
  return `${body}
- Store preview URL: 
  ${devThemePreview}
  ${prodThemePreview}
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
