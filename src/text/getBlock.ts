import getBlockSettings from "./getBlockSettings";

const initBlock = {
  type: "card_carousel",
  name: "Card Carousel",
  settings: getBlockSettings(15),
};

export default (): any => initBlock;
