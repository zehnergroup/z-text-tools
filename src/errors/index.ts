export default {
  config:
    '"config.json" is missing. Add  "config.json" with a valid path to theme directory',
  workingDirectory:
    "Could not find working directory by provided path. Valid working directory path is required.",
  textToolsCofig: '"texttoolsconfig.json" is required to initialize',
  textToolsPR: '"texttoolspr.json" is required to initialize',
  configYML: {
    DNE: "Add confg.yml file to your theme directory",
    readFailed: (e: any) =>
      `Failed reading config.yml file wit error: ${(e && e.message) || e}`,
  },
};
