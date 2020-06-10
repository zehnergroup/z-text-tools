import fs from "fs";
import path from "path";
import errors from "../errors";

const fsPromises = fs.promises;
const CONFIG_FILE_NAME = "config.yml";

export default async (
  workingDirectory: string,
  ymlComment: string
): Promise<void> => {
  try {
    // check config.yml
    const configYMLPath = path.join(workingDirectory, CONFIG_FILE_NAME);
    if (!fs.existsSync(configYMLPath)) {
      return Promise.reject(errors.configYML.DNE);
    }

    const configYMLStr: string = (
      await fsPromises.readFile(configYMLPath, "UTF-8")
    ).toString();

    const regex = /#.*\n|\r/gm;
    let m;
    let lastCommentStr = "";

    while ((m = regex.exec(configYMLStr)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }

      // The result can be accessed through the `m`-variable.
      lastCommentStr = m[m.length - 1];
    }

    if (!lastCommentStr.includes(ymlComment)) {
      const configUPD = configYMLStr.replace(
        lastCommentStr,
        `${lastCommentStr}${ymlComment}\n`
      );

      await fsPromises.writeFile(configYMLPath, configUPD);
      console.log(`Updated config.yml with ${ymlComment}`);
    }
  } catch (error) {
    Promise.reject(error);
  }
};
