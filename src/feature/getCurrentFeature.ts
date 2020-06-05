import getDBAdapter from "../db/getDBAdapter";
import { Feature } from "../types";
import errors from "../errors";
import getFeatureByID from "./getFeatureByID";

export default async (): Promise<Feature | null> => {
  try {
    const db = await getDBAdapter();
    const currentFeatureID: number | null = db.get("currentFeature").value();

    if (!currentFeatureID) {
      return Promise.reject(new Error(errors.featureCheckout));
    }

    return Promise.resolve(await getFeatureByID(currentFeatureID));
  } catch (error) {
    return Promise.reject(error);
  }
};
