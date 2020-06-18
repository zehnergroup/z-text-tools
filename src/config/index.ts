import fs from "fs";
import path from "path";
import errors from "../errors";
import { Config, YMLConfig } from "../types";

import getYMLConfig from "./getYMLConfig";

const fsPromises = fs.promises;

const FILE_NAMES = {
  textToolsConfig: "texttoolsconfig.json",
};

const URL_PROPS = {
  protocol: "https",
};

const withStoreURLs = (
  configYML: YMLConfig,
  textToolsShopifyConfig: any = {}
): Function => () => {
  const textToolsBaseURLs = textToolsShopifyConfig.base || {};
  const dev =
    configYML.development.store || textToolsBaseURLs.dev
      ? `${URL_PROPS.protocol}://${configYML.development.store}` ||
        textToolsBaseURLs.dev
      : null;
  const prod =
    configYML.production.store || textToolsBaseURLs.prod
      ? `${URL_PROPS.protocol}://${configYML.production.store}` ||
        textToolsBaseURLs.prod
      : null;

  return {
    ...textToolsShopifyConfig,
    base: {
      dev,
      prod,
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

    const textToolsConfig = JSON.parse(textToolsCofigBuf.toString());

    return Promise.resolve({
      ...textToolsConfig,
      shopify: withStoreURLs(configYML, textToolsConfig.shopify)(),
    });
  } catch (err) {
    return Promise.reject(err);
  }
};
