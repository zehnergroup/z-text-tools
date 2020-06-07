import fs from "fs";
import errors from "../errors";
import getLocalDBAdapter from "./getLocalDBAdapter";

/**
 * Checks if provided path exists in the file system
 * Returns a promise resolved with existing path or error
 */
export default async (): Promise<string> => {
  try {
    const db = await getLocalDBAdapter();
    const workingDirectory =
      db.get("workingDirectory").value() || process.cwd();

    if (!workingDirectory || !fs.existsSync(workingDirectory)) {
      return Promise.reject(new Error(errors.workingDirectory));
    }

    return Promise.resolve(workingDirectory);
  } catch (error) {
    return Promise.reject(error);
  }
};
