import getDBAdapter from "../db/getDBAdapter";
import isEmpty from "lodash.isempty";
import { Feature } from "../types";

export default async (
  workingDirectory: string,
  id: number
): Promise<Feature | null> => {
  try {
    const db = await getDBAdapter(workingDirectory);
    const feature: Feature = db
      .get("features")
      .find({ ticket: { id: id } })
      .value();

    return !feature || isEmpty(feature)
      ? Promise.resolve(null)
      : Promise.resolve(feature);
  } catch (error) {
    return Promise.reject(error);
  }
};
