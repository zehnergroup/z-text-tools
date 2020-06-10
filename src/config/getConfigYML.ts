import { ConfigYML } from "../types";
import getConfigYMLDocument from "./getConfigYMLDocument";

export default async (workingDirectory: string): Promise<ConfigYML> => {
  try {
    const configYMLDocument = await getConfigYMLDocument(workingDirectory);
    return Promise.resolve(configYMLDocument.toJSON());
  } catch (e) {
    return Promise.reject(e);
  }
};
