export default {
  config:
    '"config.json" is missing. Add  "config.json" with a valid path to theme directory',
  workingDirectory: (path: string) =>
    `Could not find working directory by ${path} path. Valid working directory path is required.`,
  textToolsCofig: '"texttoolsconfig.json" is required to initialize',
  textToolsPR: '"texttoolspr.json" is required to initialize',
  configYML: {
    DNE: "Add confg.yml file to your theme directory",
    readFailed: (e: any) =>
      `Failed reading config.yml file wit error: ${(e && e.message) || e}`,
  },
  configuration: "Configuration is missing. Run init script to setup the tool",
  feature: (id: number) =>
    `Feature by ticket ID ${id} is not found. Run feature-create to create one.`,
  featureCheckout:
    "No feature has been checked out. Run feature --id=<featureID> to select a feature.",
};
