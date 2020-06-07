import checkoutFeature from "../feature/checkoutFeature";

export const command = "checkout";
export const desc = "Checkout feature";
export const builder = {
  id: {
    describe: "Provide ticket id",
    demand: true,
    aliases: ["i", "feature", "f"],
  },
};

export const handler = (argv: any) => {
  try {
    const id: number = <number>argv.id;

    if (id) {
      checkoutFeature(id);
    }
  } catch (error) {
    // no config error
  }
};
