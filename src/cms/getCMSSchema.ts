import fs from "fs";
import path from "path";
import errors from "../errors";

const innerPath = "src/sections";
const fsPromises = fs.promises;

export default async (
  workingDirectory: string,
  fileName: string
): Promise<any | Error> => {
  if (!workingDirectory || !fs.existsSync(workingDirectory)) {
    return Promise.reject(new Error(errors.workingDirectory(workingDirectory)));
  }

  // check config.yml
  const filePath = path.join(workingDirectory, `${innerPath}/${fileName}`);
  if (!fs.existsSync(filePath)) {
    return Promise.reject(new Error(`File does not exist: ${fileName}`));
  }

  // read file
  const fileStr: string = (
    await fsPromises.readFile(filePath, "UTF-8")
  ).toString();

  // console.log(fileStr);
  // find json
  const regex = /{% schema %}(.*?){% endschema %}/gms;
  const m = regex.exec(fileStr);

  const schemaStr = m && m.length > 0 && m[1];

  if (!schemaStr) {
    return Promise.reject(
      new Error(`${fileName}: Can not access schema liquid tag`)
    );
  }

  try {
    // parse json
    const cmsSchema = JSON.parse(schemaStr);
    return cmsSchema;
  } catch (error) {
    return Promise.reject(new Error(`${fileName}: Error parsing JSON schema`));
  }
};
