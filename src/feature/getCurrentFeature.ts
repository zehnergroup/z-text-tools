import getDBAdapter from "../db/getDBAdapter";
import { Feature } from "../types";
import errors from "../errors";
import getFeatureByID from "./getFeatureByID";

export default async (workingDirectory: string): Promise<Feature | null> => {
  try {
    const db = await getDBAdapter(workingDirectory);
    const currentFeatureID: number | null = db.get("currentFeature").value();

    if (!currentFeatureID) {
      return Promise.reject(new Error(errors.featureCheckout));
    }

    return Promise.resolve(await getFeatureByID(workingDirectory, currentFeatureID));
  } catch (error) {
    return Promise.reject(error);
  }
};
