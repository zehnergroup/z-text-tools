import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";

import { Feature, Config } from "./types";
import { getConfig } from "./config";

interface Database {
  features: Feature[];
}

(async () => {
  const config: Config = await getConfig();

  console.log(config);

  const adapter = new FileSync<Database>(".texttoolsdb.json");
  const db = low(adapter);
  // Set some defaults (required if your JSON file is empty)
  db.defaults({ features: [], config }).write();

  const feature = db.get("features");

  console.log(feature);
})();
