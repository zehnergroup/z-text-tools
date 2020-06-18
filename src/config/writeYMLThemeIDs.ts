import fs from "fs";
import path from "path";
import YAML from "yaml";
import { YMLConfig } from "../types";
import getYMLConfigDocument from "./getYMLConfigDocument";

const fsPromises = fs.promises;

const CONFIG_FILE_NAME = "config.yml";

export default async (
  workingDirectory: string,
  devThemeID?: number,
  prodThemeID?: number
): Promise<void> => {
  try {
    // get config.yml
    const configYMLDocument = await getYMLConfigDocument(workingDirectory);
    const configYML: YMLConfig = configYMLDocument.toJSON();
    const configYMLCommentBefore: string | null | undefined =
      configYMLDocument.commentBefore;

    const configYMLUPD: YMLConfig = {
      ...configYML,
      development: {
        ...configYML.development,
        ["theme_id"]: devThemeID,
      },
      production: {
        ...configYML.production,
        ["theme_id"]: prodThemeID,
      },
    };

    // check config.yml
    const configYMLPath = path.join(workingDirectory, CONFIG_FILE_NAME);

    let configYMLDocumentUPD = new YAML.Document();
    configYMLDocumentUPD.contents = configYMLUPD;
    configYMLDocumentUPD.commentBefore = configYMLCommentBefore;

    await fsPromises.writeFile(configYMLPath, configYMLDocumentUPD.toString());
  } catch (error) {
    Promise.reject(error);
  }
};
