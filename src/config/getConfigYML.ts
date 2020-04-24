import fs from "fs";
import yaml, { JSON_SCHEMA } from "js-yaml";
import path from "path";
import errors from "../errors";

const fsPromises = fs.promises;

const CONFIG_FILE_NAME = "config.yml";

type ThemeConfig = {
  theme_id?: number;
  store?: string;
};

export type ConfigYML = {
  development: ThemeConfig;
  production: ThemeConfig;
};

export default async (): Promise<ConfigYML> => {
  const conf = require("../../config.json");
  const workingDirectory = conf.workingDirectory;
  if (!workingDirectory || !fs.existsSync(workingDirectory)) {
    return Promise.reject(new Error(errors.workingDirectory));
  }

  // check config.yml
  const configYMLPath = path.join(workingDirectory, CONFIG_FILE_NAME);
  if (!fs.existsSync(configYMLPath)) {
    return Promise.reject(errors.configYML.DNE);
  }

  const configYMLBuf = await fsPromises.readFile(configYMLPath, "UTF-8");

  // Get document, or throw exception on error
  try {
    const doc: ConfigYML = yaml.safeLoad(configYMLBuf.toString(), {
      schema: JSON_SCHEMA,
    });
    return Promise.resolve(doc);
  } catch (e) {
    return Promise.reject(errors.configYML.readFailed(e));
  }
};
