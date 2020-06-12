export default (
  label: string,
  baseURL: string,
  themeID?: number
): string | null =>
  themeID
    ? `- ${label.toUpperCase()}: ${baseURL}/?preview_theme_id=${themeID}`
    : null;
