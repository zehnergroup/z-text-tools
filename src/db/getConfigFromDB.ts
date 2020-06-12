import Lowdb = require("lowdb");
import { Config } from "../types";
import { getConfig } from "../config";

export default async (
  workingDirectory: string,
  dbAdapter: Lowdb.LowdbSync<any>
): Promise<Config> => {
  try {
    const config: Config = dbAdapter.get("config").value();
    const _config: Config = await getConfig(workingDirectory);
    dbAdapter.set("config", { ...config, ..._config }).write();
    return Promise.resolve(dbAdapter.get("config").value());
  } catch (error) {
    return Promise.reject(error);
  }
};
