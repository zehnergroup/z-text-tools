import fs from "fs";
import path from "path";
import errors from "../errors";
import { Config, ConfigYML } from "../types";

import getConfigYML from "./getConfigYML";
import getWorkingDirectory from "./getWorkingDirectory";

import { getProperty, pipe } from "../utils";

const fsPromises = fs.promises;

const FILE_NAMES = {
  textToolsConfig: "texttoolsconfig.json",
  textToolsPR: "texttoolspr.json",
};

const URL_PROPS = {
  protocol: "https",
};

// TODO create type/interface TextToolsConfig
const withStoreURLs = (
  configYML: ConfigYML,
  textToolsShopifyURLs: any = {}
): Function => (configURLs: any) => {
  const textToolsBaseURLs = textToolsShopifyURLs.base || {};

  return {
    ...configURLs,
    shopify: {
      ...textToolsShopifyURLs,
      base: {
        dev:
          `${URL_PROPS.protocol}://${configYML.development.store}` ||
          textToolsBaseURLs.dev,
        prod:
          `${URL_PROPS.protocol}://${configYML.production.store}` ||
          textToolsBaseURLs.prod,
      },
    },
  };
};

/**
 * Resolves merged config:Config
 * from provided workingDirectory path
 */
export const getConfig = async (): Promise<Config> => {
  try {
    // get working directory
    const workingDirectory = await getWorkingDirectory();

    // get config.yml
    const configYML: ConfigYML = await getConfigYML();

    // check texttoolsconfig.json
    const textToolsConfigPath = path.join(
      workingDirectory,
      FILE_NAMES.textToolsConfig
    );
    if (!fs.existsSync(textToolsConfigPath)) {
      return Promise.reject(errors.textToolsCofig);
    }

    const textToolsCofigBuf = await fsPromises.readFile(
      textToolsConfigPath,
      "UTF-8"
    );

    const textToolsCofig = JSON.parse(textToolsCofigBuf.toString());

    return Promise.resolve({
      workingDirectory,
      ...textToolsCofig,
      // ...textToolsPR,
      urls: pipe(
        withStoreURLs(
          configYML,
          getProperty(textToolsCofig)(["urls", "shopify"])
        )
      )(textToolsCofig.urls),
    });
  } catch (err) {
    return Promise.reject(err);
  }
};
