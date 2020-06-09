import getCMSSchema from "./getCMSSchema";
import replaceCMSSchema from "./replaceCMSSchema";
import getBlock from "../text/getBlock";

export default async (
  workingDirectory: string,
  fileName: string,
  blockType: string,
  blockTemplateFilename: string,
  timesRepeat: number
): Promise<void> => {
  const CMSSchema = await getCMSSchema(workingDirectory, fileName);
  const blocks = CMSSchema.blocks;

  const blocksUpdated =
    Array.isArray &&
    blocks.map((bl: any) => {
      if (bl.type === blockType) {
        return getBlock(blockTemplateFilename, timesRepeat);
      }
      return bl;
    });

  if (Array.isArray(blocksUpdated)) {
    const CMSSchemaUpdated = { ...CMSSchema, blocks: blocksUpdated };
    replaceCMSSchema(
      workingDirectory,
      fileName,
      JSON.stringify(CMSSchemaUpdated, null, 2)
    );
  }
};
