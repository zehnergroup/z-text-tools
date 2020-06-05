import fs from "fs";
import errors from "../errors";

export default async (): Promise<string> => {
  try {
    const conf = require("../../config.json");
    const workingDirectory = conf.workingDirectory;
    if (!workingDirectory || !fs.existsSync(workingDirectory)) {
      return Promise.reject(new Error(errors.workingDirectory));
    }

    return Promise.resolve(workingDirectory);
  } catch (error) {
    return Promise.reject(error);
  }
};
