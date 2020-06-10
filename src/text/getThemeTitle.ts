export default (
  ticketID: string,
  featureTitle: string,
  author: string = ""
): string => `[${ticketID}] - ${featureTitle} - (${author})`;
