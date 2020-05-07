import getCMSSchema from "./getCMSSchema";
import replaceCMSSchema from "./replaceCMSSchema";
import getBlock from "./text/getBlock";

const blockType = "card_carousel";

export default async (
  workingDirectory: string,
  fileName: string
): Promise<void> => {
  const CMSSchema = await getCMSSchema(workingDirectory, fileName);
  const blocks = CMSSchema.blocks;

  // console.log(CMSSchema);
  const blocksUpdated =
    Array.isArray &&
    blocks.map((bl: any) => {
      if (bl.type === blockType) {
        return getBlock();
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
