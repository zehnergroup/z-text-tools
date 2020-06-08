import fs from "fs";
import path from "path";
import errors from "../errors";

const fsPromises = fs.promises;

const FILE_NAMES = {
  textToolsConfig: "texttoolsconfig.json",
  textToolsPR: "texttoolspr.json",
};

export const getTextToolsPR = async (
  workingDirectory: string
): Promise<any> => {
  try {
    // check texttoolspr.json
    const textToolsPRPath = path.join(workingDirectory, FILE_NAMES.textToolsPR);
    if (!fs.existsSync(textToolsPRPath)) {
      return Promise.reject(errors.textToolsPR);
    }

    const textToolsPRBuf = await fsPromises.readFile(textToolsPRPath, "UTF-8");
    const textToolsPR = JSON.parse(textToolsPRBuf.toString());
  } catch (error) {}
};
