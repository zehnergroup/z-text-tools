import fs from "fs";
import path from "path";
import errors from "./errors";

const fsPromises = fs.promises;
const innerPath = "src/sections";

export default async (
  workingDirectory: string,
  fileName: string,
  newCMSSchema: string
): Promise<void | Error> => {
  const newCMSSchemaWithLiquidTags = `{% schema %}
  ${newCMSSchema}
{% endschema %}`;

  if (!workingDirectory || !fs.existsSync(workingDirectory)) {
    return Promise.reject(new Error(errors.workingDirectory));
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

  // find json
  const regex = /{% schema %}(.*?){% endschema %}/gms;
  const CMSSchemaUpdated = fileStr.replace(regex, newCMSSchemaWithLiquidTags);

  if (CMSSchemaUpdated) {
    // await fsPromises.writeFile(filePath, CMSSchemaUpdated);
    console.log(`Updated ${fileName}`);
  }
};
