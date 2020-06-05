import isEmpty from "lodash.isempty";

import { Feature, Config } from "./types";
import { getConfig } from "./config";
import getDBAdapter from "./db/getDBAdapter";

(async () => {
  try {
    const db = await getDBAdapter();
    const config: Config = db.get("config").value();

    if (isEmpty(config)) {
      const _config: Config = await getConfig();
      db.set("config", _config).write();
    }
  } catch (error) {
    console.log(error);
  }
})();
