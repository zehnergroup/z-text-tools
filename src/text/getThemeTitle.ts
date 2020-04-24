export default (
  ticketID: string,
  prTitle: string,
  author: string = ""
): string => `[${ticketID}] - ${prTitle} - (${author})`;
