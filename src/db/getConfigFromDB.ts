import Lowdb = require("lowdb");
import { Config } from "../types";
import isEmpty from "lodash.isempty";
import { getConfig } from "../config";

export default async (
  workingDirectory: string,
  dbAdapter: Lowdb.LowdbSync<any>
): Promise<Config> => {
  try {
    const config: Config = dbAdapter.get("config").value();

    // create config, if not  created
    if (isEmpty(config)) {
      const _config: Config = await getConfig(workingDirectory);
      dbAdapter.set("config", _config).write();
      return Promise.resolve(dbAdapter.get("config").value());
    }

    return Promise.resolve(config);
  } catch (error) {
    return Promise.reject(error);
  }
};
