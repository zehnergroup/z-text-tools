import { pipe } from "../utils";

const withCMSPreviewURLs = (
  shopifyDevBaseURL: string,
  shopifyProdBaseURL: string,
  devThemeID: number | "",
  prodThemeID: number | "",
  shopifyEditorSuffix?: string,
  shopifyHash?: string
): Function => (body: string): string => {
  const themeSuffix = "admin/themes";

  return `${body}
- CMS preview URL: 
  - DEV: ${shopifyDevBaseURL}/${themeSuffix}/${devThemeID}${
    shopifyEditorSuffix || ""
  }${shopifyHash || ""}
  - PROD: ${shopifyProdBaseURL}/${themeSuffix}/${prodThemeID}${
    shopifyEditorSuffix || ""
  }${shopifyHash || ""}
`;
};

const withStorePreviewURLs = (
  shopifyDevBaseURL: string,
  shopifyProdBaseURL: string,
  devThemeID: number | "",
  prodThemeID: number | ""
): Function => (body: string): string => `${body}
- Store preview URL: 
  - DEV: ${shopifyDevBaseURL}/?preview_theme_id=${devThemeID}
  - PROD: ${shopifyProdBaseURL}/?preview_theme_id=${prodThemeID}
`;

const withFooter = (body: string): string => `${body}

**Verify:**
- [ ] Page matches designs (desktop + responsive)
- [ ] All Theme Editor option variations behave correctly (eg. alignment, content variations, how modules work with AND without content populated)

**Notes**: 
`;

const withJiraTicket = (
  ticketID: number,
  jiraBaseURL: string,
  jiraPrefix: string
): Function => (body: string): string => {
  return `${body}
- Jira Ticket: ${jiraBaseURL}${jiraPrefix}/${ticketID}
`;
};

export default (
  ticketID: number,
  shopifyDevBaseURL: string,
  shopifyProdBaseURL: string,
  devThemeID: number | "",
  prodThemeID: number | "",
  jiraBaseURL: string,
  jiraPrefix: string,
  shopifyEditorSuffix?: string,
  shopifyHash?: string
) =>
  pipe(
    withJiraTicket(ticketID, jiraBaseURL, jiraPrefix),
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
