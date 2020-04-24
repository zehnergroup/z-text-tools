export default (ticketID: string, branchType: string, prTitle: string) =>
  `${
    branchType.charAt(0).toUpperCase() + branchType.slice(1)
  } | ${ticketID} | ${prTitle}`;
