export default (
  themeTitle: string,
  devThemeID: number | "",
  prodThemeID: number | ""
): string => `# ${themeTitle} dev: ${devThemeID} prod: ${prodThemeID}`;
