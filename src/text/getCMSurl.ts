export default (
  label: string = "DEV",
  themeSuffix: string = "admin/themes",
  baseURL: string,
  shopifyEditorSuffix?: string,
  shopifyHash?: string,
  themeID?: number
): string | null =>
  themeID
    ? `- ${label.toUpperCase()}: ${baseURL}/${themeSuffix}/${themeID}${
        shopifyEditorSuffix || ""
      }${shopifyHash || ""}`
    : null;
