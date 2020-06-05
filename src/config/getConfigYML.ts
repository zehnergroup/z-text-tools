import { ConfigYML } from "../types";
import getConfigYMLDocument from "./getConfigYMLDocument";

export default async (): Promise<ConfigYML> => {
  try {
    const configYMLDocument = await getConfigYMLDocument();
    return Promise.resolve(configYMLDocument.toJSON());
  } catch (e) {
    return Promise.reject(e);
  }
};
