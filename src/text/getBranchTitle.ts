import getFileNameHandle from "./getFileNameHandle";

export default (
  ticketID: string,
  prTitle: string,
  branchType: string = "feature"
): string => `${branchType}/${ticketID}/${getFileNameHandle(prTitle)}`;
