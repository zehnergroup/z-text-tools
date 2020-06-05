import fs from "fs";
import path from "path";
import errors from "../errors";
import getConfigYML from "./getConfigYML";
import { getProperty, pipe } from "../utils";

import { ConfigGithub, ConfigURLs } from "../types";

const fsPromises = fs.promises;

const FILE_NAMES = {
  textToolsConfig: "texttoolsconfig.json",
  textToolsPR: "texttoolspr.json",
};

export const getTextToolsPR = async (): Promise<any> => {
  try {
    const conf = require("../../config.json");
    const workingDirectory = conf.workingDirectory;
    if (!workingDirectory || !fs.existsSync(workingDirectory)) {
      return Promise.reject(new Error(errors.workingDirectory));
    }

    // check texttoolspr.json
    const textToolsPRPath = path.join(workingDirectory, FILE_NAMES.textToolsPR);
    if (!fs.existsSync(textToolsPRPath)) {
      return Promise.reject(errors.textToolsPR);
    }

    const textToolsPRBuf = await fsPromises.readFile(textToolsPRPath, "UTF-8");
    const textToolsPR = JSON.parse(textToolsPRBuf.toString());
  } catch (error) {}
};
