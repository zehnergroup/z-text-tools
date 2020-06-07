import low from "lowdb";
import path from "path";

import FileSync from "lowdb/adapters/FileSync";

import { ZToolsDB } from "../types";

const FILE_NAMES = {
  config: "config.json",
};

/**
 * Returns a local DB adapter connected to config.json
 *
 * config.json keeps track of a workingDirectory path
 * if explicitly initialized
 *
 * Sets defaults as a side effect
 */
export default async (): Promise<low.LowdbSync<ZToolsDB>> => {
  try {
    const adapter = await new FileSync<ZToolsDB>(
      path.join(__dirname, "/..", FILE_NAMES.config)
    );

    const db = low(adapter);
    // Set some defaults (required if your JSON file is empty)
    await db.defaults({ workingDirectory: null }).write();

    return Promise.resolve(db);
  } catch (error) {
    return Promise.reject(error);
  }
};
