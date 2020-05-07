import fs from "fs";
import path from "path";
import errors from "../errors";
import getConfigYML, { ConfigYML } from "./getConfigYML";
import { getProperty, pipe } from "../utils";

const fsPromises = fs.promises;

const FILE_NAMES = {
  textToolsConfig: "texttoolsconfig.json",
  textToolsPR: "texttoolspr.json",
};

const URL_PROPS = {
  protocol: "https",
};

export type ConfigURLs = {
  jira: {
    prefix?: string;
    base: string;
  };
  shopify: {
    hash?: string;
    editor?: string;
    base: {
      dev: string;
      prod: string;
    };
  };
};

/***
 * Config Type
 * ================================
 */
export type Config = {
  workingDirectory: string;
  urls: ConfigURLs;
  ticket: {
    id: string;
  };
  themes: {
    dev: string;
    prod: string;
  };
  branch: {
    type: string;
  };
  pr: {
    title: string;
  };
  author?: string;
  github: {
    repo: string;
    owner: string;
    token?: string;
  };
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
    const conf = require("../../config.json");
    const workingDirectory = conf.workingDirectory;
    if (!workingDirectory || !fs.existsSync(workingDirectory)) {
      return Promise.reject(new Error(errors.workingDirectory));
    }

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

    // check texttoolspr.json
    const textToolsPRPath = path.join(workingDirectory, FILE_NAMES.textToolsPR);
    if (!fs.existsSync(textToolsPRPath)) {
      return Promise.reject(errors.textToolsPR);
    }

    const textToolsPRBuf = await fsPromises.readFile(textToolsPRPath, "UTF-8");
    const textToolsPR = JSON.parse(textToolsPRBuf.toString());

    return Promise.resolve({
      workingDirectory,
      ...textToolsCofig,
      ...textToolsPR,
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
