import getBlockSettings from "./getBlockSettings";

export default (blockTemplate: any, timesRepeat: number): any => ({
  type: blockTemplate.type,
  name: blockTemplate.name,
  settings: getBlockSettings(blockTemplate, timesRepeat),
});
