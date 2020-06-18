import chalk from "chalk";
import { Feature, Config } from "../types";

import getDBAdapter from "../db/getDBAdapter";
import getWorkingDirectory from "../workingDirectory/getWorkingDirectory";
import getCurrentFeature from "../feature/getCurrentFeature";
import getConfigFromDB from "../db/getConfigFromDB";
import getPreviewURL from "../text/getPreviewURL";

export const command = "urls";
export const desc = "Prints preview URLs to the console";

export const handler = async (args: any) => {
  try {
    const workingDirectory = await getWorkingDirectory(args);
    const db = await getDBAdapter(workingDirectory);
    const config: Config = await getConfigFromDB(workingDirectory, db);
    const currentFeature: Feature | null = await getCurrentFeature(
      workingDirectory
    );

    if (currentFeature && config) {
      const {
        themes: { dev: devThemeID, prod: prodThemeID },
      } = currentFeature;

      const {
        shopify: {
          base: { dev: shopifyDevBaseURL, prod: shopifyProdBaseURL },
        },
      } = config;

      const devThemePreview = getPreviewURL(
        "DEV",
        shopifyDevBaseURL,
        devThemeID
      );
      const prodThemePreview = getPreviewURL(
        "PROD",
        shopifyProdBaseURL,
        prodThemeID
      );

      let previewURLsText: string = "";

      if (!devThemePreview && !prodThemePreview) {
        return;
      }

      if (!devThemePreview) {
        previewURLsText = `
Store preview URLs: 
  ${chalk.cyanBright(prodThemePreview)}`;
      }

      if (!prodThemePreview) {
        previewURLsText = `
Store preview URLs: 
  ${chalk.cyanBright(devThemePreview)}`;
      }

      if (devThemePreview && prodThemePreview) {
        previewURLsText = `
Store preview URLs: 
  ${chalk.cyanBright(devThemePreview)}
  ${chalk.cyanBright(prodThemePreview)}`;
      }

      console.log(previewURLsText);
    }
  } catch (error) {
    console.error(chalk.redBright("Error: "), error);
  }
};
