import low from "lowdb";
import path from "path";

import FileSync from "lowdb/adapters/FileSync";
import getWorkingDirectory from "../config/getWorkingDirectory";

import { Database } from "../types";

const FILE_NAMES = {
  textToolsDB: "texttoolsdb.json",
};

/**
 * Sets defaults as a side effect
 */
export default async (): Promise<low.LowdbSync<Database>> => {
  try {
    // get working directory
    const workingDirectory = await getWorkingDirectory();
    const adapter = new FileSync<Database>(
      path.join(workingDirectory, FILE_NAMES.textToolsDB)
    );

    const db = low(adapter);
    // Set some defaults (required if your JSON file is empty)
    db.defaults({ features: [], config: {}, currentFeature: null }).write();

    return Promise.resolve(db);
  } catch (error) {
    return Promise.reject(error);
  }
};
