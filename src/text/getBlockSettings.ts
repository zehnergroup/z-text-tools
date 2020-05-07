const initSettings = [
  {
    type: "header",
    content: "Header",
  },
  {
    type: "text",
    id: "title",
    label: "Title",
  },
];

const getIndexedSettings = (index: number): object[] => [
  {
    type: "header",
    content: `Dog ${index + 1}`,
  },
  {
    type: "text",
    id: `dog_name_${index + 1}`,
    label: "Name",
  },
  {
    type: "text",
    id: `dog_title_${index + 1}`,
    label: "Title",
  },
  {
    type: "textarea",
    id: `dog_bio_${index + 1}`,
    label: "Bio",
  },
  {
    type: "image_picker",
    id: `dog_image_${index + 1}`,
    label: "Image",
    info: "Dimensions (460 x 340). Image is required.",
  },
  {
    type: "select",
    id: `dog_bg_${index + 1}`,
    label: "Background Color",
    options: [
      { value: "white", label: "White" },
      { value: "rust", label: "Rust (Orange)" },
      { value: "cream", label: "Cream" },
      { value: "crimson", label: "Crimson" },
      { value: "cupid", label: "Cupid (Pink)" },
      { value: "fern", label: "Fern (Light Green)" },
      { value: "sun", label: "Sun" },
      { value: "malibu", label: "Malibu (Light Blue)" },
    ],
    default: "cream",
  },
];

export default (numIndexedBlocks: number): object[] => [
  ...initSettings,
  ...(() => {
    let settings: object[] = [];

    for (let i = 0; i < numIndexedBlocks; i++) {
      settings = [...settings, ...getIndexedSettings(i)];
    }

    return settings;
  })(),
];
