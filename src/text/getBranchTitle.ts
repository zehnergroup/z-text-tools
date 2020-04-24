import getFileNameHandle from "./getFileNameHandle";

export default (
  ticketID: string,
  prTitle: string,
  branchType: string
): string => `${branchType}/${ticketID}/${getFileNameHandle(prTitle)}`;
