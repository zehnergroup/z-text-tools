import fs from "fs";
import errors from "../errors";

/**
 * Checks if provided path exists in the file system
 * Returns a promise resolved with existing path or error
 */
export default async (pathToCheck: string): Promise<string> =>
  fs.existsSync(pathToCheck)
    ? Promise.resolve(pathToCheck)
    : Promise.reject(new Error(errors.workingDirectory(pathToCheck)));
