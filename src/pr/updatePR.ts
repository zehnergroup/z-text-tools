import getDBAdapter from "../db/getDBAdapter";
import { PR } from "../types";
import errors from "../errors";

export default async (workingDirectory: string, newPR: PR): Promise<void> => {
  try {
    const db = await getDBAdapter(workingDirectory);
    const currentFeatureID: number | null = db.get("currentFeature").value();

    if (!currentFeatureID) {
      return Promise.reject(new Error(errors.featureCheckout));
    }

    await db
      .get("features")
      .find({ ticket: { id: currentFeatureID } })
      .update("pr", (oldPR) => ({ ...oldPR, ...newPR }))
      .write();

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};
