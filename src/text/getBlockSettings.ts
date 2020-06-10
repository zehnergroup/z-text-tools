const interpolateStringWithIndex = (indexNumber: number) => (
  str: string
): string => str.replace(/{{i}}/gm, indexNumber + "");

const interpolaterepeatedSettings = (indexNumber: number) => (
  repeatedSettings: object[]
) =>
  repeatedSettings.map((settingsObj: any) =>
    Object.entries(settingsObj).reduce(
      (updSettingsObj: object, entry: any[]) => ({
        ...updSettingsObj,
        [entry[0]]:
          typeof entry[1] === "string"
            ? interpolateStringWithIndex(indexNumber)(entry[1])
            : entry[1],
      }),
      {}
    )
  );

export default (blockTemplate: any, timesRepeat: number): object[] => {
  return [
    ...(() => [...(blockTemplate.commonSettings || [])])(),
    ...(() => {
      let settings: object[] = [];

      for (let i = 0; i < timesRepeat; i++) {
        settings = [
          ...settings,
          ...interpolaterepeatedSettings(i + 1)(blockTemplate.repeatedSettings)
            .filter(
              (settingsObj: any) =>
                typeof settingsObj.stopIndex !== "number" ||
                i <= settingsObj.stopIndex
            ) // remove object beyond the stop index
            .map((settingsObj: any) =>
              typeof settingsObj.stopIndex === "number"
                ? delete settingsObj.stopIndex && settingsObj
                : settingsObj
            ),
        ];
      }

      return settings;
    })(),
  ];
};
