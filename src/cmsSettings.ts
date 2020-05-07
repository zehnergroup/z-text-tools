import path from "path";
import fs from "fs";
import { getConfig, Config } from "./config";

import getBlock from "./text/getBlock";
import updateConfigYML from "./config/updateConfigYML";
import updateBlock from "./updateBlock";

// FS Promises Interface
const fsPromises = fs.promises;
(async () => {
  const config: Config = await getConfig();

  const {
    workingDirectory,
    ticket: { id: ticketID },
  } = config;

  const block = getBlock();

  // Block Body
  await fsPromises
    .mkdir(
      path.join(workingDirectory, "text-tools-out", `${ticketID}`, `blocks`),
      {
        recursive: true,
      }
    )
    .then(() =>
      fsPromises.writeFile(
        path.join(
          workingDirectory,
          "text-tools-out",
          `${ticketID}`,
          "blocks",
          "card-carousel.json"
        ),
        JSON.stringify(block, null, 2)
      )
    );
  console.log(`Created: Card Carousel Block`);
  const fileNames = [
    "page-reviews",
    "page-about-us",
    "page-cms",
    "page-our-philosophy",
    "page-puppy-feeding-1",
    "page-puppy-feeding-2",
    "page-puppy-feeding-3",
    "page-cms",
  ];

  fileNames
    .map((fn) => `${fn}.liquid`)
    .forEach((fn) => {
      updateBlock(workingDirectory, fn);
    });
})().catch((err) => {
  console.log(err);
});
