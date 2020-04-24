export default (
  themeTitle: string,
  devThemeID: string,
  prodThemeID: string
): string => `# ${themeTitle} dev: ${devThemeID} prod: ${prodThemeID}`;
