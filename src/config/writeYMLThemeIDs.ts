import fs from "fs";
import path from "path";
import YAML from "yaml";

import errors from "../errors";
import getConfigYML from "./getConfigYML";
import getWorkingDirectory from "./getWorkingDirectory";
import { ConfigYML } from "../types";
import getConfigYMLDocument from "./getConfigYMLDocument";
import { YAMLError } from "yaml/util";

const fsPromises = fs.promises;

const CONFIG_FILE_NAME = "config.yml";

export default async (
  devThemeID?: number,
  prodTheemID?: number
): Promise<void> => {
  try {
    const workingDirectory = await getWorkingDirectory();

    // get config.yml
    const configYMLDocument = await getConfigYMLDocument();
    const configYML: ConfigYML = configYMLDocument.toJSON();
    const configYMLCommentBefore: string | null | undefined =
      configYMLDocument.commentBefore;

    const configYMLUPD: ConfigYML = {
      ...configYML,
      development: {
        ...configYML.development,
        ["theme_id"]: devThemeID,
      },
      production: {
        ...configYML.production,
        ["theme_id"]: prodTheemID,
      },
    };

    // check config.yml
    const configYMLPath = path.join(workingDirectory, CONFIG_FILE_NAME);

    let configYMLDocumentUPD = new YAML.Document();
    configYMLDocumentUPD.contents = configYMLUPD;
    configYMLDocumentUPD.commentBefore = configYMLCommentBefore;

    await fsPromises.writeFile(configYMLPath, configYMLDocumentUPD.toString());
    console.log(
      `Updated config.yml with  dev: ${devThemeID}, prod: ${prodTheemID} theme IDs`
    );
  } catch (error) {
    Promise.reject(error);
  }
};
