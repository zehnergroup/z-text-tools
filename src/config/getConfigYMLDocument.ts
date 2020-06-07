import fs from "fs";
import YAML from "yaml";

import path from "path";
import errors from "../errors";
import getWorkingDirectory from "../db/getWorkingDirectory";
const fsPromises = fs.promises;

const CONFIG_FILE_NAME = "config.yml";

export default async (): Promise<YAML.Document.Parsed> => {
  // Get document, or throw exception on error
  try {
    const workingDirectory = await getWorkingDirectory();

    // check config.yml
    const configYMLPath = path.join(workingDirectory, CONFIG_FILE_NAME);
    if (!fs.existsSync(configYMLPath)) {
      return Promise.reject(errors.configYML.DNE);
    }

    const configYMLBuf = await fsPromises.readFile(configYMLPath, "UTF-8");

    const document = YAML.parseDocument(configYMLBuf.toString());

    return Promise.resolve(document);
  } catch (e) {
    return Promise.reject(errors.configYML.readFailed(e));
  }
};
