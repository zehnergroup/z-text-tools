import { YMLConfig } from "../types";
import getYMLConfigDocument from "./getYMLConfigDocument";

export default async (workingDirectory: string): Promise<YMLConfig> => {
  try {
    const configYMLDocument = await getYMLConfigDocument(workingDirectory);
    return Promise.resolve(configYMLDocument.toJSON());
  } catch (e) {
    return Promise.reject(e);
  }
};
