import fs from "fs";
import path from "path";
import errors from "../errors";
import { Config, YMLConfig } from "../types";

import getYMLConfig from "./getYMLConfig";
import { getProperty, pipe } from "../utils";

const fsPromises = fs.promises;

const FILE_NAMES = {
  textToolsConfig: "texttoolsconfig.json",
};

const URL_PROPS = {
  protocol: "https",
};

// TODO create type/interface TextToolsConfig
const withStoreURLs = (
  configYML: YMLConfig,
  textToolsShopifyConfig: any = {}
): Function => (configURLs: any) => {
  const textToolsBaseURLs = textToolsShopifyConfig.base || {};

  return {
    ...configURLs,
    shopify: {
      ...textToolsShopifyConfig,
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
export const getConfig = async (workingDirectory: string): Promise<Config> => {
  try {
    // get config.yml
    const configYML: YMLConfig = await getYMLConfig(workingDirectory);

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
      ...textToolsCofig,
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
