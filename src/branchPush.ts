import { Config, Feature } from "./types";
import getCurrentFeature from "./feature/getCurrentFeature";
import getDBAdapter from "./db/getDBAdapter";
import branchPush from "./branch/branchPush";

(async () => {
  const db = await getDBAdapter();
  const config: Config = db.get("config").value();

  const currentFeature: Feature | null = await getCurrentFeature();

  if (currentFeature && config) {
    branchPush(currentFeature, config);
  }

  // TODO handle otherwise
})().catch((err) => {
  console.log(err);
});
